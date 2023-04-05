import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/authContext";

// login page
const Login = () => {
  // state for form data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // state for validation
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);
  // state for successful auth
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  // handle submition of login details
  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      username: username,
      password: password,
    };

    // login with entered details
    fetch("http://localhost:9000/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => (
      response.text()
    )).then((data)=> {
        if (data === "Login successful.") {
          // set global authentication state to true (logged in)
          setAuth(true);
          // navigate to dashboard
          navigate("/dashboard");
        // if failed login because of wrong details
        } else if (data === "Username and/or password is incorrect.") {
          setInvalidLogin(true);
          setFailedLogin(false);
        // if failed login because of something else
        } else {
          setInvalidLogin(false);
          setFailedLogin(true);
        }
    });
  };

  return (
    <Card className="cardContainer">
      <Card.Header className="bg-primary">Login</Card.Header>
      <Card.Body>

        {
          invalidLogin && 
          <div class="alert alert-primary" role="alert">
            Authentication details invalid
          </div>
        }

        {
          failedLogin && 
          <div class="alert alert-primary" role="alert">
            Failed to login, please try again later
          </div>
        }

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Stack direction="horizontal" gap={3}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group>
            <Button className="ms-auto btn" variant="primary" type="submit">
              Login
            </Button>
          </Stack>
        </Form>
      </Card.Body>
      <Card.Body>
        <LinkContainer to="/register">
          <Button variant="secondary">Go to Register</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
};

export default Login;
