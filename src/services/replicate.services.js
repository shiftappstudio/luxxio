import axios from "axios";
//const host = "http://localhost:3000";
const host = "https://replicate-production.up.railway.app";
export const translatePrompt = async (prompt) => {
  const translatedPrompt = (
    await axios.post(host + "/api/translate", {
      prompt,
    })
  ).data.data;
  return translatedPrompt;
};

export const makeFirstRequest = async (
  /** @type {any} */ prompt,
  /** @type {any} */ image,
  /** @type {number} */ promptStrength,
  /** @type {{ width : number , height : number  }} */ resolution,
  /** @type {any} */ result,
  num_outputs = 1
) => {
  try {
    console.log(prompt);
    let data;
    const formData = new FormData();
    if (image) {
      formData.append("file", image);
      formData.append("prompt", prompt + " ,no frame, object centered");
      formData.append("width", resolution.width.toString() || "1024");
      formData.append("height", resolution.height.toString() || "1024");
      formData.append("num_outputs", "1");
      formData.append("prompt_strength", String(promptStrength));
      formData.append("num_inference_steps", "20");
      // console.log(image_url);
      const response = await axios.post(
        host + "/api/image-generator/any2image",
        formData
      );
      data = response.data;
    } else {
      if (result) {
        console.log("call with results ");
        const response = await axios.post(
          host + "/api/image-generator/image2image",
          {
            prompt: prompt,
            height: resolution.width || 1024,
            width: resolution.height || 1024,
            image: result,
          }
        );
        data = [response.data[0]];
      } else {
        console.log("call without results ");
        const response = await axios.post(host + "/api/images/prompt2image", {
          prompt: prompt,
          height: resolution.width || 1024,
          width: resolution.height || 1024,
          num_outputs: num_outputs,
          num_inference_steps: 4,
        });

        data = Object.values(response.data);
        console.log(data);
      }
    }
    return data;
  } catch (error) {
    // console.log(error);
    throw new Error(error.message);
  }
};

export const makeUpscaleRequest = async (
  /** @type {any} */ image,
  /** @type {number} */ scale
) => {
  try {
    const response = await axios.post(host + "/api/real-esrgan", {
      image: image,
      scale: scale,
    });
    return response.data;
  } catch (error) {
    // console.log(error);
    throw new Error(error.message);
  }
};
