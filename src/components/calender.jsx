import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import { useCookies } from 'react-cookie'

const Calender = () => {
  //const [currentWeek, setCurrentWeek] = useState(new Date());
  //const [selectedDay, setSelectedDay] = useState();
  // meals by day
  const [currentWeekMeals, setCurrentWeekMeals] = useState([]);
  const [cookies, setCookie] = useCookies(['user_token'])
  
  // x index = day, y index = meal number
  useEffect(() => {
    fetch("http://localhost:9000/allMeals?weekDate=2023-01-30", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "session-cookie": cookies['user_token'],
      },
    }).then((response) => {
      console.log(response);
    });
    setCurrentWeekMeals(
      [
        [{name: "eggs", id: 69},{},{name: "chicken", id: 27},{},{name: "m1"},{},{name: "m1"}],
        [{name: "m2"},{name: "m2"},{name: "m2"},{},{name: "m2"},{},{}],
        [{name: "m3"},{name: "m3"},{name: "m3"},{name: "m3"},{name: "m3"},{name: "m3"},{name: "m3"}],
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

  // render header columns in the calender
  const renderDayHeaders = () => (
    <Row>
      <Col xs="3"></Col>
      <Col xs="1" className="text-center border"> Monday </Col>
      <Col xs="1" className="text-center border"> Tues </Col>
      <Col xs="1" className="text-center border"> Wed </Col>
      <Col xs="1" className="text-center border"> Thurs </Col>
      <Col xs="1" className="text-center border"> Fri </Col>
      <Col xs="1" className="text-center border"> Sat </Col>
      <Col xs="1" className="text-center border"> Sun </Col>
    </Row>
  );

  // render meal columns in the calender
  const renderMealRows = () => {
    // reformat meals to be by meal rather than by day
    //const mealsByMeal = []
    //for (let i = 0; i < currentWeekMeals.length; i++) {
    //  mealsByMeal[index] = [];
    //  // for each meal in that day
    //  for (let j = 0; j < currentWeekMeals.length; i++) {
    //    mealsByMeal[i].push(currentWeekMeals[j])
    //  }
    //}

    return (
      <div>
        {
          currentWeekMeals.map((item,index)=>(
            <Row>
              <Col xs="2"></Col>
              {
                currentWeekMeals[index].map((i, j) => {
                  if (i.name !== undefined) {
                    return <Col xs="1" className="text-center border"> {"M"+i.name} </Col>
                  } else
                    return <Col xs="1" className="text-center border">  </Col>
                })
              }
            </Row>
          ))
        }
      </div>
    )
  }
  
  //const renderRow = () => {
  //  console.log("renderrows");
  //};

  return (
    <Container>
      {renderWeekChanger()}
      {renderDayHeaders()}
      {renderMealRows()}
    </Container>
  );
};

export default Calender;
