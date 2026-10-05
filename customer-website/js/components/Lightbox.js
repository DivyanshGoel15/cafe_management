/**
 * Lightbox Component
 * Interactive modal for viewing high-res gallery images with keyboard navigation
 */
import { GALLERY_ITEMS } from '../data/cafeData.js';

let currentIndex = 0;
let currentItems = [...GALLERY_ITEMS];

export function renderLightboxMarkup() {
  return `
    <div class="lightbox-overlay" id="lightbox-overlay" aria-hidden="true" role="dialog" aria-label="Photo Preview">
      <button class="lightbox-close-btn" id="lightbox-close" aria-label="Close Lightbox">&times;</button>
      <button class="lightbox-btn lightbox-prev" id="lightbox-prev" aria-label="Previous Image">&#10094;</button>
      <button class="lightbox-btn lightbox-next" id="lightbox-next" aria-label="Next Image">&#10095;</button>

      <div class="lightbox-img-wrap">
        <img src="" alt="" class="lightbox-img" id="lightbox-img">
      </div>

      <div class="lightbox-caption">
        <h4 id="lightbox-title">Image Title</h4>
        <p id="lightbox-desc">Image Description</p>
      </div>
    </div>
  `;
}

export function initLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('lightbox-title');
  const desc = document.getElementById('lightbox-desc');

  if (!overlay) return;

  function updateView() {
    const item = currentItems[currentIndex];
    if (!item) return;

    img.src = item.imageUrl;
    img.alt = item.title;
    title.textContent = item.title;
    desc.textContent = item.description;
  }

  function closeLightbox() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % currentItems.length;
    updateView();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    updateView();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  window.openLightbox = function(imageId, itemsContext = null) {
    if (itemsContext && Array.isArray(itemsContext)) {
      currentItems = itemsContext;
    } else {
      currentItems = [...GALLERY_ITEMS];
    }

    const idx = currentItems.findIndex(i => i.id === imageId);
    currentIndex = idx !== -1 ? idx : 0;

    updateView();
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
}
