import cron from "node-cron";
import { handleTickets } from "../automation/firstResponseAutomation.js";

export function startTicketCron() {
  // Every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    console.log("⏰ Cron started: processing tickets");

    try {
      await handleTickets("ecds", { mutate: true });
      console.log("✅ Cron finished");
    } catch (err) {
      console.error("❌ Cron error:", err.message);
    }
  });
}
