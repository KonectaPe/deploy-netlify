import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { loginRequest, logoutRequest, verifyToken } from "../user/authService";
import { useNavigate } from "react-router";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [userVerify, setUserVerify] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  const logout = useCallback(() => {
    logoutRequest();
    navigate("/");
    setIsAuthenticated(false);
  }, [navigate, setIsAuthenticated]);

  useEffect(() => {
    const verify = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          logout();
        } else {
          const user = await verifyToken();
          if (user) {
            setUserVerify(user);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error("Error al verificar token:", error);
        logout();
      }
    };

    verify();
  }, [navigate, logout]);

  const login = async (user) => {
    const token = await loginRequest({ user });
    if (!token) return null;
    setIsAuthenticated(true);
    return token;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
