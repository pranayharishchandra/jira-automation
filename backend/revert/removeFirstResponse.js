import jira from "../config/jiraClient";

const MY_ACCOUNT_ID = process.env.ASSIGNEE_ACCOUNT_ID;

/* ---------------- SAFETY GUARD ---------------- */

if (issueKeys.length > 60) {
  throw new Error("❌ Too many tickets. Aborting for safety.");
}

/* ---------------- DELETE MY AUTOMATION COMMENTS ---------------- */

async function deleteMyAutomationComments(issueKey) {
  const { data } = await jira.get(
    `/rest/api/3/issue/${issueKey}/comment`
  );

  const myComments = data.comments.filter((comment) => {
    const text =
      comment.body?.content?.[0]?.content?.[0]?.text || "";

    return (
      comment.author.accountId === MY_ACCOUNT_ID &&
      text.includes("Thank you for raising the ticket")
    );
  });

  for (const comment of myComments) {
    await jira.delete(
      `/rest/api/3/issue/${issueKey}/comment/${comment.id}`
    );
    console.log(`🗑 Deleted comment ${comment.id} on ${issueKey}`);
  }
}

/* ---------------- FIND PREVIOUS ASSIGNEE FROM CHANGELOG ---------------- */

async function getPreviousAssignee(issueKey) {
  const { data } = await jira.get(
    `/rest/api/3/issue/${issueKey}`,
    { params: { expand: "changelog" } }
  );

  const histories = data.changelog.histories;

  // Traverse from latest → oldest
  for (let i = histories.length - 1; i >= 0; i--) {
    const history = histories[i];

    for (const item of history.items) {
      if (
        item.field === "assignee" &&
        item.to === MY_ACCOUNT_ID
      ) {
        return item.from || null; // null = unassigned
      }
    }
  }

  return null;
}

/* ---------------- MOVE BACK TO WAITING FOR SUPPORT ---------------- */

async function moveBack(issueKey) {
  const { data } = await jira.get(
    `/rest/api/3/issue/${issueKey}/transitions`
  );

  const transition = data.transitions.find(
    (t) => t.to.name === "Waiting for Support"
  );

  if (!transition) {
    console.log(
      `⚠️ ${issueKey}: cannot move back (transition unavailable)`
    );
    return;
  }

  await jira.post(
    `/rest/api/3/issue/${issueKey}/transitions`,
    { transition: { id: transition.id } }
  );

  console.log(`↩️ ${issueKey} moved back`);
}

/* ---------------- RESTORE ASSIGNEE ---------------- */

async function restoreAssignee(issueKey, accountId) {
  await jira.put(`/rest/api/3/issue/${issueKey}`, {
    fields: {
      assignee: accountId
        ? { accountId }
        : null,
    },
  });

  console.log(
    accountId
      ? `👤 ${issueKey} reassigned to original owner`
      : `🔄 ${issueKey} left unassigned`
  );
}

/* ---------------- MAIN PROCESS ---------------- */

async function revertSafely(issueKey) {
  try {
    console.log(`\n🚀 Processing ${issueKey}`);

    await deleteMyAutomationComments(issueKey);

    const previousAssignee =
      await getPreviousAssignee(issueKey);

    await moveBack(issueKey);
    await restoreAssignee(issueKey, previousAssignee);

    console.log(`✅ ${issueKey} fully restored`);
  } catch (err) {
    console.error(
      `❌ Error on ${issueKey}:`,
      err.response?.data || err.message
    );
  }
}

/* ---------------- RUN ---------------- */

async function run() {
  for (const key of issueKeys) {
    await revertSafely(key);
  }

  console.log("\n🎯 Safe rollback completed");
}

run();


