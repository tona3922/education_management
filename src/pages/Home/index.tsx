import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import CreateAccount from "../CreateAccount";
import { AuthContext } from "../../context/AuthContext";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
const loadRole = async (currentUser: User) => {
  const docRef = doc(db, "users", currentUser.uid);
  const docSnap = await getDoc(docRef);
  return await docSnap.data()?.role;
};
const Home = () => {
  const [role, setRole] = useState(null);
  const currentUser = useContext(AuthContext);
  useEffect(() => {
    const fetchRole = async () => {
      if (currentUser) {
        const roleData = await loadRole(currentUser);
        if (roleData) {
          setRole(roleData);
        }
      }
    };

    fetchRole();
  }, [currentUser]);
  return (
    <>
      <Navbar />
      <div>Home</div>
      <CreateAccount />
      {role === "teacher" ? (
        <>
          <div>Hello mr/ms {role}</div>
          <div>Lich giang day</div>
          <div>Danh sach lop giang day</div>
          <div>Quan ly sinh vien</div>
          {/* <button onClick={setData}>Insert new city</button> */}
        </>
      ) : (
        <>
          <div>Hello {role}</div>
          <div>Thoi khoa bieu</div>
          <div>Danh sach mon hoc</div>
          <div>Tong quat ket qua</div>
        </>
      )}
      <div></div>
    </>
  );
};

export default Home;
