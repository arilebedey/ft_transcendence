### If you your GitHub profile doesn't appear as a contributor in the repo

**Authentication when pushing:**

GitHub uses either:

- **SSH keys** (recommended) — collaborators add their public SSH key to their GitHub account
- **HTTPS with personal access token (PAT)** — less common now, but works

The email in commits is **not** used for authentication. It's only for attribution.

**For contributions to appear on their profile:**

The commit's author email must match an email on their GitHub account. This is separate from authentication:

1. **Their local git config must match:**

   ```bash
   git config user.email "their-email@example.com"
   git config user.name "Their Name"
   ```

2. **That email must be added to their GitHub account:**
   - Settings → Emails → Add email
   - It doesn't need to be their primary email, just verified

3. **Push with valid SSH key or PAT** — this grants permission

**Common issues:**

- Commit authored with wrong email → contribution won't link to their profile
- Email not added to their GitHub account → won't link even if it matches locally
- Using `git commit --author` with wrong email → same issue

**To verify it's working:**

After they push, check the commit on GitHub. Clicking their username should link to their profile. If it shows as "unknown user," the email doesn't match their GitHub account.

**Setup checklist for new collaborators:**

1. Add their SSH key to GitHub
2. Verify their email is added to their account
3. Have them set local git config with correct email
4. Test with first commit
