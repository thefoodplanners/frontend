import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

const MacrosPieChart = (props) => {
  let recipe = props.recipe;

  // create pie chart with macro data
  const data = {
    labels: ["Fats (g)", "Proteins (g)", "Carbohydrates (g)"],
    datasets: [
      {
        label: "Macro nutrients",
        data: [
          recipe.fats.toFixed(1),
          recipe.proteins.toFixed(1),
          recipe.carbohydrates.toFixed(1),
        ],
        backgroundColor: [
          "rgba(255, 148, 77, 0.2)",
          "rgba(230, 0, 0, 0.2)",
          "rgba(204, 153, 0, 0.2)",
        ],
        borderColor: [
          "rgba(255, 148, 77, 1)",
          "rgba(230, 0, 0, 1)",
          "rgba(204, 153, 0, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Macros for " + recipe.name,
        font: {
          size: 30,
        },
      },
      // Numeric value displayed for each macro.
      datalabels: {
        color: "white",
        padding: 6,
        font: {
          weight: "bold",
          size: 14,
        },
        borderColor: "white",
        borderRadius: 25,
        borderWidth: 2,
        backgroundColor: "#333333",
        display: function (context) {
          return context.dataset.data[context.dataIndex] > 3;
        },
        formatter: (value) => {
          return value + "g";
        },
      },
      // Displayed when user hovers over chart.
      tooltip: {
        callbacks: {
          title: () => {
            return "";
          },
          label: (data) => {
            return `${data.label}: ${data.raw}g`;
          },
        },
      },
    },
  };

  return <Pie options={options} data={data} plugins={[ChartDataLabels]} />;
};

MacrosPieChart.propTypes = {
  recipe: PropTypes.any,
};

export default MacrosPieChart;
