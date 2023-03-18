import { useState, useEffect } from 'react';
//import Row from 'react-bootstrap/Row';
//import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

import SuggestionModal from './suggestionModal';

const Calender = () => {
  //const [currentWeek, setCurrentWeek] = useState(new Date());
  //const [selectedDay, setSelectedDay] = useState();
  // meals by day
  const [currentWeekMeals, setCurrentWeekMeals] = useState([]);
  const [fetchedMeals, setFetchedMeals] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date("2023-01-30"));
  const [suggestionSelectedDate, setSuggestionSelectedDate] = useState(selectedDate);
  const [showSugestionModal, setShowSugestionModal] = useState(false);
  // day
  //const [suggestionAddDay, setSuggestionAddDay] = useState(-1);
  
  // x index = day, y index = meal number
  useEffect(() => {
    //2023-02-30
    // fetch meals for calender
    const weekDate = getMonday(selectedDate);
    fetch(`http://localhost:9000/allMeals?weekDate=${weekDate.getFullYear()}-${weekDate.getMonth()+1}-${weekDate.getDate()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: 'include',
    }).then((response) => {
      console.log(response);
      return response.json();
    }).then((data) => {
      console.log(data);
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
  }, [selectedDate]);

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

  const renderItem = (item,index) => {
    const imageRef = `data:image/jpeg;base64,${item.imageRef}`;
    return (
      <div
        style={{backgroundImage: "url('" + imageRef + "')",  backgroundSize: "cover", backgroundPosition: "center", display: "grid", gridTemplateColumns: "1fr"}}
        className="w-100"
      >
        <div className="w-100 d-flex justify-content-start align-items-right z-1" style={{gridRowStart: "1", gridColumnStart: "1", padding: "0px 4px"}}>
          <i className="bi bi-x-lg"></i>
        </div>
        <div className="w-100 d-flex flex-column justify-content-center align-items-center" style={{gridRowStart: "1", gridColumnStart: "1", padding: "1px 0px"}}>
          <div className="text-white fw-bold" style={{textShadow: "0px 0px 10px  black", backgroundColor: "#0008", width: "fit-content", padding: "0px 4px"}}> {item.name} </div>
          <div className="text-white fw-bold" style={{textShadow: "0px 0px 10px  black", backgroundColor: "#0008", width: "fit-content", padding: "0px 4px"}}> {item.mealType} </div>
          <div className="text-white fw-bold" style={{textShadow: "0px 0px 10px  black", backgroundColor: "#0008", width: "fit-content", padding: "0px 4px"}}> {item.calories} cals </div>
        </div>
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
                {renderItem(item,index)}
              </div>
            ))
          }

          {
            // if we have fetched meals from the backend and we have no meals
            fetchedMeals && currentWeekMeals[day].length === 0 &&
              <div className="text-center border border-1 w-100 h-100 flex-grow-1 bg-white shadow-sm d-flex justify-content-center align-items-center"> 
                <Button className="btn" variant="primary" onClick={() => setShowSugestionModal(true)} style={{backgroundColor: "#9EE493", borderColor: "#5db7de"}}>
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
    return currentWeekMeals[day].reduce((sum, item) => sum + item.calories, 0);
  }
  
  const getTotalWeekCalories = () => {
    // if we havent fetched meals yet return nothing
    if (!fetchedMeals) return 0;
    // if we have sum calories for all meals in the current day
    return currentWeekMeals.reduce((sum, day) => sum + day.reduce((sum, meal) => sum + meal.calories, 0), 0)
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
    setShowSugestionModal(true);
  }
  
  return (
    <Container fluid>
      {renderWeekChanger()}
      {renderParentRows()}
      <div className="mt-3" />
      <div className="row gx-0 seven-cols">
        {
            [0,1,2,3,4,5,6].map((item,index)=>(
              <Button key={index} className="btn col-md-1" variant="primary" onClick={() => addFoodItem(index)}>
                <i className="bi bi-plus fs-1"></i> 
              </Button>
            ))
        }
        <div className="col-md-1"> {getTotalWeekCalories()} cals </div>
      </div>
      <SuggestionModal
        show={showSugestionModal}
        onHide={() => setShowSugestionModal(false)}
        date={suggestionSelectedDate}
      />
    </Container>
  );
};

export default Calender;