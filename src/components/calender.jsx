import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';
import SarabRunning1 from '../assets/sarab_running_1.jpeg';

const Calender = () => {
  //const [currentWeek, setCurrentWeek] = useState(new Date());
  //const [selectedDay, setSelectedDay] = useState();
  // meals by day
  const [currentWeekMeals, setCurrentWeekMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  
  // x index = day, y index = meal number
  useEffect(() => {
    fetch("http://localhost:9000/allMeals?weekDate=2023-01-30", {
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
      setCurrentWeekMeals(data);
    });
    //setCurrentWeekMeals(
    //  [
    //    [{name: "eggs", id: 69},{name: "chicken", id: 27}], // monday
    //    [{name: "m1"},{name: "m2"},{name: "m3"}], // tuesday
    //    [], // wednesday
    //    [{name: "m1"},{name: "m2"},{name: "m3"},{name: "m4"},{name: "m5"},{name: "m6"}], // thursday
    //    [], // friday
    //    [], // saterday
    //    [], // sunday
    //  ]);
  }, []);
  
  // render the button used to move week in the calender
  const renderWeekChanger = () => (
      <Row gap="0">
        <Col xs="1"></Col>
        <Col xs="2">
          <Stack direction="horizontal" gap={1}>
            <i className="bi bi-arrow-left-circle border"></i>
            <div className="border">Week</div>
            <i className="bi bi-arrow-right-circle border"></i>
          </Stack>
        </Col>
      </Row>
  ); 

  const renderItem = (item,index) => {
    return (
      <div>
        <div> {item.name} </div>
        <div> {item.mealType} </div>
        <div> {item.calories} </div>
        <Image 
          className="d-block w-100"
          src={SarabRunning1} 
          style={{maxHeight: "1vh", backgroundSize: "cover"}}
          alt="First slide"
          roundedCircle
        />
      </div>
    )
  }

  const renderDayRow = (day) => {
    //console.log(currentWeekMeals);
    return (
      <div>
        <div 
          className="d-flex justify-content-around flex-column"
          style={{minHeight: "50vh"}}
        >
          {
            currentWeekMeals[day].map((item,index)=>(
              <div xs="1" key={index} className="text-center border border-1 w-100 h-100 flex-grow-1 bg-white"> {renderItem(item,index)} </div>
            ))
          }
        </div>
      </div>
    )
  }

  const renderParentRows = () => {
    if (currentWeekMeals.length === 0)
      return <Spinner></Spinner>;
    else
      return (
        <div className="row gx-0 shadow-lg seven-cols">
          <div xs="1" className="col text-center">  
            <div className="bg-primary"> Monday </div>
            {renderDayRow(0)}
          </div>
          <div xs="1" className="col text-center"> 
            <div className="bg-primary"> Tuesday </div>
            {renderDayRow(1)}
          </div>
          <div xs="1" className="col text-center"> 
            <div className="bg-primary"> Wednesday </div>
            {renderDayRow(2)}
          </div>
          <div xs="1" className="col text-center"> 
            <div className="bg-primary"> Thursday </div>
            {renderDayRow(3)}
          </div>
          <div xs="1" className="col text-center"> 
            <div className="bg-primary"> Friday </div>
            {renderDayRow(4)}
          </div>
          <div xs="1" className="col text-center"> 
            <div className="bg-primary"> Saterday </div>
            {renderDayRow(5)}
          </div>
          <div xs="1" className="col text-center"> 
            <div className="bg-primary"> Sunday </div>
            {renderDayRow(6)}
            {/* currentWeekMeals.length !== 0 && renderDayRow(6) */}
          </div>
        </div>
      )
  }
  
  //const renderRow = () => {
  //  console.log("renderrows");
  //};

  return (
    <Container fluid>
      {renderWeekChanger()}
      {renderParentRows()}
    </Container>
  );
};

export default Calender;
