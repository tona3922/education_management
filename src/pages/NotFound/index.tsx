import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>404 Not Found</div>
      <button onClick={() => navigate("/")}>Login now</button>
    </>
  );
};

export default NotFound;
