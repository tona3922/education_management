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
  children: ReactNode;
}> = ({ access, children }) => {
  if (!access) {
    return <Navigate to="/login" replace />;
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
          <Route path="/">
            <Route
              index
              element={
                <ProtectedRoute access={access}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="login" Component={Login} />
          </Route>
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
