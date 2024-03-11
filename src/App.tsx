import "./App.css";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ReactNode, useContext } from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
function App() {
  const currentUser = useContext(AuthContext);
  //////////////////////
  // protect route from access without login successfully
  //////////////////////
  const ProtectedRoute: React.FC<{
    children: ReactNode;
  }> = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="login" Component={Login} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
