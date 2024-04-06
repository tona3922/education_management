import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
        localStorage.setItem("token", "");
        localStorage.setItem("role", "");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 40
      }}
    >
      <div style={{ fontSize: 20 }}>Education Management</div>
      <button onClick={() => navigate("/")}>Home</button>
      <button onClick={() => navigate("/profile")}>Profile</button>
      <button onClick={() => logOut()}>Log out</button>
    </div>
  );
};

export default Navbar;
