UPDATE "user"
SET plan = 'lifetime'
WHERE email = 'arilebedev10@gmail.com'
  AND plan <> 'lifetime';
