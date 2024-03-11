import "./App.css";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useContext } from "react";
import { User } from "firebase/auth";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
  Outlet,
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
function App() {
  const currentUser = useContext(AuthContext);
  const ProtectedRoute: React.FC<{
    user: User | null;
  }> = ({ user }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  };
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index Component={Login} />
          <Route element={<ProtectedRoute user={currentUser} />}>
            <Route element={<Home />} path="home" />
            <Route element={<Profile />} path="profile" />
          </Route>
          <Route path="*" Component={NotFound} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
