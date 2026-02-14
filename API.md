1. All tickets
```
/rest/api/3/search/jql
```




No.

That URL is **frontend UI**:

```
/jira/servicedesk/projects/SD/queues/custom/44
```

That is just Jira’s web interface.

Your backend does NOT need that.

What you need is the **JQL behind that queue**.

---

## 🧠 Important Concept

In **Jira Service Management**, queues are just saved JQL queries.

That queue `custom/44` = internally something like:

```sql
project = SD
AND status = "Waiting for Support"
AND "Assigned Team" = "EU Central Data Support"
```

So instead of using the frontend URL, you should:

### 👉 Open that Queue in Jira UI

Then click:

**Queue → Edit queue**

It will show you the exact JQL.

Copy that JQL.

Use that JQL directly in your backend.

---

## 🚀 Even Better (Pro Way)

You can fetch queue details via API:

```
GET /rest/servicedeskapi/servicedesk/{serviceDeskId}/queue
```

But honestly?

For your current level and use-case, just copy the JQL from the queue.

Much simpler.

---

## ⚠️ Why Frontend URL Is Useless

This part:

```
queues/custom/44
```

is just an internal queue ID for UI.

It does NOT help your API call.

Your backend only understands:

```
/rest/api/3/search/jql
```

with proper JQL.

---

## 🎯 What You Should Do Now

1. Go to that queue in Jira
2. Click Edit
3. Copy the JQL
4. Paste here

We’ll plug it into your backend correctly.

Stop guessing the JQL — use the exact one Jira is already using.
