import { preferencesData } from "../utils/preferencesData";

// prefereces component
const Preferences = (props) => {
  // update state when an item is added
  const handleChange = (position) => {
    const updateChecked = props.checked.map((item, index) =>
      index === position ? !item : item
    );

    props.setChecked(updateChecked);
  };

  return (
    <>
      <h4 className="title">Select preferences</h4>
      <ul className="preferences-list">
        {preferencesData.map(({ preference }, index) => {
          return (
            <li key={index}>
              <input
                type="checkbox"
                id={`custom-checkbox-${index}`}
                name={preference}
                value={preference}
                checked={props.checked[index]}
                onChange={() => handleChange(index)}
              />
              <label>{preference}</label>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Preferences;
