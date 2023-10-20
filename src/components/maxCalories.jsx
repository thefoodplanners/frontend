import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";

// max calories component
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

MaxCalories.propTypes = {
  calories: PropTypes.any,
  setCalories: PropTypes.any,
};

export default MaxCalories;
