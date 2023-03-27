import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Container } from "react-bootstrap"

import Header from "./components/header";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import Logout from "./pages/logout";
import NoPage from "./pages/nopage";
import Progress from "./pages/progress";
import Footer from "./components/footer";
import AuthContextProvider from "./components/authContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <div style={{flexGrow: "1"}}>
          <Header />
          <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="logout" element={<Logout />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="progress" element={<Progress />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
