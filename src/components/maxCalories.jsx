import Form from "react-bootstrap/Form";

const MaxCalories = (props) => {
  return (
    <>
      <Form.Label>Maximum Daily Calories</Form.Label>
      <Form.Control
        type="input"
        placeholder="Enter Calories"
        name="calories"
        value={props.calories}
        onChange={(e) => props.setCalories(e.target.value)}
      />
    </>
  );
};

export default MaxCalories;
