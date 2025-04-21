const body = document.body;
const checkbox = document.querySelector('.theme-switch input');
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('nav a');
const gallery = document.querySelector('.gallery');
const loadingIndicator = document.getElementById('loading-indicator');

let allImages = [];
let currentIndex = 0;
const batchSize = 10;
let isLoading = false;

function applyTheme(isDark) {
  body.style.backgroundColor = isDark ? 'var(--bg-dark)' : 'var(--bg-light)';
  body.style.color = isDark ? 'var(--text-dark)' : 'var(--text-light)';
  header.style.backgroundColor = isDark ? 'var(--header-dark)' : 'var(--header-light)';
  navLinks.forEach(link => {
    link.style.color = '';
  });
  const footer = document.querySelector('footer');
  footer.style.backgroundColor = isDark ? 'var(--bg-dark)' : 'var(--bg-light)';
}

function createProjectElement(img) {
  const item = document.createElement('div');
  item.className = 'project';

  const imageElement = document.createElement('img');
  imageElement.alt = img.title;
  imageElement.loading = 'lazy';

  const tempImg = new Image();
  tempImg.src = img.src;
  tempImg.onload = () => {
    imageElement.src = img.src;
    imageElement.classList.add('loaded');
  };

  const title = document.createElement('h2');
  title.textContent = img.title;

  item.appendChild(imageElement);
  item.appendChild(title);

  return item;
}

function loadNextBatch() {
  if (isLoading || currentIndex >= allImages.length) return;

  isLoading = true;
  loadingIndicator.style.display = 'block';

  const nextBatch = allImages.slice(currentIndex, currentIndex + batchSize);

  nextBatch.forEach(img => {
    const project = createProjectElement(img);
    gallery.appendChild(project);
  });

  currentIndex += batchSize;
  isLoading = false;
  loadingIndicator.style.display = 'none';
}

function handleScroll() {
  const scrollThreshold = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (scrollThreshold && !isLoading) {
    loadNextBatch();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(false);
  checkbox.checked = false;

  fetch('images.json')
    .then(res => res.json())
    .then(images => {
      allImages = images;
      loadNextBatch(); // load first batch
      window.addEventListener('scroll', handleScroll);
    });
});

function toggleTheme(toggle) {
  // بررسی اینکه آیا تم روشن است یا تاریک
  if (toggle.checked) {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  }
  
  applyTheme(toggle.checked);
}

