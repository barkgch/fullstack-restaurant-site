/**
 * Provide context for verifying user's account (employee or customer)
 * 
 * BASED ON: Lama Dev's React Node.js MySQL Full Stack Blog App Tutorial
 *    https://youtu.be/0aPLk2e2Z3g?si=2YauU5U6pDdNQLMi
 */
import { createContext, useEffect, useState } from "react";

import accountService from "../services/account.service";

export const AuthContext = createContext();

// authContextProvider is used wrapper for App in index.js
// this allows any place in the app to check for current user status
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user') || null)
  );

  const loginCustomer = async (inputs) => {
    const res = await accountService.loginCustomer(inputs);
    setCurrentUser(res.data);
  }

  const loginEmployee = async (inputs) => {
    const res = await accountService.loginEmployee(inputs);
    setCurrentUser(res.data);
  }


  const logout = async () => {
    await accountService.logout();
    setCurrentUser(null);
  }

  // update local storage to reflect currentUser
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{currentUser, loginCustomer, loginEmployee, logout}}>
      {children}
    </AuthContext.Provider> 
  )
}