
import jira from "../config/jiraClient.js";

// const jira = axios.create({
//   baseURL: process.env.JIRA_BASE_URL,
//   auth: {
//     username: process.env.JIRA_EMAIL,
//     password: process.env.JIRA_API_TOKEN,
//   },
//   headers: {
//     "Content-Type": "application/json",
//   },
// });




// 1️⃣ Add Public Comment
async function addPublicComment(issueKey, message) {
  await jira.post(`/rest/api/3/issue/${issueKey}/comment`, {
    body: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: message,
            },
          ],
        },
      ],
    },
    properties: [
      {
        key: "sd.public.comment",
        value: {
          internal: false,
        },
      },
    ],
  });

  console.log("✅ Comment added");
}

// 2️⃣ Assign User
async function assignIssue(issueKey) {
  await jira.put(`/rest/api/3/issue/${issueKey}`, {
    fields: {
      assignee: {
        accountId: process.env.ASSIGNEE_ACCOUNT_ID_GNANA,
      },
    },
  });

  console.log("✅ Assignee updated");
}

// 3️⃣ Move to In Queue
async function moveToInQueue(issueKey) {
  const { data } = await jira.get(
    `/rest/api/3/issue/${issueKey}/transitions`
  );

  const transition = data.transitions.find(
    (t) => t.to.name === "In Queue"
  );

  if (!transition) {
    console.log("⚠️ Issue is already in 'In Queue' or transition not available.");
    return;
  }

  await jira.post(
    `/rest/api/3/issue/${issueKey}/transitions`,
    {
      transition: {
        id: transition.id,
      },
    }
  );

  console.log("✅ Status moved to In Queue");
}

// 4️⃣ Main Processor
async function processTicket(issueKey) {
  try {
    await addPublicComment(
      issueKey,
      `Thank you for raising the ticket. We have reviewed the initial details and will begin the assessment shortly. Will keep you updated on the progress and reach out if any further information is required.
Please feel free to share any additional context or attachments that might help with the resolution.`
    );

    await assignIssue(issueKey);

    await moveToInQueue(issueKey);

    console.log("🎉 Ticket processed successfully");
  } catch (err) {
    console.error(
      "❌ Error:",
      err.response?.data || err.message
    );
  }
}


// Run manually

export { processTicket };



