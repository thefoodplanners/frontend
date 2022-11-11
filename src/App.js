import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/custom.scss';

import { BrowserRouter, Route, Routes } from "react-router-dom"

import Layout from "./pages/layout";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import NoPage from "./pages/nopage";


function App() {
  return (
    <BrowserRouter>
      <Layout />
      <Routes>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
