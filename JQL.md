## JQL
### 1. status
```SQL
status =  'In Queue' 
status =  'Waiting for Support' 

```
<!-- ```JQL [-created]
```
```JQL [-created]
``` -->
### 2. created
```SQL
created >= -15m   -- Past 15 minutes
created >= -30m   -- Past 30 minutes

// Hours
created >= -1h    -- Past 1 hour
created >= -24h   -- Past 24 hours

// Days
created >= -1d    -- Past 1 day
created >= -7d    -- Past 7 days
created >= -30d   -- Past 30 days

// Weeks
created >= -1w    -- Past 1 week
created >= -2w    -- Past 2 weeks

// Specific date
created >= "2024-01-01"  -- From specific date
```


### 3. teams
```SQL
"Assigned Team" = "EU Central Data Support"
```