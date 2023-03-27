import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      username: email,
      password: password,
    };

    console.log(email);
    console.log(password);

    fetch("http://localhost:9000/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      console.log(response);
      if (response.status === 200) navigate("/dashboard");
      //return response.json(); // do something with response JSON
    });
  };

  return (
    <Card className="cardContainer">
      <Card.Header className="bg-primary">Login</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
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
