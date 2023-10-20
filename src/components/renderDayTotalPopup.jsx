import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import PropTypes from "prop-types";

import MacrosPieChart from "./macrosPieChart";
import { contentStyle, arrowStyle } from "../utils/popupStyles";

const RenderDayTotalCaloriesPopup = (props) => {
  let fetchedMeals = props.fetchedMeals;
  let currentWeekMeals = props.currentWeekMeals;
  let day = props.day;
  //let recipe = props.recipe;

  const totalDiv = renderDayTotalCalories(day);
  const macros = getMacroDayTotals(day);

  const getMacroDayTotals = (day) => {
    const macros = {
      fats: 0,
      proteins: 0,
      carbohydrates: 0,
    };
    if (!fetchedMeals) return macros;
    macros["fats"] = currentWeekMeals[day].reduce(
      (sum, item) => sum + item.recipe.fats,
      0
    );
    macros["proteins"] = currentWeekMeals[day].reduce(
      (sum, item) => sum + item.recipe.proteins,
      0
    );
    macros["carbohydrates"] = currentWeekMeals[day].reduce(
      (sum, item) => sum + item.recipe.carbohydrates,
      0
    );
    return macros;
  };

  const renderDayTotalCalories = (day) => (
    <div className="text-center text-white fw-bold total-calories-div">
      {getTotalDayCalories(day)} daily calories
    </div>
  );

  // get total calories for a day
  const getTotalDayCalories = (day) => {
    // if we havent fetched meals yet return nothing
    if (!fetchedMeals) return 0;
    // if we have sum calories for all meals in the current day
    return currentWeekMeals[day].reduce(
      (sum, item) => sum + item.recipe.calories,
      0
    );
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
                <MacrosPieChart
                 recipe={macros}
                />
              </div>
            </div>
          </div>
        )}
      </Popup>
    </Popup>
  );
};

RenderDayTotalCaloriesPopup.propTypes = {
  fetchedMeals: PropTypes.any,
  currentWeekMeals: PropTypes.any,
  day: PropTypes.any,
  recipe: PropTypes.any
};

export default RenderDayTotalCaloriesPopup;
