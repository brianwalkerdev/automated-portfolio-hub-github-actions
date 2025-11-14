# Brian Walker Portfolio Hub

A dynamic portfolio website that automatically showcases pinned GitHub repositories with live demos.

## 🌐 Live Site

[https://projects.brianwalker.dev](https://projects.brianwalker.dev)

## ✨ Features

- **Automatic Project Discovery**: Fetches and displays repositories from GitHub
- **Live Demos**: Each project is deployed and accessible at `/project-name/`
- **Dark/Light Mode**: Toggle between dark and light themes
- **Accent Color Themes**: Choose from 5 color themes (neutral, green, blue, purple, orange)
- **Search & Sort**: Filter projects by name/description and sort by date or alphabetically
- **Responsive Design**: Fully mobile-friendly layout
- **Auto-Refresh**: Weekly automatic updates via GitHub Actions
- **Toast Notifications**: User feedback for actions

## 📁 Project Structure

```
projects.brianwalker.dev/
├── index.html                          # Main portfolio page
├── projects.json                       # Auto-generated project list
├── assets/
│   ├── css/
│   │   └── style.css                   # Styles with theme support
│   ├── js/
│   │   └── main.js                     # Dynamic functionality
│   └── img/                            # Project thumbnails
└── .github/
    └── workflows/
        └── deploy-and-update.yml       # Deployment automation
```

## 🚀 How It Works

### 1. Project Discovery
- GitHub Actions runs weekly (or on push to main)
- Fetches latest repositories from GitHub API
- Updates `projects.json` with project metadata

### 2. Building Projects
- Each repository is cloned
- If it's a Node.js project, runs `npm install && npm run build`
- Copies build output to `/dist/<project-name>/`

### 3. Deployment
- All files are deployed to GitHub Pages
- Main site at root
- Each project at `/<project-name>/`

## 🎨 Customization

### Adding Project Thumbnails
Place images in `assets/img/` named after your repository:
```
assets/img/my-awesome-project.png
```

### Changing Themes
The site supports 5 accent color themes:
- Neutral (default)
- Green
- Blue
- Purple
- Orange

Users can switch themes using the color selector.

### Modifying the Workflow
Edit `.github/workflows/deploy-and-update.yml` to:
- Change update frequency (modify `cron` schedule)
- Adjust build commands for your projects
- Filter which repositories to include

## 🔧 Development

### Local Testing
Simply open `index.html` in a browser. The site will fetch projects from `projects.json` or fall back to the GitHub API.

### Manual Project Update
Run the workflow manually:
1. Go to Actions tab in GitHub
2. Select "Deploy Portfolio and Update Projects"
3. Click "Run workflow"

## 📝 Requirements for Project Repositories

For automatic deployment, each repository should:

1. **Build to static files** (HTML, CSS, JS)
2. **Output to standard directories**: `dist/`, `build/`, or `public/`
3. **Have a `package.json`** with a `build` script (for Node.js projects)

Example `package.json`:
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

## 🌍 Custom Domain Setup

### GitHub Pages Configuration
1. Go to repository Settings → Pages
2. Set source to "GitHub Actions"
3. Add custom domain: `projects.brianwalker.dev`

### DNS Configuration
Add a CNAME record:
```
CNAME  projects  →  brianwalkerdev.github.io
```

## 📊 SEO & Accessibility

- OpenGraph meta tags for social sharing
- Semantic HTML structure
- ARIA labels for interactive elements
- Lazy-loading images
- Responsive images with fallbacks
- Theme color meta tag

## 🤝 Contributing

This is a personal portfolio site, but suggestions are welcome! Open an issue to discuss potential improvements.

## 📄 License

MIT License - feel free to use this as a template for your own portfolio!

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Hosting**: GitHub Pages
- **Automation**: GitHub Actions
- **API**: GitHub REST API

---

Built with ❤️ by Brian Walker