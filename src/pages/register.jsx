import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import { LinkContainer } from 'react-router-bootstrap'

const Register = () => {
  return (
    <Card className="cardContainer">
      <Card.Header className="bg-primary">Register</Card.Header>
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
          <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
            <Form.Label>Password confirmation</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Remember me" />
          </Form.Group>
          <Stack direction="horizontal" gap={3}>
            <Form.Group className="mb-3" controlId="formBasicCheckboxLegal">
              <Form.Check type="checkbox" label="I accept the terms and conditions" />
            </Form.Group>
            <Button className="ms-auto" variant="primary" type="submit">
              Register 
            </Button>
          </Stack>
        </Form>
      </Card.Body>
      <Card.Body>
        <LinkContainer to="/login">
          <Button variant="secondary">Login</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
};

export default Register;
