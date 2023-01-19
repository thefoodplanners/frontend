import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import { LinkContainer } from 'react-router-bootstrap'

const Login = () => {
  return (
    <Card className="cardContainer">
      <Card.Header className="bg-primary">Login</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
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
          <Button variant="secondary">Register</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
};

export default Login;
