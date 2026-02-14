import "dotenv/config";
import express from "express";
import jira from "./config/jiraClient.js";

import { processTicket } from "./functionalities/firstResponse.js";

const app = express();
app.use(express.json());



// ✅ Move outside so it persists across requests
let processedTickets = new Set();
// ✅ Move function outside too (cleaner)
async function getNewTickets() {

/*
JQL
    a) status
    1. In Queue 
    2. Waiting for Support
    3. Created in last 24 hours

    
    
*/
  const jql = `
    project = SD
    AND status = "Waiting for Support"
    AND created >= "2026-02-13"
    ORDER BY created DESC
  `;

  const { data } = await jira.get("/rest/api/3/search/jql", {
    params: {
      jql,
      fields: "key,created",
      maxResults: 50,
    },
  });

  return data.issues.map(issue => issue.key);
}


app.get("/", async (req, res) => {
    
  try {
    const newTickets = await getNewTickets();
    // Only add unprocessed tickets
    const newlyAdded = [];
    for (const issueKey of newTickets) {
      if (!processedTickets.has(issueKey)) {
        // await processTicket(issueKey); // ✅ Uncomment to enable
        processedTickets.add(issueKey);
        newlyAdded.push(issueKey); // Track new ones
      }
    }
    res.json({
      message: "Ticket Check Complete",
      totalFound: newTickets.length,
      newlyAdded: newlyAdded,
    //   totalProcessed: processedTickets.size,
    //   allProcessed: Array.from(processedTickets)
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});











// Run manually
// processTicket("SD-246952");


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


