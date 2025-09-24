import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const BASE_URL = "http://localhost:9000";

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data || null);
      setCart(res.data?.cart || []);
    } catch {
      setUser(null);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchUser(); // fetch user on app load
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, cart, setCart, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
