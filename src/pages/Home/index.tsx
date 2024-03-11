import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../App";

const Home = () => {
  const navigate = useNavigate();
  const { setAccess } = useContext(ThemeContext);
  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        setAccess(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div>Home</div>
      <button onClick={() => logOut()}>Log out</button>
    </>
  );
};

export default Home;
