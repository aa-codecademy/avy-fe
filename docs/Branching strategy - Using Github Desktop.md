# Branching strategy – Using GitHub Desktop

**Do this after** [The story](Branching%20strategy%20-%20The%20story.md). Step-by-step with GitHub Desktop.  
**If you get a conflict:** see [Resolving conflicts](Branching%20strategy%20-%20Resolving%20conflicts.md).

---

Follow this after reading The story. You'll clone the repo, create a feature branch from **main**, commit, push, and open a PR to **main**.

**Before you start:** Someone has created the repo. You'll work from **main** and create feature branches from it.

---

## What is GitHub Desktop?

GitHub Desktop is a desktop app that lets you use Git without memorizing commands like `git clone`, `git commit`, and `git push`. It gives you an easy UI to work with your project. Below you'll see how to use it for the main + feature-branch workflow.

---

## Step by step: from clone to pull request

Let's say someone has already created a repository on GitHub for you. First you need to clone it to your machine so you're connected to that repo. Then you'll use **main** and create a feature branch from it.

1. Start the GitHub Desktop app. You'll see the initial screen.
   (Screenshot: GitHub Desktop welcome / clone option.)

2. Choose to clone a repository (e.g. from GitHub.com or by URL). Pick the repo and the folder on your machine.
   (Screenshot: Clone repository dialog.)

3. After a few seconds, the repo is cloned and you see the repository screen.
   (Screenshot: Repository open in GitHub Desktop.)

4. Make sure you're on **main**. If not, click "Current Branch" and select **main**. You'll create your feature branch from main.
   (Screenshot: Switching to main branch.)

5. Create your feature branch so you can commit your changes without affecting other people's work. Click "Current Branch" → "New Branch".
   (Screenshot: New branch button.)

6. Choose to create a branch from **main**, type your branch name (e.g. `feature_homepage`), then click "Create Branch".
   (Screenshot: Create branch from main.)

7. You're now on your feature branch. Open VS Code (or your editor)—you can do this from GitHub Desktop.
   (Screenshot: Open in VS Code.)

8. Add or edit your files (HTML, CSS, JS, etc.). After saving, go back to GitHub Desktop; it will show your changes.
   (Screenshot: Changes detected.)

9. When you're ready to save a checkpoint, write a short commit message and click "Commit to [your-branch-name]". Then click "Push origin" to send your branch to GitHub.
   (Screenshot: Commit and push.)

10. Before opening a pull request, update your branch with the latest **main** (in case main changed). In GitHub Desktop: Branch → "Merge into current branch" and choose **main**. If there are no conflicts, the merge completes. If there are conflicts, resolve them (see [Resolving conflicts](Branching%20strategy%20-%20Resolving%20conflicts.md)), then push again.
    (Screenshot: Merge main into current branch.)

11. Open a pull request so your code can be merged into **main**. In GitHub Desktop, click "Create Pull Request". You'll be taken to GitHub in the browser.
    (Screenshot: Create pull request button.)

12. On GitHub, choose to open a PR **from your branch into main**. Add a title and description if needed, then create the pull request.
    (Screenshot: PR form – base: main, compare: your branch.)

If GitHub Desktop or GitHub reports conflicts when you merge or create the PR, follow [Resolving conflicts](Branching%20strategy%20-%20Resolving%20conflicts.md).

---

## You're done

These steps are your workflow for each new feature: clone (once), switch to **main**, create a feature branch from **main**, work, commit, push, update from **main** if needed, then create a pull request to **main**. Your mentor or team lead will review the PR and merge it into **main**. For the next feature, repeat from step 4 (make sure you're on **main**, then create a new feature branch).
