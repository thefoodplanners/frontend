import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { LinkContainer } from "react-router-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import "../scss/register.scss";

const preferences = [
  { preference: "Vegetarian" },
  { preference: "Vegan" },
  { preference: "Keto" },
  { preference: "Lactose" },
  { preference: "Halal" },
  { preference: "Kosher" },
  { preference: "Dairy-Free" },
  { preference: "Low-Carbs" },
  { preference: "Gluten-Free" },
  { preference: "Peanuts" },
  { preference: "Eggs" },
  { preference: "Fish" },
  { preference: "Tree Nuts" },
  { preference: "Soy" },
];

const Register = () => {
  const [formStep, setFormStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [calories, setCalories] = useState(0);
  const navigate = useNavigate();
  const [checked, setChecked] = useState(
    new Array(preferences.length).fill(false)
  );

  const completeFormStep = () => {
    setFormStep((cur) => cur + 1);
  };

  const revertFormStep = () => {
    setFormStep((cur) => cur - 1);
  };

  const handleChange = (position) => {
    const updateChecked = checked.map((item, index) =>
      index === position ? !item : item
    );

    setChecked(updateChecked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      email: email,
      username: email,
      password: password,
      preferences: {
        isVegan: checked[0],
        isVegetarian: checked[1],
        isKeto: checked[2],
        isLactose: checked[3],
        isHalal: checked[4],
        isKosher: checked[5],
        isDairyFree: checked[6],
        isLowCarbs: checked[7],
        isGlutenFree: checked[8],
        isPeanuts: checked[9],
        isEggs: checked[10],
        isFish: checked[11],
        isTreeNuts: checked[12],
        isSoy: checked[13],
        targetCalories: calories,
      },
    };

    console.log(email);
    console.log(password);

    fetch("http://localhost:9000/register", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        navigate("/dashboard");
      }
      //return response.json(); // do something with response JSON
    });
  };
  return (
    <>
      <Card className="cardContainer">
        <Card.Header className="bg-primary">Register</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {formStep === 0 && (
              <section>
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
                <Form.Group
                  className="mb-3"
                  controlId="formBasicPasswordConfirm"
                >
                  <Form.Label>Password confirmation</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <div className="ms-auto">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={completeFormStep}
                  >
                    Next
                  </Button>
                </div>
              </section>
            )}
            {formStep === 1 && (
              <section>
                <Button variant="link" type="Button" onClick={revertFormStep}>
                  Back
                </Button>
                <Form.Group className="mb-3" controlId="formBasicPreferences">
                  <h4 className="title">Select preferences</h4>
                  <ul className="preferences-list">
                    {preferences.map(({ preference }, index) => {
                      return (
                        <li key={index}>
                          <ToggleButtonGroup type="checkbox" className="mb-1">
                            <ToggleButton
                              variant="outline-primary"
                              id={`tbg-check-${index}`}
                              value={preference}
                              checked={checked[index]}
                              onChange={() => handleChange(index)}
                            >
                              {preference}
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </li>
                      );
                    })}
                  </ul>
                </Form.Group>
                <div className="ms-auto">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={completeFormStep}
                  >
                    Next
                  </Button>
                </div>
              </section>
            )}
            {formStep === 2 && (
              <>
                <Button variant="link" type="Button" onClick={revertFormStep}>
                  Back
                </Button>
                <div className="max-calories">
                  <Form.Group controlId="formMaxCalories">
                    <Form.Label>Maximum Daily Calories</Form.Label>
                    <Form.Control
                      type="input"
                      placeholder="Enter Calories"
                      name="calories"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <Stack direction="horizontal" gap={3}>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicCheckboxLegal"
                  >
                    <Form.Check
                      type="checkbox"
                      label="I accept the terms and conditions"
                    />
                  </Form.Group>
                </Stack>
                <div className="ms-auto">
                  <Button variant="primary" type="submit">
                    Create Account
                  </Button>
                </div>
              </>
            )}
          </Form>
        </Card.Body>
        <Card.Body>
          <LinkContainer to="/login">
            <Button variant="secondary">Go to Login</Button>
          </LinkContainer>
        </Card.Body>
      </Card>
    </>
  );
};

export default Register;
