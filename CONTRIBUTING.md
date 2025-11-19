# Contributing Guide

Thank you for your interest in contributing to this portfolio hub project!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/brianwalkerdev/projects.brianwalker.dev.git
   cd projects.brianwalker.dev
   ```

2. **Run locally**
   ```bash
   npm run dev
   # Opens at http://localhost:8080
   ```

## Project Architecture

### How It Works

The portfolio hub automatically:
1. **Discovers** your pinned GitHub repositories via GraphQL API
2. **Builds** each project (Node.js projects) or copies static files
3. **Deploys** all projects to GitHub Pages at `/<project-name>/`
4. **Updates** the main portfolio page with links to all projects

#### Workflow Process

The deployment happens via `.github/workflows/deploy-and-update.yml`:

**Step 1: Update Projects**
- Fetches pinned repositories using GitHub GraphQL API
- Downloads social preview thumbnails for each repository
- Updates `projects.json` with latest repository information
- Commits changes back to the repository

**Step 2: Build Projects**
- Clones each featured repository
- For **Node.js projects** (with `package.json`):
  - Runs `npm install`
  - Runs `npm run build`
  - Copies output from `dist/`, `build/`, or `public/` directory
- For **static projects** (HTML/CSS/JS):
  - Copies all `.html`, `.css`, `.js` files and `assets/` folder
- Deploys each project to `/dist/<project-name>/`
- Copies main site files to `/dist/`

**Step 3: Deploy to GitHub Pages**
- Uploads the entire `/dist/` folder as a Pages artifact
- GitHub Pages serves the site with this structure:
  - Root: `https://projects.brianwalker.dev/` → Main portfolio page
  - Projects: `https://projects.brianwalker.dev/<project-name>/` → Individual projects

> **Note:** The `/dist/` folder is a build artifact created during deployment and is not stored in the repository.

### Key Files

- `index.html` - Main portfolio page
- `projects.json` - Auto-generated project metadata (updated by workflow)
- `assets/css/style.css` - Styles with theme support
- `assets/js/main.js` - Dynamic functionality
- `build.js` - Build script for static compilation
- `.github/workflows/deploy-and-update.yml` - Automated deployment

### Workflow Schedule

- **Automatic:** Every Sunday at midnight UTC
- **Manual:** Trigger from Actions tab in GitHub

## Making Changes

### Adding New Features

1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Build with `npm run build` and verify dist/ output
5. Submit a pull request

### Modifying Themes

Edit `assets/css/style.css`:
- Theme colors are defined in CSS variables
- Add new themes in the `body[data-theme="..."]` sections

### Customizing the Workflow

Edit `.github/workflows/deploy-and-update.yml`:
- Modify the cron schedule for update frequency
- Adjust build commands for different project types
- Add filters for repository selection

## Requirements for Featured Repositories

### Pinning Repositories to Your Profile

Only repositories **pinned to your GitHub profile** will be featured on this portfolio site. To pin repositories:

1. Go to your GitHub profile page (https://github.com/your-username)
2. Click "Customize your pins"
3. Select up to 6 repositories to feature
4. Click "Save pins"

The workflow automatically fetches your pinned repositories using the GitHub GraphQL API.

### Setting Up Repository Thumbnails

Thumbnails are automatically pulled from your repository's **social preview image** (Open Graph image):

1. Go to your repository on GitHub
2. Click "Settings" → "General" → Scroll to "Social preview"
3. Click "Edit" and upload an image (recommended size: 1280×640px)
4. The workflow will automatically download this image

**Fallback**: If no custom social preview is set, the site uses a default gradient thumbnail.

### Repository Build Requirements

For repositories with live demos, ensure they:

1. **Build to static files** (HTML, CSS, JS)
2. **Output to standard directories**: `dist/`, `build/`, or `public/`
3. **Have a `package.json`** with a `build` script (for Node.js projects)

Example `package.json`:
```json
{
  "name": "my-project",
  "scripts": {
    "build": "vite build"
  }
}
```

### Live Demo URL Configuration

Each featured project can have its live demo configured in **three ways**:

#### Option 1: Automatic Deployment (Default) ⭐
- **No configuration needed**
- Project is automatically deployed to `/<project-name>/`
- Accessible at: `https://projects.brianwalker.dev/<project-name>/`
- **This is the recommended approach!**

#### Option 2: Custom Repository Homepage
- Go to repository Settings → General → Website
- Enter custom URL (e.g., `https://example.com/my-project`)
- The workflow will use this URL for the "Live Demo" button
- Project may or may not be deployed to this hub

#### Option 3: External Deployment Only
- Set the Website URL to an external deployment (Netlify, Vercel, etc.)
- The workflow won't deploy the project here
- Only shows a link to the external deployment

## Build System

The build script (`build.js`) creates a `dist/` folder with:
- All HTML, CSS, and JavaScript files
- Assets (images, fonts, etc.)
- Configuration files (CNAME, .nojekyll)

Run the build:
```bash
npm run build
```

> **Where are the built files?** The `dist/` folder is a build artifact created during GitHub Actions workflow and deployed to GitHub Pages. It is not stored in the repository (see `.gitignore`).

## Deployment

This project uses GitHub Pages with GitHub Actions for deployment:
- Main site: `https://projects.brianwalker.dev/`
- Projects: `https://projects.brianwalker.dev/<project-name>/`

### Custom Domain Setup

1. Add CNAME file with your domain
2. Configure DNS with CNAME record pointing to `<username>.github.io`
3. Enable HTTPS in repository settings

## Troubleshooting

### Projects Not Showing Up

**Issue**: My repository isn't appearing on the portfolio site.

**Solutions**:
- Ensure the repository is pinned to your GitHub profile
- Verify the workflow ran successfully (check Actions tab)
- Wait for the next scheduled update (Sundays at midnight UTC) or trigger manually
- Note: Forked or archived repositories can appear if they are pinned

### Thumbnails Not Loading

**Issue**: Repository thumbnail shows the default fallback image.

**Solutions**:
- Add a custom social preview image to your repository (Settings → Social preview)
- Ensure the image is publicly accessible
- Re-run the workflow after adding the image
- Check that the image URL is valid in `projects.json`

### Workflow Failures

**Issue**: The GitHub Actions workflow is failing.

**Solutions**:
- Check the Actions tab for error logs
- Ensure `GITHUB_TOKEN` has proper permissions
- Verify all dependencies are available
- For build failures, check individual project build requirements

### Empty projects.json

**Issue**: The `projects.json` file is empty or not updating.

**Solutions**:
- Verify you have pinned repositories on your GitHub profile
- Check that the GraphQL API query is successful in the workflow logs
- Ensure the workflow has permissions to commit changes
- Manually trigger the workflow from the Actions tab

## Questions?

Open an issue or discussion on GitHub for any questions or suggestions!
