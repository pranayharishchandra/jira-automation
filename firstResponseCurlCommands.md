
```js
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
```


```js
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
 
```

```js
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
```


```js
  // transations
  curl -u "pranay.harishchandra@ibm.com:API_KEY" \
https://brother-bie.atlassian.net/rest/api/3/issue/SD-246952/transitions
```