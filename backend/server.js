import "dotenv/config";
import express from "express";
import ticketRouter from "./automation/firstResponseAutomation.js";

const app = express();
app.use(express.json());


app.use( ticketRouter);












// Run manually
// processTicket("SD-246952");


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


