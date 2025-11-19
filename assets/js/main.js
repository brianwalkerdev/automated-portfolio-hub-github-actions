// State Management
let projects = [];
let filteredProjects = [];
let currentTheme = localStorage.getItem('theme') || 'green';
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
const imageOverlay = document.getElementById('image-overlay');
const overlayImage = document.getElementById('overlay-image');
const overlayClose = document.getElementById('overlay-close');

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
    
    // Image overlay
    overlayClose.addEventListener('click', closeImageOverlay);
    imageOverlay.addEventListener('click', (e) => {
        if (e.target === imageOverlay) {
            closeImageOverlay();
        }
    });
    
    // Keyboard support for overlay
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageOverlay.classList.contains('show')) {
            closeImageOverlay();
        }
    });
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
    
    // Use GitHub GraphQL API to fetch pinned repositories
    const query = `
        query {
            user(login: "${username}") {
                pinnedItems(first: 6, types: REPOSITORY) {
                    nodes {
                        ... on Repository {
                            name
                            description
                            updatedAt
                            url
                            homepageUrl
                            openGraphImageUrl
                            usesCustomOpenGraphImage
                        }
                    }
                }
            }
        }
    `;
    
    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch from GitHub GraphQL API');
    }
    
    const data = await response.json();
    
    // Check for errors in the GraphQL response
    if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        throw new Error('GraphQL query failed');
    }
    
    const pinnedRepos = data.data?.user?.pinnedItems?.nodes || [];
    
    // Transform GraphQL response to our project format
    return pinnedRepos.map(repo => ({
        name: repo.name,
        description: repo.description || 'No description available',
        updated: repo.updatedAt,
        url: repo.url,
        homepage: repo.homepageUrl || `/${repo.name}/`,
        thumbnail: `assets/img/${repo.name}.png`,
        openGraphImageUrl: repo.openGraphImageUrl,
        usesCustomOpenGraphImage: repo.usesCustomOpenGraphImage
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
    
    // Use openGraphImageUrl if available, otherwise fall back to local thumbnail
    const thumbnailSrc = project.openGraphImageUrl || project.thumbnail;
    
    // Use project homepage if set, otherwise default to /<project-name>/
    const homepage = project.homepage && project.homepage.trim() !== '' 
        ? project.homepage 
        : `/${project.name}/`;
    
    card.innerHTML = `
        <img 
            src="${thumbnailSrc}" 
            alt="${project.name} thumbnail" 
            class="project-thumbnail"
            loading="lazy"
            onerror="this.src='/assets/img/default-thumbnail.svg'"
        >
        <div class="project-content">
            <h3 class="project-title">${escapeHtml(project.name)}</h3>
            <p class="project-description">${escapeHtml(project.description)}</p>
            <p class="project-date">Updated: ${formattedDate}</p>
            <div class="project-links">
                <a href="${homepage}" class="project-link primary" target="_blank" rel="noopener noreferrer">
                    Live Demo
                </a>
                <a href="${project.url}" class="project-link secondary" target="_blank" rel="noopener noreferrer">
                    View Code
                </a>
            </div>
        </div>
    `;
    
    // Add click handler to thumbnail
    const thumbnail = card.querySelector('.project-thumbnail');
    thumbnail.addEventListener('click', () => openImageOverlay(thumbnailSrc, project.name));
    
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

// Open Image Overlay
function openImageOverlay(imageSrc, altText) {
    overlayImage.src = imageSrc;
    overlayImage.alt = `Full size: ${altText}`;
    imageOverlay.classList.add('show');
    imageOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Image Overlay
function closeImageOverlay() {
    imageOverlay.classList.remove('show');
    imageOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
}
