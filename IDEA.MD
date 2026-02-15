### 1. Just use this, so you will get the new unsttended tickets (since "Waiting for Support")
and after that store them in an array and do `firstResponse.js` on them
```js
const jql = `
  project = SD
  AND status = "Waiting for Support"
  AND "Assigned Team" = "EU Central Data Support"
  AND created >= "2026-02-13"
  ORDER BY created DESC
`;
```



-----

# Sending notification to teams
🏗 If You Want It Even Better

You can:
Send Adaptive Cards (looks premium)
Add AI summary before sending
Filter by priority
Send to different Teams channel based on project