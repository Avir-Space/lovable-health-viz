INSERT INTO org_members (org_id, user_id, role)
VALUES (
  'a5c0dfe3-f136-4010-8870-8ea80cee7488',
  'af5b4446-27ca-4a7f-ab25-89b28530e7f3',
  'member'
)
ON CONFLICT DO NOTHING;