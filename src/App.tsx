import Home from "./pages/Home";
import Login from "./pages/Login";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
  Outlet,
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
const ProtectedRoute: React.FC = () => {
  const auth = localStorage.getItem("token");
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Home />} path="/" />
          <Route element={<Profile />} path="/profile" />
        </Route>
        <Route path="/login" Component={Login} />
        <Route path="*" Component={NotFound} />
      </Routes>
    </Router>
  );
}

export default App;
