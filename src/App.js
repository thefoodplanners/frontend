import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Container } from "react-bootstrap"

import Header from "./components/header";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import NoPage from "./pages/nopage";
import Footer from "./components/footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Container className="mb-4" fluid>
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Container>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
