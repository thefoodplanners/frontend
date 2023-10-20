import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { LinkContainer } from "react-router-bootstrap";
import { useState } from "react";
import "../scss/register.scss";
import { preferencesData } from "../utils/preferencesData";
import Preferences from "../components/preferences";
import MaxCalories from "../components/maxCalories";

// register page
const Register = () => {
  const [formStep, setFormStep] = useState(0);

  // form step 0 states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // form step 1 states
  const [checked, setChecked] = useState(
    new Array(preferencesData.length).fill(false)
  );

  // form set 2 states
  const [calories, setCalories] = useState(0);
  const [termsChecked, setTermsChecked] = useState(false);

  // validation states
  const [invalidInput, setInvalidInput] = useState(false);
  const [invalidInputMsgs, setInvalidInputMsgs] = useState([]);

  const registerCompleteFormStep = () => {
    // if the inputs are valid, then we can move to the next step
    if (validateRegisterInputs()) setFormStep((cur) => cur + 1);
  };

  const completeFormStep = () => {
    setFormStep((cur) => cur + 1);
  };

  const revertFormStep = () => {
    setFormStep((cur) => cur - 1);
  };

  // validate the register field inputs
  const validateRegisterInputs = () => {
    let isValid = true;
    let invalidMessages = [];
    if (!email.includes("@")) {
      invalidMessages.push("Invalid email");
      isValid = false;
    }
    if (password !== passwordConfirm) {
      // if we already have an err, we need a newline in paragraph
      if (isValid === false) invalidMessages.push(<br />);
      invalidMessages.push("Password not equal to confirmed password");
      isValid = false;
    }
    setInvalidInputMsgs(invalidMessages);
    setInvalidInput(!isValid);
    return isValid;
  };

  // validate the maximum daily calories input
  const validateFinalInputs = () => {
    let isValid = true;
    let invalidMessages = [];
    if (!isNumeric(calories)) {
      isValid = false;
      invalidMessages.push("Max daily calories is not an integer");
      // if it is an integer is it more than 0
    } else if (calories <= 0) {
      isValid = false;
      invalidMessages.push("Max daily calories must be more than 0");
    }
    if (!termsChecked) {
      // if we already have an err, we need a newline in paragraph
      if (isValid === false) invalidMessages.push(<br />);
      invalidMessages.push("Must accept terms and conditions");
      isValid = false;
    }

    setInvalidInputMsgs(invalidMessages);
    setInvalidInput(!isValid);
    return isValid;
  };

  const isNumeric = (value) => {
    return (
      !isNaN(value) && // use type coercion to parse the _entirety_ of the string (`parseInt` alone does not do this)...
      !isNaN(parseInt(value))
    ); // ...and ensure strings of whitespace fail
  };

  // register account with backend
  const handleSubmit = (e) => {
    e.preventDefault();
    // check the final inputs before sending data
    if (!validateFinalInputs()) return;

    // create body of POST request
    const body = {
      email: email,
      username: username,
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
        targetCalories: Number(calories),
      },
    };

    fetch("http://localhost:9000/register", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      if (response.status === 200) {
        completeFormStep();
      }
    });
  };
  return (
    <>
      <Card className="card-container">
        <Card.Header className="bg-primary">Register</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {formStep === 0 && (
              <section>
                {
                  // only re-render if formStep is 0 and input changed (since invalidInput is reused)
                  formStep === 0 && invalidInput && (
                    <div className="alert alert-primary" role="alert">
                      {invalidInputMsgs}
                    </div>
                  )
                }
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    We&apos;ll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
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
                    required
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
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="passwordConfirm"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                </Form.Group>
                <div className="ms-auto">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={registerCompleteFormStep}
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
                  <Preferences checked={checked} setChecked={setChecked} />
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
                {
                  // only re-render if formStep is 2 and input changed (since invalidInput is reused)
                  formStep === 2 && invalidInput && (
                    <div className="alert alert-primary" role="alert">
                      {invalidInputMsgs}
                    </div>
                  )
                }
                <div className="max-calories">
                  <Form.Group controlId="formMaxCalories">
                    <MaxCalories
                      calories={calories}
                      setCalories={setCalories}
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
                      value={termsChecked}
                      onChange={(e) => setTermsChecked(e.target.checked)}
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
            {formStep === 3 && (
              <h1 className="success">Account Successfully Created!</h1>
            )}
          </Form>
          <LinkContainer to="/login">
            <Button variant="secondary">Go to Login</Button>
          </LinkContainer>
        </Card.Body>
      </Card>
    </>
  );
};

export default Register;
