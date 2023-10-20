import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import PropTypes from "prop-types";

import MacrosPieChart from "./macrosPieChart";
import { contentStyle, arrowStyle } from "../utils/popupStyles";

const RenderWeekTotalCaloriesPopup = (props) => {
  let fetchedMeals = props.fetchedMeals;
  let currentWeekMeals = props.currentWeekMeals;
  //let recipe = props.recipe;

  const renderWeekTotalCalories = () => (
    <div className="text-center text-white fw-bold total-calories-div">
      {getTotalWeekCalories()} weekly calories
    </div>
  );

  const totalDiv = renderWeekTotalCalories();
  const macros = getMacroWeekTotals();


  // get total macros for a day
  // get total calories for the week
  const getTotalWeekCalories = () => {
    // if we havent fetched meals yet return nothing
    if (!fetchedMeals) return 0;
    // if we have sum calories for all meals in the current day
    return currentWeekMeals.reduce(
      (sum, day) =>
        sum + day.reduce((sum, meal) => sum + meal.recipe.calories, 0),
      0
    );
  };

  // get total macros for a week
  const getMacroWeekTotals = () => {
    const macros = {
      fats: 0,
      proteins: 0,
      carbohydrates: 0,
    };
    if (!fetchedMeals) return macros;
    macros["fats"] = currentWeekMeals.reduce(
      (sum, day) => sum + day.reduce((sum, meal) => sum + meal.recipe.fats, 0),
      0
    );
    macros["proteins"] = currentWeekMeals.reduce(
      (sum, day) =>
        sum + day.reduce((sum, meal) => sum + meal.recipe.proteins, 0),
      0
    );
    macros["carbohydrates"] = currentWeekMeals.reduce(
      (sum, day) =>
        sum + day.reduce((sum, meal) => sum + meal.recipe.carbohydrates, 0),
      0
    );
    return macros;
  };
  return (
    <Popup
      trigger={totalDiv}
      position={["right center", "bottom center"]}
      on="hover"
      mouseEnterDelay={500}
      {...{ contentStyle, arrowStyle }}
      keepTooltipInside="#root"
      nested
    >
      <div>
        {" "}
        <span style={{ color: "#ff944d" }}>
          <b>Fats:</b>
        </span>{" "}
        {macros.fats.toFixed(1)}g{" "}
      </div>
      <div>
        {" "}
        <span style={{ color: "#e60000" }}>
          <b>Proteins:</b>
        </span>{" "}
        {macros.proteins.toFixed(1)}g{" "}
      </div>
      <div>
        {" "}
        <span style={{ color: "#cc9900" }}>
          <b>Carbohydrates:</b>
        </span>{" "}
        {macros.carbohydrates.toFixed(1)}g{" "}
      </div>
      <Popup
        trigger={<a href="#">View More</a>}
        on="click"
        contentStyle={{ background: "var(--bs-body-bg)" }}
        modal
        nested
      >
        {(close) => (
          <div>
            <button onClick={close}> &times; </button>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div style={{ maxWidth: "300px", maxHeight: "500px" }}>
                <MacrosPieChart recipe={macros} />
              </div>
            </div>
          </div>
        )}
      </Popup>
    </Popup>
  );
};

RenderWeekTotalCaloriesPopup.propTypes = {
  fetchedMeals: PropTypes.any,
  currentWeekMeals: PropTypes.any
};

export default RenderWeekTotalCaloriesPopup;