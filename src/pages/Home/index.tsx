import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
        localStorage.setItem("token", "");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const currentUser = useContext(AuthContext);
  if (currentUser) {
    console.log("user: ", currentUser);
  }
  return (
    <>
      <Navbar />
      <div>Home</div>
      <button onClick={() => logOut()}>Log out</button>
      <button onClick={() => navigate("/profile")}>Profile</button>
      <div></div>
    </>
  );
};

export default Home;
