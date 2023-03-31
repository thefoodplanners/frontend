import { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
//import Row from 'react-bootstrap/Row';
//import Col from 'react-bootstrap/Col';
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

const Calender = () => {
  //const [currentWeek, setCurrentWeek] = useState(new Date());
  //const [selectedDay, setSelectedDay] = useState();
  // meals by day
  const [currentWeekMeals, setCurrentWeekMeals] = useState([]);
  const [fetchedMeals, setFetchedMeals] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
  const [suggestionSelectedDate, setSuggestionSelectedDate] = useState(selectedDate);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [dragMeal, setDragMeal] = useState({});
  // day
  //const [suggestionAddDay, setSuggestionAddDay] = useState(-1);
  
  // x index = day, y index = meal number
  useEffect(() => {
    //2023-02-30
    // fetchedMeals is a dependancy, but we only want to run after it changes from true -> false (after we add a meal)
    if (fetchedMeals){
      return;
    }
    // fetch meals for calender
    const weekDate = getMonday(selectedDate);
    fetch(`http://localhost:9000/calendar/meals?weekDate=${weekDate.getFullYear()}-${weekDate.getMonth()+1}-${weekDate.getDate()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: 'include',
    }).then((response) => {
      return response.json();
    }).then((data) => {
      setFetchedMeals(true);
      setCurrentWeekMeals(data);
    });
    //setCurrentWeekMeals(
    //  [
    //    [{name: "eggs", id: 69},{name: "chicken", id: 27}], // monday
    //    [{name: "m1"},{name: "m2"},{name: "m3"}], // tuesday
    //    [], // wednesday
    //    [{name: "m1"},{name: "m2"},{name: "m3"},{name: "m4"},{name: "m5"},{name: "m6"}], // thursday
    //    [], // friday
    //    [], // saturday
    //    [], // sunday
    //  ]);
  }, [selectedDate, fetchedMeals]);

  // render the button used to move week in the calender
  const renderWeekChanger = () => (
      <div className="row gx-0 seven-cols mb-3 mt-3 d-flex justify-content-center">
        {/* <div className="col-xs-0 col-md-1"></div> */}
        <div className="col-xs-12 col-md-4">
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

  const renderItemInfo = (recipe) => {
    return (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center" style={{gridRowStart: "1", gridColumnStart: "1", padding: "1px 0px"}}>
      <div className="text-white fw-bold" style={{textShadow: "0px 0px 10px  black", backgroundColor: "#0008", width: "fit-content", padding: "0px 4px"}}> {recipe.name} </div>
      <div className="text-white fw-bold" style={{textShadow: "0px 0px 10px  black", backgroundColor: "#0008", width: "fit-content", padding: "0px 4px"}}> {recipe.mealType} </div>
      <div className="text-white fw-bold" style={{textShadow: "0px 0px 10px  black", backgroundColor: "#0008", width: "fit-content", padding: "0px 4px"}}> {recipe.calories} cals </div>
    </div>
    )
  };
  
  const updateDate = (value) => {
    setFetchedMeals(false);
    setCurrentWeekMeals([])
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + value)))
  }
  
  const getMonday = (d) => {
    d = new Date(d);
    var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  
  const getSunday = (d) => {
    d = new Date(d);
    var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6:1) + 6; // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  
  const getCurrentDay = (d, wkDay) => {
    d = new Date(d);
    var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6:1) + wkDay; // adjust when day is the given date
    return new Date(d.setDate(diff));
  }

  const getDiets = (recipe) => {
    const diets = Object.entries(recipe.preferences);
    return diets
      // Only get the preferences which are true
      .filter(pref => pref[1])
      // Get the first part of the array. E.g. isVegan
      .map(pref => pref[0])
      // Remove the 'is' part from the string.
      .map(pref => pref.slice(2))
      // Split preferences to separate words. E.g. 'DiaryFree' to ['Diary', 'Free']
      .map(pref => pref.match(/[A-Z][a-z]+/g))
      // Join separate words with spaces. E.g. ['Diary', 'Free'] to 'Diary Free'
      .map(prefArr => prefArr.join(" "))
      .join(" | ")
  }
  const contentStyle = { background: "var(--bs-body-bg)", width: "max-content" };
  const arrowStyle = { color: "var(--bs-body-bg)" };

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

  
  // sync the status of current week meals with the backend
  const syncCurrentWeekMeals = (newDay, newMealNumber) => {
    const newDate = getCurrentDay(selectedDate, newDay);
    //const mealsToSend = currentWeekMeals.map( (day) => day.map( (item) => item.mealSlotId ) );
    ////return currentWeekMeals.reduce((sum, day) => sum + day.reduce((sum, meal) => sum + meal.recipe.calories, 0), 0)
    //const body = {
    //  meals: mealsToSend,
    //  startDate: `${mondayDate.getFullYear()}-${mondayDate.getMonth()+1}-${mondayDate.getDate()}`,
    //  endDate: `${sundayDate.getFullYear()}-${sundayDate.getMonth()+1}-${sundayDate.getDate()}`,
    //}
    const body = {
      mealSlotId: dragMeal.item.mealSlotId,
      mealNum: newMealNumber,
      date: `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`,
    }
    fetch(`http://localhost:9000/calendar/meals/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
      withCredentials: true,
      credentials: 'include',
    }).then((response) => {
      console.log(response);
      console.log(response.ok);
    })
  }

  const renderItem = (item,index,day) => {
    const imageRef = `data:image/jpeg;base64,${item.recipe.imageRef}`;
    //const imageRef = `data:image/jpeg;base64,${item.recipe.imageRef}`;
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
        <div className="w-100 d-flex justify-content-start align-items-right z-1" style={{gridRowStart: "1", gridColumnStart: "1", padding: "0px 4px"}}>
          {/* <Button variant="primary" size="sm"> */}
          <i className="bi bi-x-lg" style={{zIndex: "99", cursor: "pointer", height: "fit-content", textShadow: "0px 0px 4px white"}} onClick={() => deleteFoodItem(day, index)}></i>
        </div>

        <Popup
          trigger={itemInfo}
          position={['right center', 'bottom center']}
          on="hover"
          mouseEnterDelay={200}
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

  const renderDayRow = (day) => {
    return (
      <div className="">  {/* style={{flex: 1, display: "flex", height: "1px" }}> */}
        <div 
          className="d-flex flex-column overflow-auto"
          style={{minHeight: "50vh", height: "0px"}}
        >
          {
            // if we have fetched meals from the backend and we have meals to display
            fetchedMeals && currentWeekMeals[day].length > 0 &&
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
                <Button className="btn" variant="primary" onClick={() => addFoodItem(day)} style={{backgroundColor: "#9EE493", borderColor: "#5db7de"}}>
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
  
  const getTotalDayCalories = (day) => {
    // if we havent fetched meals yet return nothing
    if (!fetchedMeals) return 0;
    // if we have sum calories for all meals in the current day
    return currentWeekMeals[day].reduce((sum, item) => sum + item.recipe.calories, 0);
  }
  
  const getTotalWeekCalories = () => {
    // if we havent fetched meals yet return nothing
    if (!fetchedMeals) return 0;
    // if we have sum calories for all meals in the current day
    return currentWeekMeals.reduce((sum, day) => sum + day.reduce((sum, meal) => sum + meal.recipe.calories, 0), 0)
  }

  const renderParentRows = () => {
    return (
      <div className="row gx-0 seven-cols">
        <div className="col-xs-12 col-sm-6 col-md-1 text-center">  
          <div className="bg-primary"> Monday </div>
          {renderDayRow(0)}
          <div className=""> {getTotalDayCalories(0)} cals </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Tuesday </div>
          {renderDayRow(1)}
          <div className=""> {getTotalDayCalories(1)} cals </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Wednesday </div>
          {renderDayRow(2)}
          <div className=""> {getTotalDayCalories(2)} cals </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Thursday </div>
          {renderDayRow(3)}
          <div className=""> {getTotalDayCalories(3)} cals </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Friday </div>
          {renderDayRow(4)}
          <div className=""> {getTotalDayCalories(4)} cals </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Saturday </div>
          {renderDayRow(5)}
          <div className=""> {getTotalDayCalories(5)} cals </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-1 text-center"> 
          <div className="bg-primary"> Sunday </div>
          {renderDayRow(6)}
          <div className=""> {getTotalDayCalories(6)} cals </div>
          {/* currentWeekMeals.length !== 0 && renderDayRow(6) */}
        </div>
      </div>
    )
  }

  const addFoodItem = (day) => {
    setSuggestionSelectedDate(getCurrentDay(selectedDate, day));
    // TODO avoid re-rendering modal between these 2 state changes
    setShowSuggestionModal(true);
  }

  const deleteFoodItem = (day, index) => {
    const mealId = currentWeekMeals[day][index].mealSlotId
    fetch(`http://localhost:9000/calendar/meals/${mealId}`, {
      method: "DELETE",
      withCredentials: true,
      credentials: 'include',
    }).then((response) => {
      //console.log(response);
      if (response.ok) setFetchedMeals(false);
      return response.text();
    }).then((data) => {
      console.log(data);
    });
  }
  
  return (
    <Container fluid>
      {renderWeekChanger()}
      {renderParentRows()}
      <div className="mt-3" />
      <div className="row gx-0 seven-cols">
        {
            [0,1,2,3,4,5,6].map((item,index)=>(
              <div key={index} className="d-flex justify-content-center align-items-center col-md-1">
                <Button className="btn" variant="primary" onClick={() => addFoodItem(index)}>
                  <i className="bi bi-plus fs-5"></i> 
                </Button>
              </div>
            ))
        }
        <div className="col-md-1"> {getTotalWeekCalories()} cals </div>
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