import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { loadData } from "../../utils/loadData";
// import { submitProfile } from "./useSubmit";
import { submitImage, submitProfile } from "./useSubmit";
export type TPerson = {
  email: string;
  password: string;
  image: string;
  name: string;
  role: string;
};


const Profile = () => {
  const [prevData, setPrevData] = useState<TPerson>({
    name: "",
    image: "",
    email: "",
    password: "",
    role: "",
  });
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = useContext(AuthContext);
  useEffect(() => {
    if (currentUser) {
      loadData(currentUser, setPrevData);
    }
  }, [currentUser]);
  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (currentUser) {
      const result = await submitProfile(e, currentUser);
      if (typeof result === "string") {
        setLoading(false);
      } else {
        setErr(true);
      }
    }
  };
  const handleImage = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (currentUser) {
      const result = await submitImage(e, currentUser);
      if (typeof result === "string") {
        setLoading(false);
        window.location.reload();
      } else {
        setErr(true);
      }
    }
  };

  return (
    <>
      <Navbar />
      {prevData ? <img style={{ width: 200 }} src={prevData.image} /> : <></>}
      <form onSubmit={handleImage}>
        <input style={{ display: "none" }} name="file" type="file" id="file" />
        <label htmlFor="file">
          <span>Add an avatar</span>
        </label>
        <button>Update avatar</button>
      </form>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: 350,
        }}
      >
        <>
          <div>Name</div>
          <input
            type="text"
            placeholder="name"
            name="name"
            defaultValue={prevData.name}
          />
        </>
        <>
          <div>Email</div>
          <input
            type="email"
            placeholder="email"
            name="email"
            defaultValue={prevData.email}
          />
        </>
        <>
          <div>Password</div>
          <input
            type="password"
            placeholder="password"
            name="password"
            defaultValue={prevData.password}
          />
        </>
        <>
          <div>Reconfirm password</div>
          <input
            type="text"
            placeholder="reconfirm password"
            defaultValue={prevData.password}
          />
        </>
        <button disabled={loading}>Update</button>
        {loading && "Uploading and compressing the image please wait..."}
        {err && <span>Something went wrong</span>}
      </form>
    </>
  );
};

export default Profile;
