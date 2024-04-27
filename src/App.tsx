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
import CourseDetail from "./pages/CourseDetail";
const ProtectedRoute: React.FC = () => {
  const auth = localStorage.getItem("userId");
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
          <Route element={<CourseDetail />} path="/course/:courseCode" />
        </Route>
        <Route path="/login" Component={Login} />
        <Route path="*" Component={NotFound} />
      </Routes>
    </Router>
  );
}

export default App;
