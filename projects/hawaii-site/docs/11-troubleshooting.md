# 11 — Troubleshooting log and engineering method

## Repeatable method

1. **Symptom:** describe the observed failure precisely.
2. **Hypothesis:** propose one likely cause.
3. **Test:** choose the smallest command or request that distinguishes possibilities.
4. **Result:** record the actual output, not what you expected.
5. **Fix and retest:** change one thing, then repeat the original test.
6. **Prevention:** document how to detect or avoid the issue next time.

## Case A — PUT endpoint missing after code edit

**Symptom:** the backend advertised `DELETE, OPTIONS` but not `PUT` for a memory endpoint. **Test:** inspect `/app/app.py` inside the `hawaii-api` container; the new route was missing. **Cause:** Python code had been edited on the host, but the image had not been rebuilt. **Fix:** `docker compose up -d --build --no-deps hawaii-api`. **Result:** PUT appeared among allowed methods. **Lesson:** inspect the running artifact, not only source files.

## Case B — live directory was not a Git repository

**Symptom:** `git status` in `~/docker/hawaii-site` returned `fatal: not a git repository`. **Test:** `git -C ~/home-lab status` showed a clean tracked repository. **Fix:** keep the live project and Git working copy distinct; sync only source files intentionally. **Lesson:** Git tracks the directory containing `.git` and its descendants, not every copy of a project.

## Case C — rsync changed ignore rules

**Symptom:** staged diff showed `.gitignore | 2 -`. **Test:** `git diff --cached -- projects/hawaii-site/.gitignore` showed that `image/` and `uploads/` had been removed. **Fix:** restore `.gitignore` from the prior commit and check status again. **Lesson:** review diffs before committing; protect sensitive paths even when using exclusion flags.

## Template for the next issue

```text
Date:
Symptom:
Expected behavior:
Actual behavior:
Hypothesis:
Command/request used to test:
Result:
Change made:
Retest result:
What I learned:
```

## Check yourself

1. Why is an error message more useful than saying only 'it doesn't work'?
2. Why should you test one hypothesis at a time?
3. How do you tell a source-code problem from a deployment problem?
