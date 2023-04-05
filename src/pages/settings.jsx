import { preferencesData } from "../utils/preferencesData";
import Preferences from "../components/preferences";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import MaxCalories from "../components/maxCalories";
import { LinkContainer } from "react-router-bootstrap";

// page for updating settings
const Settings = () => {
  // set state for settings form
  const [formStep, setFormStep] = useState(0);
  const [calories, setCalories] = useState(0);
  const [checked, setChecked] = useState(
    new Array(preferencesData.length).fill(false)
  );

  // get list of preferences for the current user
  const fetchCurrent = () => {
    fetch("http://localhost:9000/user/preferences", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((d) => {
        const lastChecked = [];
        console.log(d);
        lastChecked.push(d["isVegan"]);
        lastChecked.push(d["isVegetarian"]);
        lastChecked.push(d["isKeto"]);
        lastChecked.push(d["isLactose"]);
        lastChecked.push(d["isHalal"]);
        lastChecked.push(d["isKosher"]);
        lastChecked.push(d["isDairyFree"]);
        lastChecked.push(d["isLowCarbs"]);
        lastChecked.push(d["isGlutenFree"]);
        lastChecked.push(d["isPeanuts"]);
        lastChecked.push(d["isEggs"]);
        lastChecked.push(d["isFish"]);
        lastChecked.push(d["isTreeNuts"]);
        lastChecked.push(d["isSoy"]);

        setChecked(lastChecked);
        setCalories(d["targetCalories"]);
        //setData(d)
      });
  };

  useEffect(() => {
    fetchCurrent();
  }, []);

  const completeFormStep = () => {
    setFormStep((cur) => cur + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // create body for POST request
    const body = {
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
    };

    // submit updated preferences
    fetch("http://localhost:9000/user/preferences", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        completeFormStep();
      }
    });
  };

  return (
    <Card className="card-container">
      <Card.Header className="bg-primary">
        Change Preference Settings
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {formStep === 0 && (
            <>
              <Form.Group className="mb-3" controlId="formBasicPreferences">
                <Preferences checked={checked} setChecked={setChecked} />
              </Form.Group>
              <br />
              <Form.Group controlId="formMaxCalories">
                <MaxCalories calories={calories} setCalories={setCalories} />
                <p>{checked.targetCalories}</p>
              </Form.Group>
              <br />
              <Button variant="primary" type="submit">
                Submit Changes
              </Button>
            </>
          )}
          {formStep === 1 && (
            <>
              <h1 className="success">Preference Settings Updated!</h1>
              <LinkContainer to="/home">
                <Button variant="secondary">Go back to Homepage</Button>
              </LinkContainer>
            </>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Settings;
