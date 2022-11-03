import "./login.css";
import { Container, Button, Form } from "react-bootstrap";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";

const LoginForm = () => {
  return (
    <Container className="container">
      <Form>
        <h2>Member Login</h2>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Log In
        </Button>
        <p>
          Not a member yet? <a href="https://www.google.com">Sign up here!</a>
        </p>
      </Form>
    </Container>
  );
};

export default LoginForm;
