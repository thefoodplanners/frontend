import Carousel from "react-bootstrap/Carousel";
import Cook from "../assets/cook.jpg";
import Conquer from "../assets/conquer.jpg";
import FoodImage1 from "../assets/meal_planner1.jpg";
import Image from "react-bootstrap/Image";
import "../scss/home.scss";

// home/advertising page
const Home = () => {
  return (
    <Carousel interval={null}>
      <Carousel.Item>
        <Image className="image" src={FoodImage1} alt="First slide" />
        <Carousel.Caption className="caption">
          <h1>Create</h1>
          <p>
            Start by telling us about yourself, your diet preferences, and your
            goals. We&apos;ll suggest and recommend meals specific to your needs
            in seconds! You always have the option to tweak your settings later.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image className="image" src={Cook} alt="Second slide" />
        <Carousel.Caption className="caption">
          <h1>Cook</h1>
          <p>
            Enjoy making and eating delicious meals without the stress of
            planning. Not only will you know you&apos;re eating better,
            you&apos;ll have more time and energy for other things.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image className="image" src={Conquer} alt="Third slide" />
        <Carousel.Caption className="caption">
          <h1>Conquer!</h1>
          <p>
            Make adjustments to your preferences, discover new meals, or add
            meals of your own to your meal plan. Review nutrition stats, compare
            your progress, and achieve your goals!
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Home;
