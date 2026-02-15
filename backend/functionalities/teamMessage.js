import axios from "axios";


async function sendToTeams(issue) {
    const message = {
        text: `🚨 New Jira Ticket
                    Title: ${issue.fields.summary}
                    Description: ${issue.fields.description}
                    Priority: ${issue.fields.priority?.name}
                    Link: ${process.env.JIRA_BASE_URL}/browse/${issue.key}`
        };

    await axios.post(process.env.TEAMS_WEBHOOK_URL, message);
}

async function processNewTickets() {
    const tickets = await getNewTickets();

    for (const ticket of tickets) {
        await sendToTeams(ticket);
    }
}
