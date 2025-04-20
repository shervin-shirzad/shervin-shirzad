const body = document.body;
const checkbox = document.querySelector('.theme-switch input');
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('nav a');

function applyTheme(isDark) {
  body.style.backgroundColor = isDark ? 'var(--bg-dark)' : 'var(--bg-light)';
  body.style.color = isDark ? 'var(--text-dark)' : 'var(--text-light)';
  header.style.backgroundColor = isDark ? 'var(--header-dark)' : 'var(--header-light)';
  navLinks.forEach(link => {
    link.style.color = link.classList.contains('active')
      ? (isDark ? 'var(--link-active-dark)' : 'var(--link-active-light)')
      : (isDark ? 'var(--link-inactive-dark)' : 'var(--link-inactive-light)');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(false);
  checkbox.checked = false;

  fetch('images.json')
    .then(res => res.json())
    .then(images => {
      const gallery = document.getElementById('gallery');

      images.forEach(img => {
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
        gallery.appendChild(item);
      });
    });
});

function toggleTheme(toggle) {
  applyTheme(toggle.checked);
}
