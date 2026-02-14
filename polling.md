
```js
function startPolling() {
  console.log("⏳ Polling started...");

  setInterval(async () => {
    try {
      const newTickets = await getNewTickets();

      console.log("Found tickets:", newTickets);

      for (const issueKey of newTickets) {
        if (!processedTickets.has(issueKey)) {
          await processTicket(issueKey);
          processedTickets.add(issueKey);
        }
      }

    } catch (err) {
      console.error("Polling error:", err.response?.data || err.message);
    }
  }, process.env.POLL_INTERVAL || 60000); // Default to 1 minute
}

startPolling();
```
