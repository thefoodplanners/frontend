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
        <div className="container">
          <div className="row">
          {preferencesData.map(({ preference }, index) => {
            return (
              <div 
                key={index} 
                className="col-6 d-flex justify-content-center"
              >
                <label className="me-2">{preference}</label>
                <input
                  type="checkbox"
                  id={`custom-checkbox-${index}`}
                  name={preference}
                  value={preference}
                  checked={props.checked[index]}
                  onChange={() => handleChange(index)}
                />
              </div>
            );
          })}
          </div>
        </div>
    </>
  );
};

export default Preferences;
