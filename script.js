document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const year = document.querySelector('[data-year]');
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('p');

if (year) year.textContent = new Date().getFullYear();

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 28);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('.work-card').forEach((card) => {
  card.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const galleryImage = card.querySelector('img');
    if (!galleryImage) return;
    lightboxImage.src = galleryImage.src;
    lightboxImage.alt = card.dataset.alt || '';
    lightboxCaption.textContent = card.dataset.caption || '';
    lightbox.showModal();
  });
});

document.querySelector('[data-lightbox-close]')?.addEventListener('click', () => lightbox?.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
