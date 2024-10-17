import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import * as Yup from "yup";
import axios from "axios";
import { Loader } from "./loader/Loader";
import { CiCircleCheck } from "react-icons/ci";

const CanvasOrderForm = ({
  closeModal,
  total,
  image,
  productType,
  productSize,
  quantity,
  setId,
}) => {
  const [status, setStatus] = useState(0);
  const [customerData, setCustomerData] = useState({});
  const [secretKey, setSecretKey] = useState("");

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    additionalComments: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First Name is required")
      .min(2, "First Name is too short")
      .max(50, "First Name is too long"),
    lastName: Yup.string()
      .required("Last Name is required")
      .min(2, "Last Name is too short")
      .max(50, "Last Name is too long"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number can only contain numbers")
      .min(10, "Phone number is too short")
      .max(15, "Phone number is too long"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    province: Yup.string().required("Province is required"),
    postalCode: Yup.string()
      .required("Postal Code is required")
      .matches(
        /^[A-Za-z0-9]+$/,
        "Postal Code can only contain alphanumeric characters"
      )
      .min(5, "Postal Code is too short")
      .max(10, "Postal Code is too long"),
    additionalComments: Yup.string().max(
      500,
      "Additional comments are too long"
    ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setCustomerData(values);
    setStatus(-1);
    setSubmitting(false);
    if (!secretKey) {
      const response = await axios.post(
        // "http://localhost:3000/api/create-payment-intent",
        "https://printable-server-production.up.railway.app/api/create-payment-intent",
        {
          price: total,
          currency: "usd",
        }
      );
      setSecretKey(response.data.clientSecret);
    }
    setStatus(1);
  };

  const stripePromise = loadStripe(
    "pk_test_51O3NgPJnL8Msx7xxRhEsVj3d9hFCUe32nVjnfv1rc2ni4CzPCPRG4oD6J30rDHpNFkWew4VRvXe2FE2K5GFL4nEj00KCjgKR82"
  );

  return (
    <div className="w-full mx-auto rounded-3xl p-5 bg-primary-950 shadow-accent-700 border-2 border-accent-700 shadow-sm text-white h-fit">
      <div className="flex justify-end w-full">
        <button
          className="text-red-500"
          onClick={() => {
            closeModal(false);
          }}
        >
          <RxCrossCircled size={27} />
        </button>
      </div>
      {(() => {
        switch (status) {
          case -1:
            return (
              <div className="w-full h-full flex items-center justify-center">
                <Loader />
              </div>
            );
          case 0:
            return (
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
                {({ touched, errors, isSubmitting, isValid, dirty }) => (
                  <Form className="border-gray-700">
                    <div className="p-4">
                      <h2 className="text-white text-lg font-bold mb-4">
                        Canvas Bestelformulier
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label htmlFor="firstName" className="text-gray-300">
                            Voornaam <span className="text-red-500">*</span>
                          </label>
                          <Field
                            id="voornaam"
                            name="firstName"
                            type="text"
                            className="focus:outline-none focus:outline-accent-800 mt-2 bg-primary-950 border border-accent-800 text-white focus:outline-2 rounded px-3 py-2 w-full"
                            required
                          />
                          <div className="h-5 mt-2 text-red-500">
                            <ErrorMessage name="firstName" component="div" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="lastName" className="text-gray-300">
                            Achternaam <span className="text-red-500">*</span>
                          </label>
                          <Field
                            id="achternaam"
                            name="lastName"
                            type="text"
                            className="focus:outline-none focus:outline-accent-800 mt-2 bg-primary-950 border border-accent-800 text-white focus:outline-2 rounded px-3 py-2 w-full"
                            required
                          />
                          <div className="h-5 mt-2 text-red-500">
                            <ErrorMessage name="lastName" component="div" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="email" className="text-gray-300">
                            E-mail <span className="text-red-500">*</span>
                          </label>
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            className="focus:outline-none focus:outline-accent-800 mt-2 bg-primary-950 border border-accent-800 text-white focus:outline-2 rounded px-3 py-2 w-full"
                            required
                          />
                          <div className="h-5 mt-2 text-red-500">
                            <ErrorMessage name="email" component="div" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="phone" className="text-gray-300">
                            Telefoon <span className="text-red-500">*</span>
                          </label>
                          <Field
                            id="telefoon"
                            name="phone"
                            type="tel"
                            className="focus:outline-none focus:outline-accent-800 mt-2 bg-primary-950 border border-accent-800 text-white focus:outline-2 rounded px-3 py-2 w-full"
                            required
                          />
                          <div className="h-5 mt-2 text-red-500">
                            <ErrorMessage name="phone" component="div" />
                          </div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <label htmlFor="address" className="text-gray-300">
                          Bezorgadres <span className="text-red-500">*</span>
                        </label>
                        <Field
                          id="adres"
                          name="address"
                          type="text"
                          className="focus:outline-none focus:outline-accent-800 mt-2 bg-primary-950 border border-accent-800 text-white focus:outline-2 rounded px-3 py-2 w-full"
                          required
                        />
                        <div className="h-5 mt-2 text-red-500">
                          <ErrorMessage name="address" component="div" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <label htmlFor="city" className="text-gray-300">
                            Stad <span className="text-red-500">*</span>
                          </label>
                          <Field
                            id="stad"
                            name="city"
                            type="text"
                            className="focus:outline-none focus:outline-accent-800 mt-2 bg-primary-950 border border-accent-800 text-white focus:outline-2 rounded px-3 py-2 w-full"
                            required
                          />
                          <div className="h-5 mt-2 text-red-500">
                            <ErrorMessage name="city" component="div" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="province" className="text-gray-300">
                            Provincie <span className="text-red-500">*</span>
                          </label>
                          <Field
                            id="provincie"
                            name="province"
                            type="text"
                            className="focus:outline-none focus:outline-accent-800 mt-2 bg-primary-950 border border-accent-800 text-white focus:outline-2 rounded px-3 py-2 w-full"
                            required
                          />
                          <div className="h-5 mt-2 text-red-500">
                            <ErrorMessage name="province" component="div" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="postalCode" className="text-gray-300">
                            Postcode <span className="text-red-500">*</span>
                          </label>
                          <Field
                            id="postcode"
                            name="postalCode"
                            type="text"
                            className="focus:outline-none focus:outline-accent-800 mt-2 bg-primary-950 border border-accent-800 text-white focus:outline-2 rounded px-3 py-2 w-full"
                            required
                          />
                          <div className="h-5 mt-2 text-red-500">
                            <ErrorMessage name="postalCode" component="div" />
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="additionalComments"
                          className="text-gray-300"
                        >
                          Extra Opmerkingen
                        </label>
                        <Field
                          id="extraOpmerkingen"
                          name="additionalComments"
                          component="textarea"
                          rows={4}
                          className="focus:outline-none focus:outline-accent-800 mt-2 bg-primary-950 border border-accent-800 text-white focus:outline-2 rounded px-3 py-2 w-full"
                        />
                        <div className="h-5 mt-2 text-red-500">
                          <ErrorMessage
                            name="additionalComments"
                            component="div"
                          />
                        </div>
                      </div>
                      <div className="w-full flex justify-end">
                        <button
                          type="submit"
                          className={`${
                            isSubmitting || !(isValid && dirty)
                              ? "bg-accent-900"
                              : "bg-accent-600 hover:bg-accent-700"
                          } rounded-xl text-white px-6 py-2 font-bold focus:outline-none`}
                          disabled={isSubmitting || !(isValid && dirty)}
                        >
                          Bestelling Plaatsen {dirty ? "dirty" : "not dirty"}{" "}
                          {isValid ? "valid" : "not valid"}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            );
          case 1:
            return (
              <div className="w-full flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <img src={image} alt="" />
                </div>
                <div className="flex-1 pt-5">
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      price={total}
                      productType={productType}
                      productSize={productSize}
                      quantity={quantity}
                      setStatus={setStatus}
                      userData={customerData}
                      setId={setId}
                    />
                  </Elements>
                </div>
              </div>
            );
          case 2:
            return (
              <div className="flex flex-col items-center justify-center text-accent-600 prose max-w-none pb-10">
                <CiCircleCheck size={124} />
                <h2 className="text-accent-600 mt-2 text-center">
                  Product successfully purchased
                </h2>
              </div>
            );
          default:
            break;
        }
      })()}
    </div>
  );
};

export default CanvasOrderForm;
