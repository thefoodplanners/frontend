import Image from 'react-bootstrap/Image'
import MealPlannerImage from '../assets/meal_planner_image.png'

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Image src={MealPlannerImage} />
    </div>
  );
};

export default Dashboard;
