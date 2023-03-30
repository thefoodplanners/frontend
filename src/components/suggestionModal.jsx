import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import AsyncSelect from 'react-select/async';

const SuggestionModal = (props) => {
  const [addMealList, setAddMealList] = useState([]);
  // state for suggestions
  const [selectedMealStates, setSelectedMealStates] = useState([false, false, false]);
  const [currentSuggestionsIndex, setCurrentSuggestionsIndex] = useState(0);
  
  // state for search bar
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // TODO why does this keep running over and over?
  // fetch options for suggested options
  useEffect(() => {
    //console.log("use effect run: ");
    //console.log(addMealList);
    // fetch meals we can add
    fetch("http://localhost:9000/calendar/meals/recommendation", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: 'include',
    }).then((response) => {
      //console.log(response);
      return response.json();
    }).then((data) => {
      console.log(data);
      setAddMealList(data);
    });
  }, []);
  //}, [addMealList]);

  // fetch options for search
  const loadSearchOptions = (input, callback) => {
    fetch(`http://localhost:9000/search?query=${input}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: 'include',
    }).then((response) => {
      //console.log(response);
      return response.json();
    }).then((data) => {
      data = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      callback(data)
    });
  }
  
  const handleItemSelected = (listGroupIndex) => {
    const newSelectedMealStates = [...selectedMealStates];
    setSelectedMealStates(newSelectedMealStates.map((item, index) => {
      if (index === listGroupIndex) return true;
      else return false;
    }))
  }
  
  const handleNextSuggestionsClick = (move) => {
    // len = 3, index = 2, move= +1: index=(index+1)%len: index=2+1=3%3=0
    // len = 3, index = 0, move= -1: index=(index+1)%len: index=2+1=3%3=0
    // if index out of bound then wrap around
    let nextIndex = currentSuggestionsIndex+move;
    if (nextIndex === -1) nextIndex = addMealList.length-1
    else if (nextIndex === addMealList.length) nextIndex = 0;
    setCurrentSuggestionsIndex(nextIndex);
    setSelectedMealStates([false, false, false])
    //setSelectedMealStates(Array(data[0].length).fill(false))
  }

  // add an item, can only be called when an item is selected
  const handleAddItem = () => {
    const currentSelectedIndex = selectedMealStates.indexOf(true);
    const mealToAdd = addMealList[currentSuggestionsIndex][currentSelectedIndex];
    props.onHide();
    const currentDate = new Date(props.date);
    const body = {
        date: `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`,
        mealNum: 0,
        recipeId: mealToAdd.id
    };
    //console.log(JSON.stringify(body));
    
    fetch("http://localhost:9000/calendar/meals", {
      method: "POST",
      headers: {
        //"Content-Type": "application/json",
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
      withCredentials: true,
      credentials: 'include',
    }).then((response) => {
      if (response.ok) props.setFetchedMeals(false)
      //console.log(response);
      //return response.json();
    });
  }
  
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="shadow-lg"
    >
      <Modal.Header className="bg-primary" closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add a meal?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Suggested meals</h4>
        {
          // if we have fetched meal list
          addMealList.length !== 0 &&
          <ListGroup as="ol" numbered>
            {
              addMealList[currentSuggestionsIndex].map((item,index) => (
                <ListGroup.Item key={index} as="li" active={selectedMealStates[index]} onClick={() => handleItemSelected(index)}> {item.name} </ListGroup.Item>
              ))
            }
          </ListGroup>
        }
        {
          // if we have fetched meal list
          addMealList.length === 0 &&
          <Spinner 
            animation="border" 
            role="status"
            style={{
              maxWidth: "480px",
            }}
          />
        }
      <div id="button-container" className="mt-5 d-flex justify-content-between align-items-center">
        <Button onClick={() => {handleNextSuggestionsClick(-1)}}>Previous suggestions</Button>
        <Button onClick={() => {handleNextSuggestionsClick(1)}}>More suggestions</Button>
      </div>
      <AsyncSelect loadOptions={loadSearchOptions} className="mt-5" />
      </Modal.Body>
      <Modal.Footer>
        <Button 
          onClick={() => {handleAddItem()}}
          disabled={!selectedMealStates.includes(true)}
        > 
          <i className="bi bi-plus fs-4"></i>
        </Button>
        {/* <Button onClick={props.onHide}>Close</Button> */}
      </Modal.Footer>
    </Modal>
  );
}

export default SuggestionModal;