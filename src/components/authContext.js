import React, { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    fetch(`http://localhost:9000/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: 'include',
    }).then((response) => {
        const status = response.ok;
        status === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <AuthContext.Provider
      //value={[isAuthenticated, setIsAuthenticated, setAuth]}
      value={{isAuthenticated, setIsAuthenticated, setAuth}}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;