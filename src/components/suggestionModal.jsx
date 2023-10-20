import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import AsyncSelect from "react-select/async";
import PropTypes from "prop-types";

// pane for dynamic suggestion items
const SuggestionPane = (props) => {
  // state for parent modal component
  const [fetched, setFetched] = useState(false);
  const [addMealList, setAddMealList] = useState([]);
  // state for suggestions
  const [selectedMealStates, setSelectedMealStates] = useState([
    false,
    false,
    false,
  ]);
  const [currentSuggestionsIndex, setCurrentSuggestionsIndex] = useState(0);
  const [macroDropdown, setMacroDropdown] = useState("Fats");
  const [macroValue, setMacroValue] = useState(0);

  // TODO why does this keep running over and over?
  // fetch options for suggested options
  useEffect(() => {
    // fetch meals we can add
    if (fetched) return;
    const date = `${props.date.getFullYear()}-${
      props.date.getMonth() + 1
    }-${props.date.getDate()}`;
    let macro;
    if (macroValue === 0) {
      macro = "";
    } else {
      macro = `${macroDropdown.toLowerCase()}=${macroValue}`;
    }
    // fetch list of suggestions
    fetch(
      `http://localhost:9000/calendar/meals/recommendation?date=${date}&${macro}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        credentials: "include",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAddMealList(data);
        setFetched(true);
      });
  }, [addMealList, fetched]);

  // update state when suggestion is selected and tell parent modal
  const handleItemSelected = (listGroupIndex) => {
    // set the meal as selected
    const newSelectedMealStates = selectedMealStates.map((item, index) => {
      if (index === listGroupIndex) return true;
      else return false;
    });
    setSelectedMealStates(newSelectedMealStates);

    const currentSelectedIndex = newSelectedMealStates.indexOf(true);
    const mealToAdd =
      addMealList[currentSuggestionsIndex][currentSelectedIndex];
    // set parent dialog to the selected meal
    props.setMealToAdd(mealToAdd.id);
  };

  // load next 3 suggestions
  const handleNextSuggestionsClick = (move) => {
    // len = 3, index = 2, move= +1: index=(index+1)%len: index=2+1=3%3=0
    // len = 3, index = 0, move= -1: index=(index+1)%len: index=2+1=3%3=0
    // if index out of bound then wrap around
    let nextIndex = currentSuggestionsIndex + move;
    if (nextIndex === -1) nextIndex = addMealList.length - 1;
    else if (nextIndex === addMealList.length) nextIndex = 0;
    setCurrentSuggestionsIndex(nextIndex);
    setSelectedMealStates([false, false, false]);
    props.setMealToAdd(-1);
  };

  // update filter of suggestions
  const handleMacroChange = (event) => {
    setMacroValue(event.target.value);
    setSelectedMealStates([false, false, false]);
    setAddMealList([]);
    setFetched(false);
  };

  return (
    <div>
      <h4>Suggested meals</h4>
      <InputGroup className="mb-2">
        <DropdownButton title={macroDropdown} id="input-group-dropdown-1">
          <Dropdown.Item onClick={() => setMacroDropdown("Fats")}>
            Fats
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setMacroDropdown("Proteins")}>
            Proteins
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setMacroDropdown("Carbohydrates")}>
            Carbohydrates
          </Dropdown.Item>
        </DropdownButton>
        <Form.Control
          style={{ maxWidth: "100px", fontWeight: "bold" }}
          aria-label="Text input with dropdown button"
          type="number"
          onChange={handleMacroChange}
        />
        <InputGroup.Text>
          <b>g</b>
        </InputGroup.Text>
      </InputGroup>
      {
        // if we have fetched meal list
        addMealList.length !== 0 && (
          <ListGroup as="ol" numbered>
            {addMealList[currentSuggestionsIndex].map((item, index) => (
              <ListGroup.Item
                key={index}
                as="li"
                active={selectedMealStates[index]}
                onClick={() => handleItemSelected(index)}
              >
                {item.name} - {item.calories}cals, {item.fats.toFixed(1)}g fats,{" "}
                {item.proteins.toFixed(1)}g proteins,{" "}
                {item.carbohydrates.toFixed(1)}g carbs
              </ListGroup.Item>
            ))}
          </ListGroup>
        )
      }
      {
        // if we have fetched meal list
        addMealList.length === 0 && (
          <Spinner
            animation="border"
            role="status"
            style={{
              maxWidth: "480px",
            }}
          />
        )
      }
      <div
        id="button-container"
        className="mt-5 d-flex justify-content-between align-items-center"
      >
        <Button
          onClick={() => {
            handleNextSuggestionsClick(-1);
          }}
        >
          Previous suggestions
        </Button>
        <Button
          onClick={() => {
            handleNextSuggestionsClick(1);
          }}
        >
          More suggestions
        </Button>
      </div>
    </div>
  );
};

// pane for searching items
const SearchPane = (props) => {
  // fetch options for search
  const loadSearchOptions = (input, callback) => {
    fetch(`http://localhost:9000/search/recipe?query=${input}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data = data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        callback(data);
      });
  };

  // update parent component state when meal is selected
  const onchangeSelect = (item) => {
    props.setMealToAdd(item.value);
  };

  return (
    <div>
      <h4>Search for a meal</h4>
      <AsyncSelect
        loadOptions={loadSearchOptions}
        onChange={onchangeSelect}
        className="mt-5"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: "#DD5353",
            primary: "#F50057",
          },
        })}
      />
    </div>
  );
};

// add suggestions modal
const SuggestionModal = (props) => {
  // whether to show pane with suggestions or pane with search bar
  const [currentPane, setCurrentPane] = useState("suggestion");
  // int repersenting id of meal to add
  const [mealToAdd, setMealToAdd] = useState(-1);

  // handle when item is added by child pane
  const handleAddItem = () => {
    props.onHide();
    const currentDate = new Date(props.date);

    // set body of POST request to add item
    const body = {
      date: `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()}`,
      mealNum: 0,
      recipeId: mealToAdd,
    };

    // tell backend to add item
    fetch("http://localhost:9000/calendar/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
      withCredentials: true,
      credentials: "include",
    }).then((response) => {
      if (response.ok) props.setFetchedMeals(false);
    });
  };

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
        <div
          id="button-container"
          className="mt-5 mb-5 d-flex justify-content-center align-items-center"
        >
          <Button
            onClick={() => {
              setCurrentPane("suggestion");
            }}
            disabled={currentPane === "suggestion"}
          >
            Suggestions
          </Button>
          <Button
            onClick={() => {
              setCurrentPane("search");
            }}
            disabled={currentPane === "search"}
          >
            Search Meal
          </Button>
        </div>
        {currentPane === "suggestion" && (
          <SuggestionPane setMealToAdd={setMealToAdd} date={props.date} />
        )}
        {currentPane === "search" && <SearchPane setMealToAdd={setMealToAdd} />}
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={() => {
            handleAddItem();
          }}
          disabled={!mealToAdd === -1}
        >
          <i className="bi bi-plus fs-4"></i>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

SuggestionPane.propTypes = {
  date: PropTypes.any,
  setMealToAdd: PropTypes.any
};

SearchPane.propTypes = {
  setMealToAdd: PropTypes.any
};

SuggestionModal.propTypes = {
  onHide: PropTypes.any,
  date: PropTypes.any,
  setFetchedMeals: PropTypes.any
};

export default SuggestionModal;
