# Deployment Guide: How the Portfolio Hub Works

This document explains how the portfolio system builds and deploys your featured projects to live demo URLs.

## System Overview

The portfolio hub automatically:
1. **Discovers** your pinned GitHub repositories
2. **Builds** each project (if needed)
3. **Deploys** each project to its own subdirectory
4. **Updates** the main portfolio page with links to all projects

## How Projects Are Deployed

### Workflow Process

The deployment happens via the GitHub Actions workflow `.github/workflows/deploy-and-update.yml`:

#### Step 1: Update Projects (Job: `update-projects`)
- Fetches your pinned repositories using GitHub GraphQL API
- Downloads social preview thumbnails for each repository
- Updates `projects.json` with the latest repository information
- Commits changes back to the repository

#### Step 2: Build Projects (Job: `build-and-deploy-projects`)
- Clones each featured repository
- For **Node.js projects** (with `package.json`):
  - Runs `npm install`
  - Runs `npm run build` (or `npm run build:prod`)
  - Copies output from `dist/`, `build/`, or `public/` directory
- For **static projects** (HTML/CSS/JS):
  - Copies all `.html`, `.css`, `.js` files and `assets/` folder
- Deploys each project to `/dist/<project-name>/`
- Copies main site files to `/dist/`

#### Step 3: Deploy to GitHub Pages (Job: `deploy`)
- Uploads the entire `/dist/` folder as a Pages artifact
- GitHub Pages serves the site with this structure:
  - Root: `https://projects.brianwalker.dev/` → Main portfolio page
  - Project 1: `https://projects.brianwalker.dev/<project-name-1>/` → First project
  - Project 2: `https://projects.brianwalker.dev/<project-name-2>/` → Second project
  - etc.

### Example Structure

After deployment, the live site has this structure:

```
https://projects.brianwalker.dev/
├── index.html                              # Main portfolio hub
├── projects.json                           # Project metadata
├── assets/                                 # Main site assets
├── responsive-web-page-html-css/          # Project 1
│   ├── index.html
│   ├── css/
│   └── images/
├── frontend-web-application/              # Project 2
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── svgs/
└── game-show-web-app/                     # Project 3
    ├── index.html
    ├── css/
    └── js/
```

## How Live Demo URLs Are Configured

### Automatic Configuration

For repositories that are built and deployed by this workflow:

1. The workflow automatically creates a subdirectory for each project
2. The "Live Demo" link on the portfolio page points to: `/<project-name>/`
3. This resolves to: `https://projects.brianwalker.dev/<project-name>/`

### Custom Homepage URLs

If a repository already has its own hosting (e.g., deployed elsewhere), you can configure a custom URL:

1. Go to the repository on GitHub
2. Click **Settings** → **General**
3. Scroll to **Website** section
4. Enter the custom URL (e.g., `https://example.com/my-project`)
5. Save

The workflow will use this custom URL as the "Live Demo" link instead of building/deploying the project.

### Repository Homepage in `projects.json`

The `projects.json` file stores the homepage URL for each project:

```json
{
  "name": "my-project",
  "homepage": "https://brianwalkerdev.github.io/my-project/"
}
```

- If the repository has a custom Website URL in GitHub settings, that URL is used
- Otherwise, it defaults to `/<project-name>/` (deployed by this workflow)

## How to Verify Deployments

### Check Workflow Runs

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Look for "Deploy Portfolio and Update Projects" workflow
4. Click on the most recent run to see logs

### Check Build Logs

In the workflow run, check the `build-and-deploy-projects` job:
- Look for "Processing project: <project-name>"
- Verify the build succeeded (or was skipped for static projects)
- Check that files were copied to `/dist/<project-name>/`

### Test Live URLs

After deployment completes (usually 1-2 minutes):
- Main site: https://projects.brianwalker.dev/
- Each project: https://projects.brianwalker.dev/<project-name>/

## Troubleshooting

### Project Not Deploying

**Issue**: A project isn't appearing on the portfolio site.

**Solutions**:
1. Ensure the repository is **pinned** to your GitHub profile
2. Wait for the workflow to run (it runs weekly or on push to main)
3. Manually trigger the workflow from the Actions tab

### Build Failures

**Issue**: Workflow fails during project build.

**Solutions**:
1. Check the project has a valid `package.json` with a `build` script
2. Verify dependencies can be installed
3. Check build output directories (`dist/`, `build/`, or `public/`)
4. Review error logs in the workflow run

### 404 Errors on Project URLs

**Issue**: Project URL returns 404 Not Found.

**Solutions**:
1. Verify the project was successfully deployed (check workflow logs)
2. Ensure the project has an `index.html` file
3. Wait a few minutes for GitHub Pages cache to update
4. Check that the repository name matches the URL path

## Manual Deployment

To manually trigger a deployment:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Click "Deploy Portfolio and Update Projects" workflow
4. Click **Run workflow** button
5. Select the `main` branch
6. Click **Run workflow**

The workflow will:
- Fetch your latest pinned repositories
- Build all projects
- Deploy to GitHub Pages

Deployment typically takes 2-3 minutes to complete.

## Configuration Details

### Required GitHub Pages Settings

1. Repository Settings → Pages → Source: **GitHub Actions**
2. Custom domain: `projects.brianwalker.dev` (configured in `CNAME` file)

### Required Permissions

The workflow requires these permissions (configured in workflow file):
- `contents: write` - To commit `projects.json` updates
- `pages: write` - To deploy to GitHub Pages
- `id-token: write` - For Pages deployment authentication

### Workflow Triggers

The workflow runs:
- **On push** to the `main` branch
- **On schedule**: Weekly (Sundays at midnight UTC)
- **On manual trigger**: Via GitHub Actions UI

## Project Requirements for Deployment

### For Node.js Projects

Requirements:
- Must have `package.json` file
- Must have a `build` script defined
- Build output must be in `dist/`, `build/`, or `public/` directory
- All files must be static (HTML, CSS, JS, images)

Example `package.json`:
```json
{
  "name": "my-project",
  "scripts": {
    "build": "vite build"
  }
}
```

### For Static Projects

Requirements:
- Must have at least one `.html` file
- Can include `.css`, `.js` files
- Can have an `assets/` directory for images and other resources

The workflow will copy all relevant files to the deployment directory.

## Summary

Your portfolio hub is **fully functional** and automatically:
1. ✅ Fetches pinned repositories
2. ✅ Builds and deploys each project
3. ✅ Serves projects at `https://projects.brianwalker.dev/<project-name>/`
4. ✅ Updates weekly with latest changes

No additional configuration is needed for basic functionality. The system is working as designed according to the README specifications.
