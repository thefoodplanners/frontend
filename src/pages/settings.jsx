import { preferencesData } from "../utils/preferencesData";
import Preferences from "../components/preferences";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import MaxCalories from "../components/maxCalories";

const Settings = () => {
  const [calories, setCalories] = useState(0);
  const [checked, setChecked] = useState(
    new Array(preferencesData.length).fill(false)
  );

  return (
    <Card className="cardContainer">
      <Card.Header className="bg-primary">
        Change Preference Settings
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPreferences">
            <Preferences checked={checked} setChecked={setChecked} />
          </Form.Group>
          <br />
          <Form.Group controlId="formMaxCalories">
            <MaxCalories calories={calories} setCalories={setCalories} />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit">
            Submit Changes
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Settings;
