// methods to convert a date objects day of the week to a target day

// take a date object, and return a new date with the day set to monday
const getMonday = (d) => {
  d = new Date(d);
  // adjust when day is sunday
  var day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// take a date object, and return a new date with the day set to sunday
const getSunday = (d) => {
  d = new Date(d);
  // adjust when day is sunday
  var day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1) + 6;
  return new Date(d.setDate(diff));
};

// take a date object and a day, and return a new date with the day set to the passed day
const getCurrentDay = (d, wkDay) => {
  d = new Date(d);
  // adjust when day is the given date
  var day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1) + wkDay;
  return new Date(d.setDate(diff));
};

export { getMonday, getSunday, getCurrentDay };
