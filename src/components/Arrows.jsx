// Define your custom arrow components
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
export const CustomPrevArrow = (props) => (
  <div
    className="custom-prev-arrow text-primary-500 bg-primary-950 w-10 h-10 rounded-full flex items-center justify-center"
    style={{ position: "absolute", top: "50%", left: "10px", zIndex: 1000 }}
  >
    <IoIosArrowBack size={27} />
  </div>
);

export const CustomNextArrow = (props) => (
  <div
    className="custom-next-arrow text-primary-500 bg-primary-950 w-10 h-10 rounded-full flex items-center justify-center"
    style={{ position: "absolute", top: "50%", right: "10px", zIndex: 1000 }}
  >
    <IoIosArrowForward size={27} />
  </div>
);
