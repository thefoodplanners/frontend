import { useState, useEffect } from 'react';
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
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
    annotationPlugin
  );


const ProgressChart = () => {

  const [currentCalories, setCurrentCalories] = useState([]);
  const [fetchedCalories, setFetchedCalories] = useState(false);
  const [target, setTarget] = useState(0);
  const [fetchedTarget, setFetchedTarget] = useState(false);
  const [currentDateType, setCurrentDateType] = useState("day");

  useEffect(() => {
    if (fetchedCalories) {
      return;
    }
    fetch(`http://localhost:9000/chart/${currentDateType}/2023-01-30/calories`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    }).then((response) => {
      return response.json();
    }).then((data) => {
      setFetchedCalories(true);
      setCurrentCalories(data);
    });
  }, [currentCalories, fetchedCalories]);

  const fetchData = (dateType) => {
    setFetchedCalories(false);
    setCurrentCalories([]);
    setCurrentDateType(dateType);
  }

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

  const changeTarget = (dateType) => {
    let conversion = targetConversion.filter(conversion => conversion[0] == currentDateType && conversion[1] == dateType);
    let newTarget = target * conversion[0][2];
    setTarget(Math.round(newTarget));
  }

  const getAverage = (data) => {
    if (data.length == 0) return 0;
    else return data.reduce((a,b) => a + b) / data.length;
  };

  const labels = currentCalories.map(item => item.date);
  const caloriesData = currentCalories.map(item => item.caloriesConsumed);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Calories",
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
              position: "start",
              content: "Average"
            }
          }
        ]
      }
    }
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Calories consumed",
        data: caloriesData,
        pointRadius: 6,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      },
    ],
  };


  return (
    <div style={{ position: "relative", margin: "auto", width: "80vw", padding: "10px"}}>
    <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
        <ToggleButton id="day" variant="outline-primary"  onChange={() => {fetchData("day"); changeTarget("day")}} value={1}> Day </ToggleButton>
        <ToggleButton id="week" variant="outline-primary"  onChange={() => {fetchData("week"); changeTarget("week")}} value={2}> Week </ToggleButton>
        <ToggleButton id="month" variant="outline-primary" onChange={() => {fetchData("month"); changeTarget("month")}} value={3}> Month </ToggleButton>
        <ToggleButton id="year" variant="outline-primary" onChange={() => {fetchData("year"); changeTarget("year")}} value={4}> Year </ToggleButton>
    </ToggleButtonGroup>
    <Line options={options} data={data} />
    </div>
  );
};

export default ProgressChart;