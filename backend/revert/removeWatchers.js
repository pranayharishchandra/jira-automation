import jira from "../config/jiraClient";


const MY_ACCOUNT_ID = process.env.ASSIGNEE_ACCOUNT_ID;

/* ---------------- SAFETY GUARD ---------------- */

if (issueKeys.length > 60) {
  throw new Error("❌ Too many tickets. Aborting.");
}

/* ---------------- REMOVE WATCHER ---------------- */

async function removeMeAsWatcher(issueKey) {
  try {
    await jira.delete(
      `/rest/api/3/issue/${issueKey}/watchers`,
      {
        params: {
          accountId: MY_ACCOUNT_ID,
        },
      }
    );

    console.log(`👀 Removed you as watcher from ${issueKey}`);
  } catch (err) {
    // Jira returns 404 if you are not a watcher — that's fine
    if (err.response?.status === 404) {
      console.log(`⏭️ ${issueKey}: you were not a watcher`);
    } else {
      console.error(
        `❌ ${issueKey}:`,
        err.response?.data || err.message
      );
    }
  }
}

/* ---------------- RUN ---------------- */

async function run() {
  for (const key of issueKeys) {
    await removeMeAsWatcher(key);
  }
  console.log("\n🎯 Watcher cleanup completed");
}

run();
