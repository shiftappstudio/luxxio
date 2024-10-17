import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { createDocument } from "../services/firebase.services";

const CheckoutForm = ({
  price,
  productType,
  productSize,
  quantity,
  setStatus,
  userData,
  setId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    if (!stripe || !elements) {
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/create-payment-intent",
        {
          price: price,
          currency: "usd",
        }
      );

      const { clientSecret } = response.data;
      console.log(clientSecret);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );
      console.log("payment done ", error);
      if (error) {
        setError(`Payment failed: ${error.message}`);
        setIsProcessing(false);
      } else {
        setError(null);
        await createDocument("orders", {
          ...userData,
          productType,
          productSize,
          quantity,
        });
        setStatus(2);
        // wait for 3 seconds before setting status
        await new Promise((resolve) => setTimeout(resolve, 10000));
        setId(null);
        setError(null);
        setIsProcessing(false);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };
  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="w-full prose max-w-none">
      <h2 className="text-white">Your order details</h2>
      <div className="flex w-full justify-between text-white">
        <span>Type: </span>
        <span>{productType}</span>
      </div>
      <div className="flex w-full justify-between text-white">
        <span>Size: </span>
        <span>{productSize}</span>
      </div>
      <div className="flex w-full justify-between text-white">
        <span>Quantity: </span>
        <span>{quantity} x </span>
      </div>
      <div className="flex w-full justify-between text-white">
        <span>Total: </span>
        <span>{price} $</span>
      </div>
      <CardElement className="card-element mt-10" options={cardStyle} />
      {error}
      <button
        disabled={!stripe || isProcessing}
        className="bg-accent-600 font-bold py-1 px-2 w-full rounded-xl text-white"
      >
        {isProcessing ? (
          <BeatLoader color="#fee5f7" speedMultiplier={0.7} size={5} />
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
