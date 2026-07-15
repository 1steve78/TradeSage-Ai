import { generatePrices } from "./services/mockMarketService.js";

setInterval(() => {
    console.clear();
    console.table(generatePrices());
}, 1000);