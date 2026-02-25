import cron from "node-cron";
import { handleTickets } from "../automation/firstResponseAutomation.js";

export function startTicketCron() {
  
  // let the handletickets function run immediately on startup
  (async () => {
    console.log("🚀 Starting ticket cron: processing tickets immediately on startup") ;
    await handleTickets("ecds", { mutate: true });
  })();
  
  // Every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    console.log("⏰ Cron started: processing tickets" + new Date().toLocaleString());

    try {
      await handleTickets("ecds", { mutate: true });
      console.log("✅ Cron finished");
    } catch (err) {
      console.error("❌ Cron error:", err.message);
    }
  });
}
