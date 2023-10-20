import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import PropTypes from "prop-types";

import MacrosPieChart from "./macrosPieChart";
import { contentStyle, arrowStyle } from "../../utils/popupStyles";

const RenderItemPopup = (props) => {
  let recipe = props.recipe;
  let itemInfo = props.itemInfo;

  // get a users dietary preferences
  const getDiets = (recipe) => {
    const diets = Object.entries(recipe.preferences);
    return (
      diets
        // only get the preferences which are true
        .filter((pref) => pref[1])
        // get the first part of the array. E.g. isVegan
        .map((pref) => pref[0])
        // remove the 'is' part from the string.
        .map((pref) => pref.slice(2))
        // split preferences to separate words. E.g. 'DiaryFree' to ['Diary', 'Free']
        .map((pref) => pref.match(/[A-Z][a-z]+/g))
        // join separate words with spaces. E.g. ['Diary', 'Free'] to 'Diary Free'
        .map((prefArr) => prefArr.join(" "))
        .join(" | ")
    );
  };

  return (
    <Popup
      trigger={itemInfo}
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
        {recipe.fats.toFixed(1)}g{" "}
      </div>
      <div>
        {" "}
        <span style={{ color: "#e60000" }}>
          <b>Proteins:</b>
        </span>{" "}
        {recipe.proteins.toFixed(1)}g{" "}
      </div>
      <div>
        {" "}
        <span style={{ color: "#cc9900" }}>
          <b>Carbohydrates:</b>
        </span>{" "}
        {recipe.carbohydrates.toFixed(1)}g{" "}
      </div>
      <div>
        {" "}
        <b> {getDiets(recipe)} </b>{" "}
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
            <div
              style={{
                float: "left",
                borderRight: "1px solid gray",
                padding: "5px",
                width: "65%",
              }}
            >
              <button onClick={close}> &times; </button>
              <div>
                {" "}
                <b>Name:</b> {recipe.name}{" "}
              </div>
              <div> {recipe.mealType} </div>
              <div> {recipe.desc} </div>
              <div>
                {" "}
                <b>Time to cook:</b> {recipe.time} min(s){" "}
              </div>
              <div>
                {" "}
                <b>Difficulty:</b> {recipe.difficulty}{" "}
              </div>
              <div>
                {" "}
                <b>Ingredients:</b> {recipe.ingredients}{" "}
              </div>
              <div>
                {" "}
                <b>Calories:</b> {recipe.calories}{" "}
              </div>
              <div>
                {" "}
                <b> {getDiets(recipe)} </b>{" "}
              </div>
            </div>
            <div style={{ width: "200px", height: "200px", float: "left" }}>
              {" "}
              <MacrosPieChart
               recipe={recipe}
              />
              {" "}
            </div>
          </div>
        )}
      </Popup>
    </Popup>
  );
};

RenderItemPopup.propTypes = {
  recipe: PropTypes.any,
  itemInfo: PropTypes.any
};

export default RenderItemPopup;
