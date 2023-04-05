import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';

import { AuthContext } from '../components/authContext';

const Logout = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  // when page is loaded run code straight away
  useEffect(() => {
    // tell backend to invalidate our session
    fetch("http://localhost:9000/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    }).then((response) => {
      if (response.status === 200){
        // set global authentication state to false (logged out)
        setAuth(false);
        // navigate to home page, since we shouldnt be in dashboard when logged out
        navigate("/home");
      }
    });
  })
}

export default Logout;
