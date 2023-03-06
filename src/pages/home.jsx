import Carousel from 'react-bootstrap/Carousel';
//import MealPlannerImage from '../assets/meal_planner_image.png';
import SarabRunning1 from '../assets/sarab_running_1.jpeg';
import SarabRunning2 from '../assets/sarab_running_2.jpeg';
//import SarabRunning3 from '../assets/sarab_running_3.jpeg';
import FoodImage from '../assets/frontpage_food_image.jpeg';
//import DataImage from '../assets/sspic3.jpeg';

import Image from 'react-bootstrap/Image';

const Home = () => {
  return (
    <div>
      <Carousel>
        <Carousel.Item>
          <Image 
            className="d-block w-100"
            src={SarabRunning1} 
            style={{maxHeight: "50vh", backgroundSize: "cover", objectFit: "cover"}}
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image 
            className="d-block w-100 100px img-responsive"
            src={SarabRunning2} 
            style={{maxHeight: "50vh", backgroundSize: "cover", objectFit: "cover"}}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image 
            className="d-block w-100 h-50"
            src={FoodImage} 
            style={{maxHeight: "50vh", backgroundSize: "cover", objectFit: "cover"}}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );

};

export default Home;
