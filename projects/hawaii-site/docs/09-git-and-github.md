# 09 — Git, GitHub, and the two-copy workflow

## Git vs. GitHub

**Git** tracks local file history. **GitHub** hosts remote Git repositories. A commit is a local snapshot; a push sends commits to a remote.

## Our actual workflow

- Live source: `~/docker/hawaii-site`.
- Git repository: `~/home-lab`, with project under `projects/hawaii-site`.
- We checked `git -C ~/home-lab status` and found a clean `main` branch.
- We copied code with `rsync`, excluding `.env`, images, uploads, caches, and backups.
- We inspected the staged changes and committed working CRUD as `bf6fc4a`.

## Commands explained

```bash
git -C ~/home-lab status --short     # inspect changed files
git -C ~/home-lab diff --cached --stat # summarize staged changes
git -C ~/home-lab add projects/hawaii-site/README.md # stage one file
git -C ~/home-lab commit -m 'Document learning journey' # create local snapshot
git -C ~/home-lab push origin main    # upload commits to GitHub
```

`-C` tells Git which directory to use. `--cached` examines the staging area. `origin` is the configured remote name; `main` is the branch.

## The .gitignore mistake

The live site's `.gitignore` had fewer rules than the Git copy. Copying it removed `image/` and `uploads/` from the staged version. We reviewed the diff and restored the original. **Takeaway:** a successful file transfer can still introduce unwanted changes.

`.gitignore` prevents *new untracked files* from being added by ordinary broad add operations; it does not remove files already tracked. Always inspect `git status` and staged diffs before committing or pushing.

## Check yourself

1. What is the difference between `git add`, `commit`, and `push`?
2. Why did we inspect `.gitignore` before committing?
3. Why is a GitHub code backup different from a database backup?
