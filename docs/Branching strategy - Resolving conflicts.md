# Resolving Merge Conflicts

**Use this when** a merge or a pull request shows conflicts and Git asks you to resolve them.  
**Concepts:** [The story](Branching%20strategy%20-%20The%20story.md) · **Steps in the app:** [Using GitHub Desktop](Branching%20strategy%20-%20Using%20Github%20Desktop.md)

**Quick path:** Using GitHub Desktop? Go to [Resolving with GitHub Desktop](#resolving-with-github-desktop) below.

---

## Part A – When conflicts happen

A **conflict** happens when two branches changed the same part of the same file. For example, you edited line 10 in `utils.js` on your feature branch, and someone else edited line 10 in `utils.js` on **main**. When you merge (or when you update your branch with main), Git doesn't know which version to keep, so it marks the file as conflicted and asks you to choose or combine the changes.

You'll see conflicts when:

- You merge **main** into your feature branch to get the latest changes, or
- You merge your feature branch into **main** (or create a pull request and main has changed since you branched).

Don't panic—resolving conflicts is normal. Work through each conflicted file, keep or combine the right code, then complete the merge.

---

## Part B – How to resolve conflicts

### Resolving with GitHub Desktop

1. When a conflict occurs, GitHub Desktop lists the files with conflicts.
2. Click each conflicted file. It opens in your editor with conflict markers.
3. Edit the file: remove the markers (`<<<<<<<`, `=======`, `>>>>>>>`) and keep or combine the correct code (see [Conflict example](#conflict-example-and-resolution) below).
4. Save the file. In GitHub Desktop, mark the file as resolved.
5. Repeat for any other conflicted files, then complete the merge in GitHub Desktop.

### Using VS Code

1. VS Code highlights conflicted files. Open each one.
2. You'll see options above the conflict block: **Accept Current Change**, **Accept Incoming Change**, **Accept Both Changes**. Choose the right one, or edit by hand.
3. Remove any remaining conflict markers and save.
4. Stage the resolved files (Source Control) and complete the merge.

### Using Git command line

1. Open the conflicted files. Look for conflict markers:

   ```text
   <<<<<<< HEAD
   Your changes (current branch)
   =======
   Their changes (e.g. main)
   >>>>>>> main
   ```

1. Edit the file: keep the correct code, combine if needed, and delete the lines with `<<<<<<<`, `=======`, `>>>>>>>`.
1. Save, then:

   ```bash
   git add path/to/resolved-file
   git commit -m "Resolve merge conflict in path/to/file"
   ```

---

## Conflict example and resolution

Same idea when merging your feature branch into **main**: if both sides changed the same lines, you'll see this pattern. Here's a concrete example.

### Scenario: Two people modify the same file

1. **Initial state** (main branch):

```javascript
function calculateTotal(items) {
    let total = 0;
    for (let item of items) {
        total += item.price;
    }
    return total;
}
```

1. **Person A's change** (in their feature branch):

```javascript
function calculateTotal(items) {
    let total = 0;
    for (let item of items) {
        total += item.price * (1 - item.discount); // Added discount
    }
    return total;
}
```

1. **Person B's change** (in main branch):

```javascript
function calculateTotal(items) {
    let total = 0;
    for (let item of items) {
        total += item.price;
    }
    return total.toFixed(2); // Added decimal places
}
```

1. **Conflict when merging**:

```javascript
function calculateTotal(items) {
    let total = 0;
    for (let item of items) {
<<<<<<< HEAD
        total += item.price * (1 - item.discount);  // Added discount
=======
        total += item.price;
>>>>>>> main
    }
    return total.toFixed(2);  // Added decimal places
}
```

1. **Resolved version** (combining both changes):

```javascript
function calculateTotal(items) {
    let total = 0;
    for (let item of items) {
        total += item.price * (1 - item.discount); // Added discount
    }
    return total.toFixed(2); // Added decimal places
}
```

---

## Recap: main and feature branches

We use **main** (stable code) and **feature branches** (one per task). For the full flow—why we branch, how to create a branch from main, and how to open a PR—see [The story](Branching%20strategy%20-%20The%20story.md).

**Branch naming:** Use short, descriptive names, e.g. `add-login-button`, `header-alignment`. Avoid vague names like `branch1` or `changes`.

**Typical workflow:**

- Create a feature branch from **main**, work and commit there.
- Update your branch with **main** when needed (pull/merge main into your branch); resolve conflicts if they appear.
- When done, merge your branch into **main** (or open a PR to main).

Diagrams below use **main** and a single feature branch:

```text
main:     A---B---C---D---E
                    \
feature:            F---G---H
```

When ready, merge the feature branch back to main:

```text
main:     A---B---C---D---E---M
                    \       /
feature:            F---G---H
```

---

## Step-by-step workflow (reference)

### 1. Starting a new feature

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Making changes

Make your code changes, then:

```bash
git add .
git commit -m "Description of your changes"
git push origin feature/your-feature-name
```

### 3. Keeping your branch updated with main

```bash
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main
```

Resolve any conflicts (see Part B above), then:

```bash
git push origin feature/your-feature-name
```

### 4. Merging back to main

```bash
git checkout main
git pull origin main
git merge feature/your-feature-name
git push origin main
```

---

## Best practices

1. Pull the latest **main** before starting new work.
2. Keep each branch focused on one feature or fix.
3. Commit often with clear messages.
4. Test before merging to main.
5. If you're unsure, ask for help.

---

## Common issues and solutions

1. **Can't push?** Commit all changes, pull first, and check permissions.
2. **Merge conflicts?** Normal. Work through each file; if unsure, ask a teammate or your instructor.
3. **Wrong branch?** Use `git checkout branch-name` to switch (commit or stash first).

Stuck? See [The story](Branching%20strategy%20-%20The%20story.md) and [Using GitHub Desktop](Branching%20strategy%20-%20Using%20Github%20Desktop.md).

---

## Useful links

- [Learn Git Branching](https://learngitbranching.js.org/)
