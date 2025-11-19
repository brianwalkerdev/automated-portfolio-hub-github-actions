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

1. **Project Discovery** - GitHub Actions fetches pinned repositories via GraphQL API
2. **Building** - Each project is built (Node.js) or copied (static HTML/CSS/JS)
3. **Deployment** - All projects deployed to GitHub Pages at `/<project-name>/`

### Key Files

- `index.html` - Main portfolio page
- `projects.json` - Auto-generated project metadata (updated by workflow)
- `assets/css/style.css` - Styles with theme support
- `assets/js/main.js` - Dynamic functionality
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

## Build System

The build script (`build.js`) creates a `dist/` folder with:
- All HTML, CSS, and JavaScript files
- Assets (images, fonts, etc.)
- Configuration files (CNAME, .nojekyll)

Run the build:
```bash
npm run build
```

## Deployment

This project uses GitHub Pages with GitHub Actions for deployment:
- Main site: `https://projects.brianwalker.dev/`
- Projects: `https://projects.brianwalker.dev/<project-name>/`

### Custom Domain Setup

1. Add CNAME file with your domain
2. Configure DNS with CNAME record pointing to `<username>.github.io`
3. Enable HTTPS in repository settings

## Questions?

Open an issue or discussion on GitHub for any questions or suggestions!
