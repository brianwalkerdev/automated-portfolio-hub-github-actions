# Brian Walker - Portfolio Hub

A dynamic portfolio website that automatically showcases my pinned GitHub repositories with live demos, theme customization, and responsive design.

![Portfolio Hub Screenshot](assets/img/project-thumbnail.png)

**🌐 Live Demo:** [https://projects.brianwalker.dev](https://projects.brianwalker.dev)

## ✨ Features

- **Auto-Syncing Projects** - Fetches and displays pinned GitHub repositories automatically
- **Live Project Demos** - Each project is deployed and accessible with one click
- **Theme Customization** - Switch between 5 accent colors (neutral, green, blue, purple, orange)
- **Dark/Light Mode** - Toggle between dark and light themes
- **Smart Search & Sort** - Filter projects by name or description, sort by date or alphabetically
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Image Lightbox** - Click project thumbnails for full-size preview
- **Weekly Auto-Updates** - GitHub Actions workflow refreshes projects every week

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Hosting:** GitHub Pages
- **Automation:** GitHub Actions (CI/CD)
- **API:** GitHub GraphQL API for pinned repositories

## 🚀 Installation & Usage

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/brianwalkerdev/projects.brianwalker.dev.git
   cd projects.brianwalker.dev
   ```

2. **Install dependencies (optional - only needed for build):**
   ```bash
   npm install
   ```

3. **Run locally:**
   - Simply open `index.html` in your browser, or
   - Use the dev server: `npm run dev` (opens at http://localhost:8080)

4. **Build for production:**
   ```bash
   npm run build
   ```
   - Static files are generated in the `dist/` folder

### Configuration

- **Add Project Thumbnails:** Place images in `assets/img/` named after your repository
- **Modify Workflow:** Edit `.github/workflows/deploy-and-update.yml` to customize automation
- **Update Projects:** GitHub Actions runs weekly, or trigger manually from the Actions tab

## 📦 Deployment

This project is designed for static hosting. Deploy to any of these platforms:

### GitHub Pages (Current Setup)
- Automatically deployed via GitHub Actions
- Custom domain configured: `projects.brianwalker.dev`
- Projects deployed to subdirectories: `/<project-name>/`

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### Vercel
```bash
npm run build
# Deploy the dist/ folder
```

### Other Static Hosts
Upload the contents of the `dist/` folder to any static hosting service.

## 📁 Project Structure

```
projects.brianwalker.dev/
├── index.html              # Main portfolio page
├── projects.json           # Auto-generated project metadata
├── assets/
│   ├── css/
│   │   └── style.css      # Styles with theme support
│   ├── js/
│   │   └── main.js        # Dynamic functionality
│   └── img/               # Project thumbnails
├── build.js               # Build script for static compilation
├── package.json           # Project metadata and scripts
└── .github/
    └── workflows/
        └── deploy-and-update.yml  # Automated deployment
```

> **Note:**  
> - `build.js` is the main build script that compiles project data and assets for deployment.  
> - `.github/workflows/deploy-and-update.yml` is a GitHub Actions workflow that automates building and deploying the site, as well as updating project data on a schedule.  
>  
> For more details on the build and deployment process, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 📚 Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Development setup, architecture guide, and contribution guidelines
- **[LICENSE](LICENSE)** - MIT License details and terms of use

## 👤 Contact

**Brian Walker**  
- **Portfolio:** [https://projects.brianwalker.dev](https://projects.brianwalker.dev)
- **GitHub:** [@brianwalkerdev](https://github.com/brianwalkerdev)
- **Email:** brianwalkerdev@users.noreply.github.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Feel free to use this as a template for your own portfolio!
