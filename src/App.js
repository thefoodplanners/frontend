import { BrowserRouter, Route, Routes } from "react-router-dom";

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
import Settings from "./pages/settings";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// root app component, setup page routing for the application
function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <div style={{ flexGrow: "1" }}>
          <Header />
          <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="logout" element={<Logout />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="progress" element={<Progress />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
