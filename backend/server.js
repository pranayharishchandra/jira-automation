import "dotenv/config";
import express from "express";
import ticketRouter from "./automation/firstResponseAutomation.js";
import { startTicketCron } from "./jobs/ticketCron.js";

const app = express();
app.use(express.json());


app.use( ticketRouter);

startTicketCron();



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


