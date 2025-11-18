# Local Build Guide

This document explains how to build the portfolio hub locally and understand where build files are located.

## Understanding the Build Process

### Where are the built files?

**The `/dist` folder is NOT stored in the repository.** It is a build artifact created during the GitHub Actions workflow and deployed to GitHub Pages. This is by design to keep the repository clean and avoid committing generated files.

### Build Artifacts Location

| Location | Purpose | Created By |
|----------|---------|------------|
| **Repository** | Source code only | Developers |
| **GitHub Actions Workflow** | Creates `/dist/` temporarily | Automated workflow |
| **GitHub Pages** | Serves the deployed site | GitHub Pages service |
| **Live Site** | https://projects.brianwalker.dev | End users access here |

## Where to Find Built Project Files

### Option 1: View Deployed Files on GitHub Pages (Recommended)

The built files are live and accessible at:

- **Main Portfolio**: https://projects.brianwalker.dev/
- **Project Demos**: https://projects.brianwalker.dev/<project-name>/

Examples:
- https://projects.brianwalker.dev/responsive-web-page-html-css/
- https://projects.brianwalker.dev/frontend-web-application/
- https://projects.brianwalker.dev/game-show-web-app/

### Option 2: View Workflow Artifacts

After a workflow run completes, you can download the build artifacts:

1. Go to the [Actions tab](https://github.com/brianwalkerdev/projects.brianwalker.dev/actions)
2. Click on a completed workflow run
3. Scroll to the "Artifacts" section
4. Download the `github-pages` artifact
5. Extract the ZIP file to see the complete `/dist/` folder structure

### Option 3: Build Locally

If you want to create the `/dist/` folder locally for testing:

#### Prerequisites

- Git
- Node.js 20+
- GitHub personal access token (for cloning private repos)

#### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/brianwalkerdev/projects.brianwalker.dev.git
   cd projects.brianwalker.dev
   ```

2. **Create the dist directory:**
   ```bash
   mkdir -p dist
   ```

3. **Copy main site files:**
   ```bash
   cp index.html dist/
   cp projects.json dist/
   cp -r assets dist/
   cp .nojekyll dist/
   ```

4. **Build each project (manual process):**
   ```bash
   # For each project in projects.json:
   
   # Example for a Node.js project:
   git clone https://github.com/brianwalkerdev/<project-name>.git /tmp/<project-name>
   cd /tmp/<project-name>
   npm install
   npm run build
   
   # Copy build output
   mkdir -p ../projects.brianwalker.dev/dist/<project-name>
   cp -r dist/* ../projects.brianwalker.dev/dist/<project-name>/
   # Or use 'build/' or 'public/' depending on the project
   ```

5. **Serve locally:**
   ```bash
   cd dist
   npx serve
   # Or use Python: python -m http.server 8000
   ```

6. **View in browser:**
   Open http://localhost:3000 (or the port shown by your server)

## Project Build Output Directories

Different projects use different build output directories:

| Build Tool | Output Directory | Example Projects |
|------------|------------------|------------------|
| Vite | `dist/` | Modern React/Vue apps |
| Create React App | `build/` | React applications |
| Next.js | `out/` or `.next/` | Next.js apps |
| Static HTML | Root directory | HTML/CSS/JS projects |

The workflow automatically checks for `dist/`, `build/`, and `public/` directories in that order.

## Why Isn't `/dist` in the Repository?

This is a **best practice** for modern web development:

### Benefits of Excluding Build Artifacts

1. **Smaller Repository**: Build files can be large and bloat the repository
2. **Cleaner History**: Avoid merge conflicts in generated files
3. **Reproducible Builds**: Anyone can rebuild from source
4. **Security**: Reduces risk of committing secrets in built files
5. **Automation**: CI/CD creates fresh builds for each deployment

### Files That Should NOT Be Committed

- `/dist/` - Build output
- `/build/` - Alternative build output
- `/tmp/` - Temporary files
- `node_modules/` - Dependencies
- `.DS_Store`, `Thumbs.db` - OS files
- IDE configuration files

These are listed in `.gitignore` to prevent accidental commits.

## Understanding the Workflow

The GitHub Actions workflow (`.github/workflows/deploy-and-update.yml`) does this automatically:

```
1. update-projects job:
   - Fetches pinned repositories
   - Updates projects.json
   - Commits changes

2. build-and-deploy-projects job:
   - Creates /dist/ directory (temporary)
   - Copies main site files to /dist/
   - For each project:
     * Clones the repository
     * Builds it (if Node.js project)
     * Copies to /dist/<project-name>/
   - Uploads /dist/ as artifact

3. deploy job:
   - Deploys /dist/ to GitHub Pages
   - Site becomes live at https://projects.brianwalker.dev
```

After deployment, the workflow **does not commit `/dist/` back to the repository**. The `/dist/` folder is deleted when the workflow job ends.

## Troubleshooting

### "I don't see /dist/ in my local repository"

✅ **This is correct!** The `/dist/` folder is not supposed to be in the repository. It's created during the GitHub Actions workflow and deployed to GitHub Pages.

### "How do I test my changes before deploying?"

For the main portfolio site:
1. Open `index.html` directly in a browser
2. Or use a local server: `npx serve` or `python -m http.server`

For individual projects:
1. Clone the project repository separately
2. Build and test it in its own directory
3. Once satisfied, pin it to your GitHub profile
4. The workflow will automatically include it in the next deployment

### "I want to see what files are deployed"

Three options:
1. **Browse the live site**: https://projects.brianwalker.dev/
2. **Download workflow artifacts**: Actions tab → Download artifact
3. **Build locally**: Follow the steps in "Option 3: Build Locally" above

### "Can I commit /dist/ to the repository?"

**Not recommended.** This goes against best practices:
- Makes the repository unnecessarily large
- Creates merge conflicts in generated files
- Duplicates what GitHub Pages already provides
- Defeats the purpose of automated builds

If you absolutely need it, you would need to:
1. Remove `/dist/` from `.gitignore`
2. Modify the workflow to commit the `/dist/` folder
3. Accept the drawbacks mentioned above

## Summary

- ✅ `/dist/` is created during GitHub Actions workflow
- ✅ `/dist/` is deployed to GitHub Pages automatically
- ✅ `/dist/` is NOT committed to the repository (by design)
- ✅ You can view deployed files at https://projects.brianwalker.dev/
- ✅ You can download workflow artifacts to inspect build output
- ✅ You can build locally for testing purposes

This architecture follows modern web development best practices and keeps the repository clean while ensuring reliable, automated deployments.
