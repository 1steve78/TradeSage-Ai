import { searchStocks } from "./services/marketService.js";

const data = await searchStocks("apple");
console.log(data);

