const dotenv = require("dotenv");
const express = require("express");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(express.json());



const jira = axios.create({
  baseURL: process.env.JIRA_BASE_URL,
  auth: {
    username: process.env.JIRA_EMAIL,
    password: process.env.JIRA_API_TOKEN,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

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
        accountId: process.env.ASSIGNEE_ACCOUNT_ID,
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
      "Thank you for raising the ticket. We have reviewed the initial details and will begin the assessment shortly. We will keep you updated on the progress and reach out if any further information is required. Please feel free to share any additional context or attachments that might help with the resolution."
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
processTicket("SD-246952");


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


/**
// IN QUEUE not working
curl -u "pranay.harishchandra@ibm.com:API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  https://brother-bie.atlassian.net/rest/api/3/issue/SD-246952/transitions \
  -d '{
    "transition": {
      "id": "202"
    }
  }'



// ASSIGNEE WORKING
  curl -u "pranay.harishchandra@ibm.com:API_KEY" \
  -X PUT \
  -H "Content-Type: application/json" \
  https://brother-bie.atlassian.net/rest/api/3/issue/SD-246952 \
  -d '{
    "fields": {
      "assignee": {
        "accountId": "712020:359d6420-a32d-45e4-ad64-d223dfe5923d"
      }
    }
  }'
 


// First response comment
curl -u "pranay.harishchandra@ibm.com:API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  https://brother-bie.atlassian.net/rest/api/3/issue/SD-246952/comment \
  -d '{
    "body": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Thank you for raising the ticket. We have reviewed the initial details and will begin the assessment shortly. We will keep you updated on the progress and reach out if any further information is required. Please feel free to share any additional context or attachments that might help with the resolution."
            }
          ]
        }
      ]
    },
    "properties": [
      {
        "key": "sd.public.comment",
        "value": {
          "internal": false
        }
      }
    ]
  }'



  // transations
  curl -u "pranay.harishchandra@ibm.com:API_KEY" \
https://brother-bie.atlassian.net/rest/api/3/issue/SD-246952/transitions


 */