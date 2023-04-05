import { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

import SuggestionModal from './suggestionModal';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// calender component for dashboard page
const Calender = () => {
  // meals by day
  const [currentWeekMeals, setCurrentWeekMeals] = useState([]);
  const [fetchedMeals, setFetchedMeals] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
  const [suggestionSelectedDate, setSuggestionSelectedDate] = useState(selectedDate);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [dragMeal, setDragMeal] = useState({});
  
  // x index = day, y index = meal number
  useEffect(() => {
    // fetchedMeals is a dependancy, but we only want to run after it changes from true -> false (after we add a meal)
    if (fetchedMeals){
      return;
    }
    // fetch meals for calender, for the current date
    const weekDate = getMonday(selectedDate);
    fetch(`http://localhost:9000/calendar/meals?weekDate=${weekDate.getFullYear()}-${weekDate.getMonth()+1}-${weekDate.getDate()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // make sure we send auth token with the request
      withCredentials: true,
      credentials: 'include',
    }).then((response) => {
      return response.json();
    }).then((data) => {
      // update meals state
      setFetchedMeals(true);
      setCurrentWeekMeals(data);
    });
  // the ueseffect re-renders when the selected date or fetched meals bool change
  }, [selectedDate, fetchedMeals]);

  // render the button used to move week in the calender
  const renderWeekChanger = () => (
      <div className="row gx-0 three-cols mb-3 mt-3 d-flex">
        <div className="col-xs-1 col-md-4">
            <Button className="btn" onClick={() => generateMeals()}>
              <i className="bi bi-arrow-clockwise pe-2"></i>
              re-generate
            </Button>
        </div>
        <div className="col-xs-1 col-md-4">
          <div className="d-flex justify-content-between align-items-center">
            <Button className="btn" onClick={() => updateDate(-7)}>
              <i className="bi bi-arrow-left"></i>
            </Button>
            <div className="text-center"> { 
              getMonday(selectedDate).toDateString() + " - " + getSunday(selectedDate).toDateString()
            } </div>
            <Button className="btn" onClick={() => updateDate(7)}>
              <i className="bi bi-arrow-right"></i>
            </Button>
          </div>
        </div>
      </div>
  );

  // render basic item info in each cell
  const renderItemInfo = (recipe) => {
    return (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center render-item-info-container">
      <div className="text-white fw-bold render-item-info-child"> {recipe.name} </div>
      <div className="text-white fw-bold render-item-info-child"> {recipe.mealType} </div>
      <div className="text-white fw-bold render-item-info-child"> {recipe.calories} cals </div>
    </div>
    )
  };
  
  // update date state values
  const updateDate = (value) => {
    setFetchedMeals(false);
    setCurrentWeekMeals([])
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + value)))
  }
  
  // take a date object, and return a new date with the day set to monday
  const getMonday = (d) => {
    d = new Date(d);
    // adjust when day is sunday
    var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6:1);
    return new Date(d.setDate(diff));
  }
  
  // take a date object, and return a new date with the day set to sunday
  const getSunday = (d) => {
    d = new Date(d);
    // adjust when day is sunday
    var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6:1) + 6;
    return new Date(d.setDate(diff));
  }
  
  // take a date object and a day, and return a new date with the day set to the passed day
  const getCurrentDay = (d, wkDay) => {
    d = new Date(d);
    // adjust when day is the given date
    var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6:1) + wkDay;
    return new Date(d.setDate(diff));
  }

  // get a users dietary preferences
  const getDiets = (recipe) => {
    const diets = Object.entries(recipe.preferences);
    return diets
      // only get the preferences which are true
      .filter(pref => pref[1])
      // get the first part of the array. E.g. isVegan
      .map(pref => pref[0])
      // remove the 'is' part from the string.
      .map(pref => pref.slice(2))
      // split preferences to separate words. E.g. 'DiaryFree' to ['Diary', 'Free']
      .map(pref => pref.match(/[A-Z][a-z]+/g))
      // join separate words with spaces. E.g. ['Diary', 'Free'] to 'Diary Free'
      .map(prefArr => prefArr.join(" "))
      .join(" | ")
  }
  const contentStyle = { background: "var(--bs-body-bg)", width: "max-content" };
  const arrowStyle = { color: "var(--bs-body-bg)" };

  // create pie chart with macro data
  const getMacrosPieChartData = (recipe) => {
    const data = {
      labels: ["Fats (g)", "Proteins (g)", "Carbohydrates (g)"],
      datasets: [
        {
          label: "Macro nutrients",
          data: [
            recipe.fats.toFixed(1),
            recipe.proteins.toFixed(1),
            recipe.carbohydrates.toFixed(1)
          ],
          backgroundColor: [
            "rgba(255, 148, 77, 0.2)",
            "rgba(230, 0, 0, 0.2)",
            "rgba(204, 153, 0, 0.2)",
          ],
          borderColor: [
            "rgba(255, 148, 77, 1)",
            "rgba(230, 0, 0, 1)",
            "rgba(204, 153, 0, 1)",
          ],
          borderWidth: 1,
        }
      ],
    };

    return <Pie data={data} />;
  };

  // re-generate a weeks worth of meals
  const generateMeals = () => {
    const weekDate = getMonday(selectedDate);
    fetch(`http://localhost:9000/calendar/meals/weekly-meal-plan?date=${weekDate.getFullYear()}-${weekDate.getMonth()+1}-${weekDate.getDate()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      withCredentials: true,
      credentials: 'include'
    }).then((response) => {
      setFetchedMeals(false);
      setCurrentWeekMeals([]);
    });
  };
  
  // sync the status of current week meals with the backend, used meals are rearranged by drag and drop
  const syncCurrentWeekMeals = (newDay, newMealNumber) => {
    // get a date object with day set to current day
    const newDate = getCurrentDay(selectedDate, newDay);
    // set POST request body to the current meal and current date
    const body = {
      mealSlotId: dragMeal.item.mealSlotId,
      mealNum: newMealNumber,
      date: `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`,
    }
    // call move api, with details of meal being moved
    fetch(`http://localhost:9000/calendar/meals/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
      withCredentials: true,
      credentials: 'include',
    });
  }

  // render a single item/cell for the table
  const renderItem = (item,index,day) => {
    // set var to base64 image from backend
    const imageRef = `data:image/jpeg;base64,${item.recipe.imageRef}`;
    const itemInfo = renderItemInfo(item.recipe);
    const recipe = item.recipe;
    return (
      <div
        draggable
        onDragStart={e => {
          setDragMeal({ item: item, index: index, day: day });
        }}
        onDragOver={e => {
          e.preventDefault();
        }}
        onDrop={e => {
          // update current week meals with the food items new position
          var newWeekMeals = currentWeekMeals.slice();
          newWeekMeals[dragMeal.day] = currentWeekMeals[dragMeal.day].slice(0, dragMeal.index);
          newWeekMeals[dragMeal.day] = newWeekMeals[dragMeal.day].concat(currentWeekMeals[dragMeal.day].slice(dragMeal.index + 1));
          var newWeekMeals2 = newWeekMeals.slice();
          newWeekMeals2[day] = newWeekMeals[day].slice(0, index);
          newWeekMeals2[day].push(dragMeal.item);
          newWeekMeals2[day] = newWeekMeals2[day].concat(newWeekMeals[day].slice(index));
          setCurrentWeekMeals(newWeekMeals2)
          syncCurrentWeekMeals(day, index + 1);
        }}
        style={{backgroundImage: "url('" + imageRef + "')",  backgroundSize: "cover", backgroundPosition: "center", display: "grid", gridTemplateColumns: "1fr"}}
        className="funny w-100"
      >
        <div className="w-100 d-flex justify-content-start align-items-right z-1 delete-item-container">
          <i className="bi bi-x-lg delete-item-child" onClick={() => deleteFoodItem(day, index)}></i>
        </div>

        <Popup
          trigger={itemInfo}
          position={['right center', 'bottom center']}
          on="hover"
          mouseEnterDelay={500}
          {...{ contentStyle, arrowStyle }}
          keepTooltipInside="#root"
          nested
        >
          <div> <span style={{color: "#ff944d"}}><b>Fats:</b></span> {recipe.fats.toFixed(1)}g </div>
          <div> <span style={{color: "#e60000"}}><b>Proteins:</b></span> {recipe.proteins.toFixed(1)}g </div>
          <div> <span style={{color: "#cc9900"}}><b>Carbohydrates:</b></span> {recipe.carbohydrates.toFixed(1)}g </div>
          <div> <b> {getDiets(recipe)} </b> </div>
          <Popup
            trigger={<a href="#">View More</a>}
            on="click"
            contentStyle={{ background: "var(--bs-body-bg)" }}
            modal
            nested
          >
            {close => (
              <div>
              <div style={{ float: "left", borderRight: "1px solid gray", padding: "5px", width: "65%" }}>
              <button onClick={close}> &times; </button>/
              <div> <b>Name:</b> {recipe.name} </div>
              <div> {recipe.mealType} </div>
              <div> {recipe.desc} </div>
              <div> <b>Time to cook:</b> {recipe.time} min(s) </div>
              <div> <b>Difficulty:</b> {recipe.difficulty} </div>
              <div> <b>Ingredients:</b> {recipe.ingredients} </div>
              <div> <b>Calories:</b> {recipe.calories} </div>
              <div> <b> {getDiets(recipe)} </b> </div>
              </div>
              <div style={{ width: "200px", height: "200px", float: "left" }}> {getMacrosPieChartData(recipe)} </div>
              </div>
            )}
          </Popup>
        </Popup>
      </div>
    )
  }

  // render a row of the table
  const renderDayRow = (day) => {
    return (
      <div className="">
        <div 
          className="d-flex flex-column overflow-auto calender-container"
        >
          {
            // if we have fetched meals from the backend and we have meals to display
            fetchedMeals && currentWeekMeals[day].length > 0 &&
            // iterate over meals for the current day and render them in the current row
            currentWeekMeals[day].map((item,index)=>(
              <div key={index} className="text-center border border-1 w-100 h-100 flex-grow-1 bg-white shadow-sm d-flex justify-content-stretch align-items-stretch">
                {renderItem(item,index,day)}
              </div>
            ))
          }

          {
            // if we have fetched meals from the backend and we have no meals
            fetchedMeals && currentWeekMeals[day].length === 0 &&
              <div
                onDragOver={e => {
                  e.preventDefault();
                }}
                onDrop={e => {
                  var newWeekMeals = currentWeekMeals.slice();
                  newWeekMeals[dragMeal.day] = currentWeekMeals[dragMeal.day].slice(0, dragMeal.index);
                  newWeekMeals[dragMeal.day] = newWeekMeals[dragMeal.day].concat(currentWeekMeals[dragMeal.day].slice(dragMeal.index + 1));
                  newWeekMeals[day].push(dragMeal.item);
                  setCurrentWeekMeals(newWeekMeals);
                  syncCurrentWeekMeals(day, 1);
                }}
                className="text-center border border-1 w-100 h-100 flex-grow-1 bg-white shadow-sm d-flex justify-content-center align-items-center"
              > 
                <Button className="btn no-item-button" variant="primary" onClick={() => addFoodItem(day)}>
                  <i className="bi bi-plus fs-1"></i> 
                </Button>
              </div>
          }

          {
            // if we haven't fetched meals from the backend yet
            !fetchedMeals &&
              <div className="text-center border border-1 w-100 h-100 flex-grow-1 bg-white shadow-sm d-flex justify-content-center align-items-center"> 
                <Spinner 
                  animation="border" 
                  role="status"
                  style={{
                    maxWidth: "480px",
                  }}
                />
              </div>
          }
        </div>
      </div>
    )
  }
  
  // get total calories for a day
  const getTotalDayCalories = (day) => {
    // if we havent fetched meals yet return nothing
    if (!fetchedMeals) return 0;
    // if we have sum calories for all meals in the current day
    return currentWeekMeals[day].reduce((sum, item) => sum + item.recipe.calories, 0);
  }
  
  // get total calories for the week
  const getTotalWeekCalories = () => {
    // if we havent fetched meals yet return nothing
    if (!fetchedMeals) return 0;
    // if we have sum calories for all meals in the current day
    return currentWeekMeals.reduce((sum, day) => sum + day.reduce((sum, meal) => sum + meal.recipe.calories, 0), 0)
  }

  // render the rows of the calender
  const renderParentRows = () => {
    return (
      <div className="row gx-0 seven-cols">
        <div className="col-xs-12 col-sm-6 col-md-1 text-center">  
          <div className="bg-primary"> Monday </div>
          {renderDayRow(0)}
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Tuesday </div>
          {renderDayRow(1)}
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Wednesday </div>
          {renderDayRow(2)}
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Thursday </div>
          {renderDayRow(3)}
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Friday </div>
          {renderDayRow(4)}
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Saturday </div>
          {renderDayRow(5)}
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Sunday </div>
          {renderDayRow(6)}
        </div>
      </div>
    )
  }

  // add a food item to the calender for a specific day
  const addFoodItem = (day) => {
    setSuggestionSelectedDate(getCurrentDay(selectedDate, day));
    // TODO avoid re-rendering modal between these 2 state changes
    setShowSuggestionModal(true);
  }

  // delete a food item from a specific day and position
  const deleteFoodItem = (day, index) => {
    const mealId = currentWeekMeals[day][index].mealSlotId
    fetch(`http://localhost:9000/calendar/meals/${mealId}`, {
      method: "DELETE",
      withCredentials: true,
      credentials: 'include',
    }).then((response) => {
      if (response.ok) setFetchedMeals(false);
      //return response.text();
    });
  }
  
  return (
    <Container fluid>
      {renderWeekChanger()}
      {renderParentRows()}
      <div className="mt-3" />
      <div className="row gx-0 seven-cols">
        {
            // render calorie summaries
            [0,1,2,3,4,5,6].map((item,index)=>(
              <div key={index} className="col-md-1">
                <div className="text-center text-white fw-bold total-calories-div">
                  {getTotalDayCalories(index)} daily calories
                </div>
              </div>
            ))
        }
      <div className="mt-3" />
        {
            // render add buttons
            [0,1,2,3,4,5,6].map((item,index)=>(
              <div key={index} className="d-flex justify-content-center align-items-center col-md-1">
                <Button className="btn" variant="primary" onClick={() => addFoodItem(index)}>
                  <i className="bi bi-plus fs-5"></i> 
                </Button>
              </div>
            ))
        }
      </div>
      <div className="row gx-0 d-flex justify-content-center align-items-center mt-3">
        <div className="col-xs-12">
          <div 
            className="text-center text-white fw-bold total-calories-div"
          > 
            {getTotalWeekCalories()} weekly calories
          </div>
        </div>
      </div>
      <SuggestionModal
        show={showSuggestionModal}
        onHide={() => setShowSuggestionModal(false)}
        date={suggestionSelectedDate}
        setFetchedMeals={setFetchedMeals} 
      />
    </Container>
  );
};

export default Calender;