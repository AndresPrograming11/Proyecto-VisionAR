import { createContext, useState, useContext } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: localStorage.getItem("userId"),
    role: localStorage.getItem("role"),
    isAuth: localStorage.getItem("isAuth") === "true",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
