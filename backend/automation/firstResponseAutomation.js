import jira from "../config/jiraClient.js";

import { processTicket } from "../functionalities/firstResponse.js";
import express from "express";
const router = express.Router();

async function getNewTickets(name) {

    const teams = { ecds: "EU Central Data Support" }
    const teamName = teams[name];


    const jql =
        (teamName) ?
            `
  project = SD
  AND status = "Waiting for Support"
  AND "Assigned Team" = "${teamName}"
  AND created >= "2026-02-13"
  ORDER BY created DESC
`:
            `
  project = SD
  AND status = "Waiting for Support"
  AND created >= "2026-02-13"
  ORDER BY created DESC
`

//     const jql =             `
//   project = SD
//   AND created >= "2026-02-13"
//   ORDER BY created DESC
// `
    const { data } = await jira.get("/rest/api/3/search/jql", {
        params: {
            jql,
            fields: "key,created",
            maxResults: 5,
        },
    });

    return data.issues.map(issue => issue.key);
}


router.get("/:teamName", async (req, res) => {
    const teamName = req.params.teamName;

    try {
        const newTickets = await getNewTickets(teamName); // "waiting for customer" tickets created in the last 10 minutes
        // Only add unprocessed tickets
        const newlyAdded = [];
        for (const issueKey of newTickets) {
            newlyAdded.push(issueKey);
            // processTicket(issueKey); // ✅ Uncomment to enable
        }
        res.json({
            message: "Ticket Check Complete",
            totalFound: newTickets.length,
            newlyAdded: newTickets,
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});


export default router;