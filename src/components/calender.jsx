import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';

const Calender = () => {
  //const [currentWeek, setCurrentWeek] = useState(new Date());
  //const [selectedDay, setSelectedDay] = useState();
  // meals by day
  const [currentWeekMeals, setCurrentWeekMeals] = useState([]);
  
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
    });
    setCurrentWeekMeals(
      [
        [{name: "eggs", id: 69},{name: "chicken", id: 27}], // monday
        [{name: "m1"},{name: "m2"},{name: "m3"}], // tuesday
        [], // wednesday
        [{name: "m1"},{name: "m2"},{name: "m3"},{name: "m4"},{name: "m5"},{name: "m6"}], // thursday
        [], // friday
        [], // saterday
        [], // sunday
      ]);
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
              <div xs="1" key={index} className="text-center border w-100 h-100"> {item.name} </div>
            ))
          }
        </div>
      </div>
    )
  }

  const renderParentRows = () => (
    <Row className="gx-0">
      <Col xs="3"></Col>
      <Col xs="1" className="text-center border">  
        Mon
        {currentWeekMeals.length !== 0 && renderDayRow(0)}
      </Col>
      <Col xs="1" className="text-center border"> 
        Tues 
        {currentWeekMeals.length !== 0 && renderDayRow(1)}
      </Col>
      <Col xs="1" className="text-center border"> 
        Wed 
        {currentWeekMeals.length !== 0 && renderDayRow(2)}
      </Col>
      <Col xs="1" className="text-center border"> 
        Thurs 
        {currentWeekMeals.length !== 0 && renderDayRow(3)}
      </Col>
      <Col xs="1" className="text-center border"> 
        Fri 
        {currentWeekMeals.length !== 0 && renderDayRow(4)}
      </Col>
      <Col xs="1" className="text-center border"> 
        Sat 
        {currentWeekMeals.length !== 0 && renderDayRow(5)}
      </Col>
      <Col xs="1" className="text-center border"> 
        Sun 
        {currentWeekMeals.length !== 0 && renderDayRow(6)}
      </Col>
    </Row>
  )
  
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
