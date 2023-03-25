import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';

import { AuthContext } from '../components/authContext';

const Logout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setAuth } = useContext(AuthContext);

  useEffect(() => {
    fetch("http://localhost:9000/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    }).then((response) => {
      console.log(response);
      if (response.status === 200){
        setAuth(false);
        navigate("/home");
      }
      //return response.json(); // do something with response JSON
    });
  })
}

export default Logout;
