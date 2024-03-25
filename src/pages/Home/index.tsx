import Navbar from "../../components/Navbar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const currentUser = useContext(AuthContext);
  const role = currentUser?.displayName;
  return (
    <>
      <Navbar />
      <div>Home</div>
      {role === "teacher" ? (
        <>
          <div>Hello mr/ms {role}</div>
          <div>Lich giang day</div>
          <div>Danh sach lop giang day</div>
          <div>Quan ly sinh vien</div>
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
