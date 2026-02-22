

## Fix: Aircraft Data Not Showing for Demo User

### Root Cause

The `aircraft` table has RLS policies that only allow access to users who belong to the same organization (`org_members` table). The demo user (`demo@avir.space`) is not listed in `org_members`, so all queries return 0 rows.

**Data exists:** 3+ aircraft records are in the database under org `a5c0dfe3-f136-4010-8870-8ea80cee7488`.

**Only member:** `laman@avir.space` is currently the only org member.

### Fix

Insert the demo user into `org_members` so RLS grants access:

```sql
INSERT INTO org_members (org_id, user_id, role)
VALUES (
  'a5c0dfe3-f136-4010-8870-8ea80cee7488',
  'af5b4446-27ca-4a7f-ab25-89b28530e7f3',
  'member'
);
```

This is a single data insert -- no schema changes, no code changes needed. Once the demo user is an org member, all aircraft data will appear immediately.

### What this affects

- Aircraft Management page will show all fleet data
- Any other org-scoped tables with similar RLS patterns will also become accessible to the demo user

