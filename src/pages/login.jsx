import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/authContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, setAuth } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      username: username,
      password: password,
    };

    fetch("http://localhost:9000/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        setAuth(true);
        navigate("/dashboard");
      }
      //return response.json(); // do something with response JSON
    });
  };

  return (
    <Card className="cardContainer">
      <Card.Header className="bg-primary">Login</Card.Header>
      <Card.Body>
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
