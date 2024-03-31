import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import CreateAccount from "../CreateAccount";
import { AuthContext } from "../../context/AuthContext";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import MemberManagement from "../Management";
import StudentManagement from "../Management/Student";
import CreateCourse from "../Courses";
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
          localStorage.setItem("role", roleData);
        }
      }
    };
    fetchRole();
  }, [currentUser]);
  return (
    <>
      <Navbar />
      <div>Home</div>
      {role === "admin" ? <CreateAccount /> : <></>}
      {role === "admin" ? <MemberManagement /> : <></>}
      {role === "admin" ? <CreateCourse /> : <></>}
      <div>Hello {role}</div>
      {role === "teacher" ? (
        <>
          <div>Lich giang day</div>
          <div>Danh sach lop giang day</div>
          <div>Quan ly sinh vien</div>
          <StudentManagement />
        </>
      ) : (
        <>
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
