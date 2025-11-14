// State Management
let projects = [];
let filteredProjects = [];
let currentTheme = localStorage.getItem('theme') || 'neutral';
let currentMode = localStorage.getItem('mode') || 'dark';
let currentSort = 'newest';

// DOM Elements
const projectsGrid = document.getElementById('projects-grid');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort-select');
const themeToggle = document.getElementById('theme-toggle');
const refreshBtn = document.getElementById('refresh-btn');
const themeBtns = document.querySelectorAll('.theme-btn');
const loading = document.getElementById('loading');
const noResults = document.getElementById('no-results');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadProjects();
    attachEventListeners();
});

// Initialize Theme
function initializeTheme() {
    // Set theme mode
    if (currentMode === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    }
    
    // Set accent theme
    document.body.setAttribute('data-theme', currentTheme);
    
    // Update active theme button
    themeBtns.forEach(btn => {
        if (btn.dataset.theme === currentTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Attach Event Listeners
function attachEventListeners() {
    // Search
    searchInput.addEventListener('input', handleSearch);
    
    // Sort
    sortSelect.addEventListener('change', handleSort);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleThemeMode);
    
    // Accent theme buttons
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => changeAccentTheme(btn.dataset.theme));
    });
    
    // Refresh button
    refreshBtn.addEventListener('click', refreshProjects);
}

// Load Projects
async function loadProjects() {
    try {
        loading.style.display = 'block';
        projectsGrid.innerHTML = '';
        noResults.style.display = 'none';
        
        // Try to load from projects.json first
        const response = await fetch('projects.json');
        
        if (response.ok) {
            projects = await response.json();
        } else {
            // Fallback to GitHub API if projects.json doesn't exist
            projects = await fetchFromGitHubAPI();
        }
        
        filteredProjects = [...projects];
        sortProjects();
        renderProjects();
        loading.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading projects:', error);
        loading.style.display = 'none';
        showToast('Failed to load projects from cache, trying GitHub API...', 'error');
        
        // Try GitHub API as fallback
        try {
            projects = await fetchFromGitHubAPI();
            filteredProjects = [...projects];
            sortProjects();
            renderProjects();
        } catch (apiError) {
            console.error('Error loading from GitHub API:', apiError);
        }
    }
}

// Fetch from GitHub API
async function fetchFromGitHubAPI() {
    const username = 'brianwalkerdev';
    
    // Note: GitHub doesn't have a public API for pinned repos, so we'll get all repos
    // and filter by a specific criterion (e.g., topics or custom flag)
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch from GitHub API');
    }
    
    const repos = await response.json();
    
    // Transform GitHub API response to our project format
    return repos
        .filter(repo => !repo.fork && !repo.archived) // Filter out forks and archived repos
        .slice(0, 10) // Limit to top 10 repos
        .map(repo => ({
            name: repo.name,
            description: repo.description || 'No description available',
            updated: repo.updated_at,
            url: repo.html_url,
            homepage: repo.homepage || `/${repo.name}/`,
            thumbnail: `assets/img/${repo.name}.png`
        }));
}

// Render Projects
function renderProjects() {
    projectsGrid.innerHTML = '';
    
    if (filteredProjects.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    filteredProjects.forEach(project => {
        const card = createProjectCard(project);
        projectsGrid.appendChild(card);
    });
}

// Create Project Card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const formattedDate = formatDate(project.updated);
    
    card.innerHTML = `
        <img 
            src="${project.thumbnail}" 
            alt="${project.name} thumbnail" 
            class="project-thumbnail"
            loading="lazy"
            onerror="this.src='assets/img/default-thumbnail.svg'"
        >
        <div class="project-content">
            <h3 class="project-title">${escapeHtml(project.name)}</h3>
            <p class="project-description">${escapeHtml(project.description)}</p>
            <p class="project-date">Updated: ${formattedDate}</p>
            <div class="project-links">
                <a href="${project.homepage}" class="project-link primary" target="_blank" rel="noopener noreferrer">
                    Live Demo
                </a>
                <a href="${project.url}" class="project-link secondary" target="_blank" rel="noopener noreferrer">
                    View Code
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Handle Search
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    
    filteredProjects = projects.filter(project => {
        return project.name.toLowerCase().includes(query) ||
               project.description.toLowerCase().includes(query);
    });
    
    renderProjects();
}

// Handle Sort
function handleSort(e) {
    currentSort = e.target.value;
    sortProjects();
    renderProjects();
}

// Sort Projects
function sortProjects() {
    if (currentSort === 'newest') {
        filteredProjects.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    } else if (currentSort === 'alphabetical') {
        filteredProjects.sort((a, b) => a.name.localeCompare(b.name));
    }
}

// Toggle Theme Mode (Dark/Light)
function toggleThemeMode() {
    if (currentMode === 'dark') {
        currentMode = 'light';
        document.body.classList.add('light-mode');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    } else {
        currentMode = 'dark';
        document.body.classList.remove('light-mode');
        themeToggle.querySelector('.theme-icon').textContent = '🌙';
    }
    
    localStorage.setItem('mode', currentMode);
}

// Change Accent Theme
function changeAccentTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update active button
    themeBtns.forEach(btn => {
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Refresh Projects
async function refreshProjects() {
    showToast('Refreshing projects...', 'info');
    
    try {
        // Force fetch from GitHub API
        projects = await fetchFromGitHubAPI();
        filteredProjects = [...projects];
        
        // Re-apply current sort
        sortProjects();
        
        // Re-apply search filter if active
        const searchQuery = searchInput.value;
        if (searchQuery) {
            filteredProjects = filteredProjects.filter(project => {
                return project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       project.description.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }
        
        renderProjects();
        showToast('Projects refreshed successfully!', 'success');
        
    } catch (error) {
        console.error('Error refreshing projects:', error);
        showToast('Failed to refresh projects', 'error');
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
