import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { IoCloseSharp } from "react-icons/io5";
const ImagePreview = ({ image, setFullPreview }) => {
  return (
    <div
      className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-90 z-[1000] flex items-center justify-center"
      onClick={() => {
        setFullPreview(false);
      }}
    >
      <button className="absolute top-5 right-5 md:right-20">
        <IoCloseSharp size={47} color="white" />
      </button>
      <div
        className="h-fit w-fit"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <TransformWrapper>
          <TransformComponent>
            <img src={image} className="w-10/12 m-0 mx-auto" alt="test" />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default ImagePreview;
