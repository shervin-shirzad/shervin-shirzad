const body = document.body;
const checkbox = document.querySelector('.theme-switch input');
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('nav a');
const gallery = document.querySelector('.gallery');
const loadingIndicator = document.getElementById('loading-indicator');
const filters = document.querySelectorAll('.filter');

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
  item.className = `project ${img.category}`;

  const imageElement = document.createElement('img');
  imageElement.alt = img.title;
  imageElement.loading = 'lazy';

  const tempImg = new Image();
  tempImg.src = img.src;
  tempImg.onload = () => {
    imageElement.src = img.src;
    imageElement.classList.add('loaded');
  };

  const caption = document.createElement('div');
  caption.className = 'caption';

  const title = document.createElement('h2');
  title.textContent = img.title;

  const desc = document.createElement('p');
  desc.textContent = img.desc || '';

  caption.appendChild(title);
  caption.appendChild(desc);

  item.appendChild(imageElement);
  item.appendChild(caption);

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

function filterProjects(category) {
  const projects = document.querySelectorAll('.project');

  projects.forEach(p => {
    if (category === 'all' || p.classList.contains(category)) {
      p.classList.remove('hidden');
    } else {
      p.classList.add('hidden');
    }
  });
}

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter.active')?.classList.remove('active');
    btn.classList.add('active');
    const category = btn.dataset.rel;
    filterProjects(category);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(false);
  checkbox.checked = false;

  fetch('images.json')
    .then(res => res.json())
    .then(images => {
      allImages = images;
      loadNextBatch();
      window.addEventListener('scroll', handleScroll);
    });
});

function toggleTheme(toggle) {
  if (toggle.checked) {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  }

  applyTheme(toggle.checked);
}
