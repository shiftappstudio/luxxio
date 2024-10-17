import { FormikSelect } from "../components/ReactSelect";
import { firestore } from "../configs/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { Formik, Form, Field } from "formik";
import { productData } from "./../helpers/woocommerce.helpers";
import { useEffect, useState } from "react";

import CanvasOrderForm from "./../components/CanvasOrderForm";

const Detail = ({ id, setId, url }) => {
  // const { id } = useParams();
  const [item, setItem] = useState(null);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      console.log(id);
      getItem(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getItem = async (/** @type {string} */ id) => {
    const docRef = doc(firestore, "images", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setItem(docSnap.data());
    }
  };
  const handleChange = (event, values) => {
    console.log(event.target);
    const { name, value } = event.target;
    values[name] = value;

    // setTotal(productData[value][selectedSize].price * value);
  };

  const [selectedType, setSelectedType] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  //
  useEffect(() => {
    setTotal(productData[selectedType][selectedSize].price);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canvasTypes = [
    { label: "Canvas", value: 0 },
    { label: "Aluminium", value: 1 },
    { label: "Plexiglas", value: 2 },
  ];

  const canvasSizes = [
    [
      { label: "30x30 2cm", value: 0 },
      { label: "30x30 4cm", value: 1 },
      { label: "50x50 2cm", value: 2 },
      { label: "50x50 4cm", value: 3 },
      { label: "70x70 2cm", value: 4 },
      { label: "70x70 4cm", value: 5 },
      { label: "100x100 2cm", value: 6 },
      { label: "100x100 4cm", value: 7 },
      { label: "140x140 2cm", value: 8 },
      { label: "140x140 4cm", value: 9 },
      { label: "30x20 2cm", value: 10 },
      { label: "30x20 4cm", value: 11 },
      { label: "60x40 2cm", value: 12 },
      { label: "60x40 4cm", value: 13 },
      { label: "90x60 2cm", value: 14 },
      { label: "90x60 4cm", value: 15 },
      { label: "120x80 2cm", value: 16 },
      { label: "120x80 4cm", value: 17 },
      { label: "180x120 2cm", value: 18 },
      { label: "180x120 4cm", value: 19 },
    ],
    [
      { label: "30x30", value: 0 },
      { label: "50x50", value: 1 },
      { label: "70x70", value: 2 },
      { label: "100x100", value: 3 },
      { label: "120x120", value: 4 },
      { label: "30x20", value: 5 },
      { label: "60x40", value: 6 },
      { label: "90x60", value: 7 },
      { label: "120x80", value: 8 },
      { label: "180x120", value: 9 },
    ],
    [
      { label: "30x30", value: 0 },
      { label: "50x50", value: 1 },
      { label: "70x70", value: 2 },
      { label: "100x100", value: 3 },
      { label: "120x120", value: 4 },
      { label: "30x20", value: 5 },
      { label: "60x40", value: 6 },
      { label: "90x60", value: 7 },
      { label: "120x80", value: 8 },
      { label: "180x120", value: 9 },
    ],
  ];
  const handleClose = () => {
    setId(null); // Set the id to null when the button is clicked
  };

  return (
    <>
      {showModal && (
        <div className="w-11/12 md:w-6/12 max-h-full overflow-y-scroll absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <CanvasOrderForm
            closeModal={setShowModal}
            total={total}
            image={item.image}
            productType={productData[selectedType][selectedSize].type}
            productSize={productData[selectedType][selectedSize].size}
            quantity={quantity}
            setId={setId}
          />
        </div>
      )}
      {item && (
        <div
          className={`flex flex-col items-center md:flex-row w-full lg:w-8/12 mx-auto ${
            showModal && "blur-lg"
          }`}
        >
          <div onClick={handleClose} className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700">X</div>
          <div className="flex-1">
            <img src={item.image} alt="" />
          </div>
          <div className="flex-1 pt-10">
            <Formik
              initialValues={{
                productType: 0,
                productSize: 0,
                quantity: 1,
              }}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  setShowModal(true);
                  setQuantity(values.quantity);
                } catch (error) {
                  console.log(error.message);
                }
              }}
            >
              {({ isSubmitting, values }) => (
                <Form className="md:pr-10 pb-10">
                  <div className="flex flex-col gap-8">
                    <div className="w-full">
                      <label htmlFor="" className="font-bold ml-1 text-white">
                        Product Soort <span className="text-accent-600">*</span>
                      </label>
                      <FormikSelect
                        name="productType"
                        options={canvasTypes}
                        placeholder=""
                        className="mt-3 w-full"
                        _onchange={(name, value) => {
                          setSelectedType(value);
                          setTotal(
                            productData[value][selectedSize].price *
                              values.quantity
                          );
                        }}
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="" className="font-bold ml-1 text-white">
                        Product afmeting{" "}
                        <span className="text-accent-500">*</span>
                      </label>
                      <FormikSelect
                        name="productSize"
                        options={canvasSizes[selectedType]}
                        placeholder=""
                        className="mt-3 w-full"
                        onChange={(event) => handleChange(event, values)}
                        _onchange={(name, value) => {
                          setSelectedSize(value);
                          setTotal(
                            productData[selectedType][value].price *
                              values.quantity
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="border-t-2 pt-2 text-lg text-white font-bold mt-5 border-white w-full flex justify-between">
                    <span>Price : </span>
                    <span>{total} $</span>
                  </div>
                  <button
                    className="mt-10 rounded-2xl px-6 py-2 bg-accent-500 text-white font-bold focus:outline-none"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Toevoegen aan winkelwagen
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default Detail;
