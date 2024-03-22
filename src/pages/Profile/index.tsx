import { Dispatch, FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { User } from "firebase/auth";
export type TPerson = {
  email: string;
  image: string;
  name: string;
  role: string;
};
const Profile = () => {
  const navigate = useNavigate();
  const [prevData, setPrevData] = useState<TPerson>({
    name: "",
    image: "",
    email: "",
    role: "",
  });
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  // take uid then create user data with uid then save in user table
  const currentUser = useContext(AuthContext);
  const loadData = async (currentUser: User, setState: Dispatch<TPerson>) => {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    console.log("Data: ", docSnap.data());
    console.log("Id: ", docSnap.data()?.uid);
    setState({
      name: docSnap.data()?.name,
      image: docSnap.data()?.image,
      email: docSnap.data()?.email,
      role: docSnap.data()?.role,
    });
    return docSnap.data();
  };
  useEffect(() => {
    if (currentUser) {
      loadData(currentUser, setPrevData);
    }
  }, [currentUser]);
  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      email: { value: string };
      password: { value: string };
      file: { files: FileList };
    };
    const name = target.name.value;
    const email = target.email.value;
    const date = new Date().getTime();
    const file = target.file.files[0];
    console.log(file);
    const storageRef = ref(storage, `${name + date}`);
    await uploadBytesResumable(storageRef, file)
      .then(() => {
        getDownloadURL(storageRef)
          .then(async (downloadURL) => {
            if (currentUser) {
              await setDoc(doc(db, "users", currentUser.uid), {
                uid: currentUser.uid,
                name,
                email,
                role: "",
                image: downloadURL,
              })
                .then(() => {
                  navigate("/home");
                })
                .catch((err) => {
                  console.log("1st: ", err);
                  setErr(true);
                });
            }
          })
          .catch((err) => {
            console.log("2nd: ", err);
          });
      })
      .catch((err) => {
        console.log("3rd: ", err);
      });
  };

  return (
    <>
      {prevData ? <img style={{ width: 200 }} src={prevData.image} /> : <></>}
      <form onSubmit={handleSubmit}>
        <input
          required
          type="text"
          placeholder="name"
          name="name"
          value={prevData.name}
        />
        <input
          required
          type="email"
          placeholder="email"
          name="email"
          value={prevData.email}
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
        />
        <input required type="text" placeholder="reconfirm password" />
        <input
          required
          style={{ display: "none" }}
          name="file"
          type="file"
          id="file"
        />
        <label htmlFor="file">
          <span>Add an avatar</span>
        </label>
        <button disabled={loading}>Update</button>
        {loading && "Uploading and compressing the image please wait..."}
        {err && <span>Something went wrong</span>}
      </form>
    </>
  );
};

export default Profile;
