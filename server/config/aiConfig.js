import dotenv from "dotenv";
dotenv.config();

const aiConfig = {
  provider: "nvidia",

  baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",

  apiKey: process.env.NVIDIA_API_KEY,

  model: process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct",

  temperature: 0.3,

  maxTokens: 500,

  timeout: 30000,
};

export default aiConfig;