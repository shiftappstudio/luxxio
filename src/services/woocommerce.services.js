import axios from "axios";
import { generateVariation } from "./../helpers/woocommerce.helpers";

const baseUrl = "https://luxxio.nl/wp-json/wc/v3/";
const auth = {
  username: "ck_227f034e3a3b35c483f22fcf169e4f50bd9bc7c0",
  password: "cs_5d1e45706661317079be199a391a5ba177714478",
};
export const getNetProductId = async () => {
  const response = await axios.get(`${baseUrl}products`, {
    auth,
    params: {
      per_page: 1,
      order: "desc",
      orderby: "date",
    },
  });
  return (response.data[0].id - 1).toString().padStart(4, "0");
};
export const createProduct = async (
  /** @type {string} */ originalImageUrl,
  /** @type {string} */ framedImageUrl,
  /** @type {string} */ prompt
) => {
  const id = await getNetProductId();
  const data = {
    name: `Image-${id}`,
    type: "variable",
    regular_price: "3",
    description: prompt,
    short_description: prompt,
    categories: [
      {
        id: 1,
      },
    ],
    images: [
      {
        src: framedImageUrl,
      },
    ],
    attributes: [
      {
        id: 1,
        visible: true,
        variation: true,
        // options: ["Metal", "Canvas", "Glass"],
        options: ["Canvas"],
      },
      {
        id: 2,
        visible: true,
        variation: true,
        // options: ["100 cm x 100 cm", "200 cm x 200 cm"],
        options: ["200 cm x 200 cm"],
      },
    ],
    meta_data: [
      {
        key: "original_image_url",
        value: originalImageUrl,
      },
    ],
  };
  let start = new Date().getTime();
  const response = await axios.post(`${baseUrl}products`, data, {
    auth,
  });
  let end = new Date().getTime();
  let duration = end - start;
  console.log(`Product generated: ${duration} milliseconds`);

  const variations = generateVariation();
  const productId = response.data.id;

  variations.map((variation) => {
    try {
      axios.post(`${baseUrl}products/${productId}/variations`, variation, {
        auth,
      });
    } catch (error) {
      console.error(error);
    }
  });

  // Check product status
  const checkProductStatus = async (productId) => {
    const response = await axios.get(`${baseUrl}products/${productId}`, {
      auth,
    });
    return response.data.stock_status;
  };
  start = new Date().getTime();
  let stockStatus = await checkProductStatus(productId);
  const startTime = Date.now();
  const timeout = 10000; // 10 seconds
  while (stockStatus !== "instock" && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    stockStatus = await checkProductStatus(productId);
  }

  end = new Date().getTime();
  duration = end - start;
  console.log(`product availability : ${duration} milliseconds`);

  if (stockStatus !== "instock") {
    console.error("Product is still not in stock after timeout");
  }

  return response.data;
};
