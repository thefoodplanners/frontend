import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ArcElement,
    annotationPlugin
  );


const ProgressChart = () => {

  const [currentMetrics, setCurrentMetrics] = useState({"label": "", metrics: []});
  const [fetchedMetrics, setFetchedMetrics] = useState(false);
  const [target, setTarget] = useState(0);
  const [fetchedTarget, setFetchedTarget] = useState(false);
  const [currentDateType, setCurrentDateType] = useState("day");
  const [currentMacros, setCurrentMacros] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));

  // Fetches metrics.
  useEffect(() => {
    if (fetchedMetrics) {
      return;
    }
    fetch(`http://localhost:9000/chart/${currentDateType}/${selectedDate.getFullYear()}-${selectedDate.getMonth()+1}-${selectedDate.getDate()}/metrics`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    }).then((response) => {
      return response.json();
    }).then((data) => {
      setFetchedMetrics(true);
      setCurrentMetrics(data);
      let macros = (({ totalFats, totalProteins, totalCarbs }) => ({ totalFats, totalProteins, totalCarbs }))(data.metrics[0]);
      macros.day = data.metrics[0].date;
      setCurrentMacros(macros);
      setSelectedDate(new Date(data.date));
    });
  }, [currentMetrics, fetchedMetrics, currentMacros]);

  const fetchData = (dateType) => {
    setFetchedMetrics(false);
    setCurrentDateType(dateType);
  }

  // Fetches target calories.
  useEffect(() => {
  if (fetchedTarget) {
      return;
    }
    fetch(`http://localhost:9000/user/target-calories`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    }).then((response) => {
      return response.text();
    }).then((data) => {
      setFetchedTarget(true);
      setTarget(parseInt(data));
    });
  }, [target, fetchedTarget]);

  // Used by changeTarget. Conversion rate for target calories.
  const targetConversion = [
    ["day", "week", 7],
    ["day", "month", 30.5],
    ["day", "year", 365],
    ["week", "day", 1/7],
    ["week", "month", 4.3],
    ["week", "year", 52],
    ["month", "day", 1/30.5],
    ["month", "week", 1/4.3],
    ["month", "year", 12],
    ["year", "day", 1/365],
    ["year", "week", 1/52],
    ["year", "month", 1/12]
  ];

  // Changes target calories based on time unit selected.
  const changeTarget = (dateType) => {
    let conversion = targetConversion.filter(conversion => conversion[0] === currentDateType && conversion[1] === dateType);
    let newTarget = target * conversion[0][2];
    setTarget(Math.round(newTarget));
  }

  const getAverage = (data) => {
    if (data.length === 0) return 0;
    else return data.reduce((a,b) => a + b) / data.length;
  };

  // Changes date for that time unit.
  const updateDate = (isPrev) => {
    setFetchedMetrics(false);
    let value;
    let newDate;
    switch (currentDateType) {
      case "day":
        if (isPrev) value = -1;
        else value = 1;
        newDate = new Date(selectedDate.setDate(selectedDate.getDate() + value));
        break;
      case "week":
        if (isPrev) value = -7;
        else value = 7;
        newDate = new Date(selectedDate.setDate(selectedDate.getDate() + value));
        break;
      case "month":
        if (isPrev) value = -1;
        else value = 1;
        newDate = new Date(selectedDate.setMonth(selectedDate.getMonth() + value));
        break;
      case "year":
        if (isPrev) value = -1;
        else value = 1;
        newDate = new Date(selectedDate.setFullYear(selectedDate.getFullYear() + value));
        break;
    };
    setSelectedDate(newDate);
  };

  // Extracts macros fields in main json currentMetrics.
  const macros = (index, dayName) => {
    let macroObj = (({ totalFats, totalProteins, totalCarbs }) => ({ totalFats, totalProteins, totalCarbs }))(currentMetrics.metrics[index]);
    macroObj.day = dayName;
    return macroObj;
  }

  const macrosData = Object.values(currentMacros);

  const labelsCalories = currentMetrics.metrics.map(item => item.date);
  const caloriesData = currentMetrics.metrics.map(item => item.totalCalories);

  const fatsData = currentMetrics.metrics.map(item => item.totalFats);
  const proteinsData = currentMetrics.metrics.map(item => item.totalProteins);
  const carbsData = currentMetrics.metrics.map(item => item.totalCarbs);

  const optionsCalories = {
    responsive: true,
    onClick: (_, elems) => {
      if (elems.length > 0) {
        let ind = elems[0].index;
        let dayName = dataCalories.labels[ind];
        setCurrentMacros(macros(ind, dayName));
        console.log(macros(ind, dayName));
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 20
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 20
          }
        }
      }
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Calories",
        font: {
          size: 40
        }
      },
      annotation: {
        annotations: [
          {
            type: "line",
            mode: "horizontal",
            yMin: target,
            yMax: target,
            value: target,
            borderColor: "rgb(97, 215, 215)",
            borderWidth: 3,
            label: {
              display: true,
              backgroundColor: "rgb(27, 75, 75)",
              position: "start",
              content: "Target"
            }
          },
          {
            type: "line",
            mode: "horizontal",
            yMin: getAverage(caloriesData),
            yMax: getAverage(caloriesData),
            borderColor: "rgb(255, 176, 97)",
            borderWidth: 3,
            label: {
              display: true,
              backgroundColor: "rgb(153, 77, 0)",
              position: "end",
              content: "Average"
            }
          }
        ]
      }
    }
  };

  const dataCalories = {
    labels: labelsCalories,
    datasets: [
      {
        label: "Calories consumed",
        data: caloriesData,
        pointRadius: 6,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        font: {
          size: 20
        }
      },
    ],
  };

  const optionsMacros = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Macros for " + macrosData[macrosData.length - 1],
        font: {
          size: 30
        }
      },
      // Numeric value displayed for each macro.
      datalabels: {
        color: "white",
        padding: 6,
        font: {
          weight: "bold",
          size: 14
        },
        borderColor: 'white',
        borderRadius: 25,
        borderWidth: 2,
        backgroundColor: "#333333",
        display: function(context) {
          return context.dataset.data[context.dataIndex] > 3;
        },
        formatter: (value, ctx) => {
          return value + "g";
        }
      },
      // Displayed when user hovers over chart.
      tooltip: {
        callbacks: {
          title: (data) => {return ""},
          label: (data) => {return `${data.label}: ${data.raw}g`}
        }
      }
    }
  }

  const dataMacros = {
      labels: ["Fats", "Proteins", "Carbohydrates"],
      datasets: [
        {
          data: macrosData.slice(0, -1),
          backgroundColor: [
            "rgba(255, 148, 77, 0.7)",
            "rgba(230, 0, 0, 0.7)",
            "rgba(204, 153, 0, 0.7)",
          ],
          borderColor: [
            "rgba(255, 148, 77, 1)",
            "rgba(230, 0, 0, 1)",
            "rgba(204, 153, 0, 1)",
          ],
          borderWidth: 2,
        }
      ],
    };

  const renderWeekChanger = () => (
      <div className="row gx-0 seven-cols mb-3 mt-3 d-flex justify-content-center">
        {/* <div className="col-xs-0 col-md-1"></div> */}
        <div className="col-xs-12 col-md-3">
          <div className="d-flex justify-content-between align-items-center">
            <Button className="btn" onClick={() => updateDate(true)}>
              <i className="bi bi-arrow-left"></i>
            </Button>
            <div className="text-center"> {currentMetrics.label} </div>
            <Button className="btn" onClick={() => updateDate(false)}>
              <i className="bi bi-arrow-right"></i>
            </Button>
          </div>
        </div>
      </div>
  );

  return (
    <div>
      <div style={{ position: "relative", width: "70vw", margin: "20px", float: "left" }}>
        {renderWeekChanger()}
        <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
          <ToggleButton id="day" variant="outline-primary"  onChange={() => {fetchData("day"); changeTarget("day")}} value={1}> Day </ToggleButton>
          <ToggleButton id="week" variant="outline-primary"  onChange={() => {fetchData("week"); changeTarget("week")}} value={2}> Week </ToggleButton>
          <ToggleButton id="month" variant="outline-primary" onChange={() => {fetchData("month"); changeTarget("month")}} value={3}> Month </ToggleButton>
          <ToggleButton id="year" variant="outline-primary" onChange={() => {fetchData("year"); changeTarget("year")}} value={4}> Year </ToggleButton>
        </ToggleButtonGroup>
        <Line options={optionsCalories} data={dataCalories} />
      </div>
      <div style={{ width: "20vw", height: "500px", float: "left", margin: "200px 0 0 35px" }}>
        <Pie options={optionsMacros} data={dataMacros} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

export default ProgressChart;