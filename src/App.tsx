import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ReactNode, createContext, useState } from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
// protect route from access without login successfully
const ProtectedRoute: React.FC<{
  access: boolean;
  redirectPath?: string;
  children: ReactNode;
}> = ({ access, redirectPath, children }) => {
  if (!access) {
    redirectPath = "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
// context app
const appCtxDefaultValue = {
  access: false,
  setAccess: (a: boolean) => {
    a;
  },
};
export const ThemeContext = createContext(appCtxDefaultValue);
function App() {
  const [access, setAccess] = useState(false);
  return (
    <ThemeContext.Provider value={{ access, setAccess }}>
      <Router>
        <Routes>
          <Route path="/" Component={Login} />
          <Route
            path="/home"
            element={
              <ProtectedRoute access={access} redirectPath="/home">
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
