# How to Squash a Fix Commit into Its Parent

Starting point: two commits on top of main, where the second fixes mistakes in the first.

Goal: merge both into a single clean commit, keeping the first commit's message.

---

Step 1 — open the interactive rebase onto the last "good" commit:

```bash
git rebase -i <parent-of-first-commit>
```

Step 2 — in the editor, change the second commit's action to `fixup`:

```text
pick 23c15584 Feature commit
fixup 8693c2e Fix commit
```

Step 3 — save and close. If already pushed, force push:

```bash
git push --force-with-lease
```
