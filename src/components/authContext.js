import { useState, useEffect, createContext } from "react";
import PropTypes from 'prop-types';

// create react context
export const AuthContext = createContext();

// react context provider to set/show a global state for user authentication
const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  // is the user authenticated
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
        // if we are we want the rest of the app to know (anyone subscribed to the context)
        status === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  // soon as component is loaded check authentication status (for navbar)
  useEffect(() => {
    isAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{isAuthenticated, setIsAuthenticated, setAuth}}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.any
}

export default AuthContextProvider;