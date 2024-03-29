import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Image from "react-bootstrap/Image";
import FoodGenLogo from "../assets/food_gen_logo_white.png";

import { useContext } from "react";
import { AuthContext } from "./authContext";

// navbar component
function NavBar() {
  // get the authentication context
  // the navbar will load items relative to whether we are logged in or not
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Navbar className="navbar navbar-dark bg-primary" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <Image
            className="d-block w-100"
            src={FoodGenLogo}
            //style={{maxHeight: "50vh", backgroundSize: "cover"}}
            alt="Food gen logo"
            height="50"
            width="10"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {isAuthenticated && (
          <>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <LinkContainer to="/home">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/dashboard">
                  <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/progress">
                  <Nav.Link>Progress</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/logout">
                  <Nav.Link>Logout</Nav.Link>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
            <Navbar.Collapse className="justify-content-end">
              <LinkContainer to="/settings">
                <a>
                  <i className="text-white bi bi-gear"></i>
                </a>
              </LinkContainer>
            </Navbar.Collapse>
          </>
        )}
        {!isAuthenticated && (
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/home">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/register">
                <Nav.Link>Register</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;
