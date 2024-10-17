import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "rc-slider/assets/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ImagePreview from "./../components/ImagePreview";
import { Loader } from "./../components/loader/Loader";
import { firestore } from "./../configs/firebase.config";
import { getDocs, collection } from "firebase/firestore";
import { createDocument } from "./../services/firebase.services";
import {
  translatePrompt,
  makeFirstRequest,
  makeUpscaleRequest,
} from "./../services/replicate.services";
import { useNavigate } from "react-router-dom";

const RESOLUTIONS = [
  {
    width: 1024,
    height: 680,
  },
  {
    width: 680,
    height: 1024,
  },
  { width: 1024, height: 1024 },
];

const paintingTypes = [
  "Portret",
  "Geschilderd",
  "Realistisch",
  "Digitale kust",
  "Illustratief",
  "Anime",
  "Geanimeerd",
  "Geen filter",
];

const loadingTexts = [
  "Je kunstwerk is er bijna...",
  "Wacht nog even...",
  "Binnen een paar seconden klaar...",
];
export const Generator = ({ setId, setUrl }) => {
  const navigate = useNavigate();
  //
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [promptStrength, setPromptStrength] = useState(65);
  const [results, setResults] = useState(null);
  const [result, setResult] = useState(null);
  const [scaleValue, setScaleValue] = useState(4);
  const [resolution, setResolution] = useState(0);
  const [paintingType, setPaintingType] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  //
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [canUpscale, setCanUpscale] = useState(true);
  const [rightContent, setRightContent] = useState("default");
  const [isInsertingProduct, setIsInsertingProduct] = useState(false);
  const [isSetToProduct, setIsSetToProduct] = useState(false);
  const [error, setError] = useState("");
  //
  const [fullPreview, setFullPreview] = useState(false);

  useEffect(() => {
    getImages();
    const _prompt = localStorage.getItem("prompt");
    // generateVariation();
    if (_prompt) {
      setPrompt(_prompt);
      return;
    } else {
      setPrompt("A dancing cat");
    }
  }, []);
  const handleButtonClick = (message) => {
    toast.info(message); // Display an info toast
  };
  const properties = {
    prevArrow: (
      <button
        className="custom-prev-arrow text-primary-500 bg-primary-950 w-10 h-10  flex items-center justify-center z-0"
        style={{ position: "absolute", top: "50%", left: "10px", zIndex: 1000 }}
      >
        <IoIosArrowBack size={27} />
      </button>
    ),
    nextArrow: (
      <button
        className="custom-next-arrow text-primary-500 bg-primary-950 w-10 h-10 flex items-center justify-center z-0"
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          zIndex: 1000,
        }}
      >
        <IoIosArrowForward size={27} />
      </button>
    ),
  };
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 7000);

    return () => clearInterval(intervalId);
  }, []);

  const [products, setProducts] = useState([]);

  const getImages = async () => {
    const querySnapshot = await getDocs(collection(firestore, "images"));
    const dataArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(dataArray);
    setProducts(dataArray);
  };

  return (
    <div className="md:px-16">
      <ToastContainer />
      <div className="w-ful h-fit flex flex-col min-h-screen gap-5 p-5 bg-primary-950 prose max-w-none">
        {fullPreview && (
          <ImagePreview
            image={results[0][currentImageIndex]}
            setFullPreview={setFullPreview}
          />
        )}
        <div className="text-center text-white mt-10">
          {" "}
          <h1 className="text-white text-center">
            Geneer je eigen Canvas, Aluminium of Glazen schilderij
          </h1>
          <h2 className="text-white m-0">Breng jouw fantasie naar de muur </h2>
        </div>
        <div className="flex flex-col flex-grow xl:flex-row mt-10 gap-20 mx-0 md:mx-10">
          <div className="flex w-full flex-1 flex-col xl:w-6/12 bg-primary-950 ">
            <div className="prose flex max-w-none flex-grow flex-col justify-center rounded-lg pb-10">
              {prompt && (
                <div className="mt-5 flex w-full justify-center">
                  <Formik
                    initialValues={{
                      prompt: prompt,
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      setSubmitting(true);
                      setRightContent("loading");
                      setIsProcessing(true);
                      try {
                        setCanUpscale(true);
                        const ls_prompts = localStorage.getItem("prompts");
                        let newData;
                        if (ls_prompts) {
                          newData = JSON.parse(ls_prompts);
                          newData.push(values.prompt);
                        } else {
                          newData = [values.prompt];
                        }
                        localStorage.setItem(
                          "prompts",
                          JSON.stringify(newData)
                        );
                        const translatedPrompt = await translatePrompt(
                          values.prompt
                        );
                        handleButtonClick(
                          "Detected language " +
                            translatedPrompt.detectedLanguage
                        );
                        let start = new Date().getTime();
                        let _result = await makeFirstRequest(
                          (translatedPrompt.result || values.prompt),
                          image,
                          promptStrength / 100,
                          RESOLUTIONS[resolution],
                          null,
                          3
                        );
                        let end = new Date().getTime();
                        let duration = end - start;
                        console.log(
                          `Process duration: ${duration} milliseconds`
                        );
                        setResults(_result);
                        setResult(_result[0]);
                        setRightContent("new-result");

                        setSubmitting(false);
                        setIsInsertingProduct(false);
                        setIsSetToProduct(false);
                        setIsProcessing(false);
                        setCurrentImageIndex(0);
                      } catch (error) {
                        setRightContent("error");
                        console.log(error);
                        setIsProcessing(false);

                        setError(
                          "Ooops! An error occurred while generating your image , Please try again."
                        );
                      }
                    }}
                  >
                    {({ isSubmitting, values }) => (
                      <Form className="flex h-full w-full flex-col items-center gap-8 bg-primary-950 ">
                        <div className="w-full">
                          <label
                            htmlFor=""
                            className="text-left font-extrabold text-accent-600"
                          >
                            Omschrijf hier jou gedachten:{" "}
                          </label>
                          <Field
                            type="text"
                            id="prompt-input"
                            placeholder="Astronaut kit portrait , fantasy , ..."
                            className="mt-2 w-full rounded-3xl border-4 border-primary-400 text-white bg-transparent p-4 py-2 focus:outline-none"
                            name="prompt"
                            onBlur={(event) => {
                              localStorage.setItem(
                                "prompt",
                                event.target.value
                              );
                            }}
                          />
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor=""
                            className="text-left font-extrabold text-accent-600"
                          >
                            Vorm :{" "}
                          </label>
                          <div className="w-full flex justify-center gap-5 items-center text-xl">
                            <button
                              type="button"
                              className="text-accent-600"
                              onClick={() => {
                                if (resolution === 0) return;
                                setResolution(resolution - 1);
                              }}
                            >
                              <FaChevronLeft />
                            </button>
                            <div className="text-white">
                              {RESOLUTIONS[resolution].width ==1024 &&
                              RESOLUTIONS[resolution].height ==680? "Staand":RESOLUTIONS[resolution].width ==680 &&
                              RESOLUTIONS[resolution].height ==1024?"Liggend":"Vierkant"}
                            </div>
                            <button
                              type="button"
                              className="text-accent-600"
                              onClick={() => {
                                if (resolution === 2) return;
                                setResolution(resolution + 1);
                              }}
                            >
                              <FaChevronRight />
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-8">
                          <button
                            className={`${
                              isSubmitting || !values.prompt || isProcessing
                                ? "bg-primary-300 bg-opacity-35"
                                : "bg-primary-900"
                            } custom-text h-12 w-52 rounded-3xl text-lg font-bold text-white focus:outline-none`}
                            type="submit"
                            disabled={
                              isSubmitting || !values.prompt || isProcessing
                            }
                          >
                            Creëer kunstwerk
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full flex-1 flex-col items-center rounded-3xl border border-primary-600 py-5 xl:w-6/12 xl:py-0  ">
            <div className="w-full flex-grow px-5 md:px-5">
              {(() => {
                switch (rightContent) {
                  case "default":
                    return (
                      <div className="custom-text min-h-64 text-center prose flex h-full w-full max-w-none items-center justify-center text-3xl font-bold text-accent-300 relative">
                        <div className="w-11/12 h-28 px-20 bg-accent-900 rounded-full blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"></div>
                        <span className="z-10 px-24">
                          Er is nog geen afbeelding gegenereerd.
                        </span>
                      </div>
                    );
                  case "loading":
                    return <Loader />;
                  case "new-result":
                    return (
                      <>
                        <div className="flex gap-4 flex-col h-full w-full items-center justify-center py-5">
                          <div className="slide-container w-full rounded-2xl overflow-hidden relative z-10">
                            <Slide
                              autoplay={false}
                              onChange={(oldIndex, newIndex) => {
                                setCurrentImageIndex(newIndex);
                              }}
                              {...properties}
                            >
                              {results[0].map((base64, index) => (
                                <div
                                  key={index}
                                  className="relative -mr-12"
                                  onClick={() => setFullPreview(true)}
                                >
                                  <div className="image-container">
                                    <img
                                      className="image-object"
                                      src={base64}
              alt={`Watermarked Image ${index + 1}`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </Slide>
                            <span className="absolute bottom-5 right-5 text-primary-500 font-extrabold text-3xl">
                              {currentImageIndex + 1} / 2
                            </span>
                          </div>
                          <div className="w-full flex justify-center gap-6 mt-5">
                            <button
                              className={`w-full ${
                                isInsertingProduct
                                  ? isSetToProduct
                                    ? "bg-white text-green-500"
                                    : "bg-primary-600"
                                  : "bg-accent"
                              }  bg-primary-800 py-2 text-white rounded-xl font-bold`}
                              onClick={async () => {
                                try {
                                  setIsInsertingProduct(true);
                                  setIsProcessing(true);
                                  console.log("Result: ", result);
                                  console.log("Current image index: ", currentImageIndex);
                                  console.log("Result URL: ", result[currentImageIndex].split("/").pop());
                                  const _result = await makeUpscaleRequest(
                                    result[currentImageIndex].split("/").pop(),
                                    scaleValue
                                  );
                                  console.log(_result)
                                  const _id= await createDocument("images", {
                                    image: _result.framedImageUrl,
                                  });
                                  console.log("FB id",_id);
                                  setId(_id);
                                  setUrl(result);
                                  getImages();
                                  setIsInsertingProduct(false);
                                  setIsProcessing(false);
                                  setRightContent("default");
                                } catch (error) {
                                  setRightContent("error");
                                  console.log(error);
                                  setIsProcessing(false);
                                  setError(error.message);
                                }
                              }}
                              disabled={isInsertingProduct || isProcessing}
                            >
                              {isSetToProduct ? (
                                <div className="flex items-center gap-2 justify-center">
                                  <AiOutlineCheckCircle size={27} />{" "}
                                  <span>Klaar</span>
                                </div>
                              ) : isInsertingProduct ? (
                                loadingTexts[currentTextIndex]
                              ) : (
                                "Doorgaan"
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  case "error":
                    return (
                      <div className="text-center text-accent-500 custom-text prose flex h-full w-full max-w-none items-center justify-center text-3xl font-bold ">
                        {error}
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary-950 w-10/12 mx-auto flex flex-col md:flex-row mt-10">
        <div className="h-96 flex-1 flex justify-center items-center ">
          <div className="h-96 w-96 bg-gray-100 flex items-center justify-center">
            Image
          </div>
        </div>
        <div className="text-white prose max-w-none mt-10 md:mt-0 flex-1 px-5">
          <h1 className="text-white">SEO Titel 1</h1>
          <p>
            Welkom op onze website Crazy-Crazy.nl! Op deze website vind de
            mooiste creaties aan wanddecoratie. Hier vindt u alles wat u nodig
            heeft om uw muren te transformeren tot een prachtig kunstwerk. Of u
            nu op zoek bent naar een unieke schilderij, een prachtige print van
            een wild dier, of een abstracte muurdecoratie, u vindt het allemaal
            hier. Onze website biedt een uitgebreide collectie van hoogwaardige
            wanddecoraties in diverse stijlen, maten en materialen.{" "}
          </p>
          <p>
            We begrijpen dat elke klant uniek is en daarom bieden we een breed
            scala aan opties om aan uw specifieke smaak en stijl te voldoen.
          </p>
        </div>
      </div>
      <div className="bg-primary-950 w-10/12 mx-auto flex-col-reverse md:flex-row flex my-10">
        <div className="text-white prose max-w-none flex-1 px-5 mt-10 md:mt-0">
          <h1 className="text-white">SEO Titel 1</h1>
          <p>
            Welkom op onze website Crazy-Crazy.nl! Op deze website vind de
            mooiste creaties aan wanddecoratie. Hier vindt u alles wat u nodig
            heeft om uw muren te transformeren tot een prachtig kunstwerk. Of u
            nu op zoek bent naar een unieke schilderij, een prachtige print van
            een wild dier, of een abstracte muurdecoratie, u vindt het allemaal
            hier. Onze website biedt een uitgebreide collectie van hoogwaardige
            wanddecoraties in diverse stijlen, maten en materialen.{" "}
          </p>
          <p>
            We begrijpen dat elke klant uniek is en daarom bieden we een breed
            scala aan opties om aan uw specifieke smaak en stijl te voldoen.
          </p>
        </div>
        <div className="h-96 flex-1 flex justify-center items-center  ">
          <div className="h-96 w-96 bg-gray-100 flex items-center justify-center">
            Image
          </div>
        </div>
      </div>
    </div>
  );
};
