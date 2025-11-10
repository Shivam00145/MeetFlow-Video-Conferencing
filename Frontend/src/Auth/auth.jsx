import { useState, useContext, useEffect } from "react";
import { createContext } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

  const isEmpty = obj => Object.keys(obj).length === 0;

  const LogOut = () => {
    removeCookie("access_token");
    setUserData({});
  }

  return (
    <AuthContext.Provider value={{ userData, setUserData , cookies, removeCookie, LogOut, isEmpty, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    console.log("useAuth used outside of the Provider");
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};
