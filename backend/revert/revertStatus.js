import jira from "../config/jiraClient";


const MY_ACCOUNT_ID = process.env.ASSIGNEE_ACCOUNT_ID;

/* ---------------- SAFETY GUARD ---------------- */

if (issueKeys.length > 60) {
  throw new Error("❌ Too many tickets. Aborting.");
}

/* ---------------- HELPERS ---------------- */

async function getIssueWithChangelog(issueKey) {
  const { data } = await jira.get(
    `/rest/api/3/issue/${issueKey}`,
    { params: { expand: "changelog" } }
  );
  return data;
}

function findLastInQueueChangeByMe(changelog) {
  // Traverse newest → oldest
  for (let i = changelog.histories.length - 1; i >= 0; i--) {
    const history = changelog.histories[i];

    if (history.author.accountId !== MY_ACCOUNT_ID) continue;

    for (const item of history.items) {
      if (
        item.field === "status" &&
        item.toString === "In Queue"
      ) {
        return {
          previousStatus: item.fromString,
          created: history.created,
        };
      }
    }
  }
  return null;
}

async function moveBack(issueKey, previousStatusName) {
  const { data } = await jira.get(
    `/rest/api/3/issue/${issueKey}/transitions`
  );

  const transition = data.transitions.find(
    (t) => t.to.name === previousStatusName
  );

  if (!transition) {
    console.log(
      `⚠️ ${issueKey}: no transition back to "${previousStatusName}"`
    );
    return;
  }

  await jira.post(
    `/rest/api/3/issue/${issueKey}/transitions`,
    { transition: { id: transition.id } }
  );

  console.log(
    `↩️ ${issueKey}: reverted to "${previousStatusName}"`
  );
}

/* ---------------- MAIN LOGIC ---------------- */

async function revertStatusSafely(issueKey) {
  try {
    console.log(`\n🔍 Checking ${issueKey}`);

    const issue = await getIssueWithChangelog(issueKey);

    const currentStatus = issue.fields.status.name;

    if (currentStatus !== "In Queue") {
      console.log(
        `⏭️ ${issueKey}: status is "${currentStatus}", skipping`
      );
      return;
    }

    const statusChange =
      findLastInQueueChangeByMe(issue.changelog);

    if (!statusChange) {
      console.log(
        `⏭️ ${issueKey}: In Queue not set by you`
      );
      return;
    }

    console.log(
      `↩️ ${issueKey}: restoring status → "${statusChange.previousStatus}"`
    );

    await moveBack(issueKey, statusChange.previousStatus);

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
    await revertStatusSafely(key);
  }
  console.log("\n🎯 Status rollback completed safely");
}

run();

