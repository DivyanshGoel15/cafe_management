/**
 * Gallery Page View
 * Responsive filterable image grid with interactive Lightbox preview
 */
import { galleryService } from '../services/galleryService.js';

let activeGalleryCategory = 'all';

export async function renderGalleryPage() {
  const images = await galleryService.getGalleryImages(activeGalleryCategory);

  const categories = [
    { id: 'all', name: 'All Photography' },
    { id: 'coffee', name: 'Artisanal Coffee & Roastery' },
    { id: 'food', name: 'Sourdough & Culinary' },
    { id: 'ambience', name: 'Interiors & Courtyard' },
    { id: 'events', name: 'Jazz Evenings & Workshops' }
  ];

  return `
    <div style="background:var(--forest); color:#FFF; padding:60px 0 45px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Visual Chronicle</span>
        <h1 style="color:#FFF; margin-bottom:12px;">The Cafe Atmosphere</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:1.1rem;">
          Take a sensory tour through our coffee roasting station, hand-stretched pizzas, and sunlit courtyard moments.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <!-- Category Filter Pills -->
        <div style="display:flex; justify-content:center; margin-bottom:36px;">
          <div class="tab-list">
            ${categories.map(cat => `
              <button 
                class="tab-btn ${activeGalleryCategory === cat.id ? 'active' : ''}" 
                id="gallery-tab-${cat.id}"
                onclick="window.switchGalleryCategory('${cat.id}')"
              >
                ${cat.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Gallery Grid -->
        <div id="gallery-items-container">
          ${renderGalleryGrid(images)}
        </div>
      </div>
    </section>
  `;
}

function renderGalleryGrid(images) {
  return `
    <div class="gallery-grid">
      ${images.map(img => `
        <div class="gallery-card" onclick="window.openLightbox('${img.id}')" role="button" aria-label="Open photo: ${img.title}">
          <img src="${img.imageUrl}" alt="${img.title}" loading="lazy">
          <div class="gallery-overlay">
            <h4 class="gallery-title">${img.title}</h4>
            <p class="gallery-desc">${img.description}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

if (typeof window !== 'undefined') {
  window.switchGalleryCategory = async function(catId) {
    activeGalleryCategory = catId;
    const container = document.getElementById('gallery-items-container');
    if (!container) return;

    container.innerHTML = '<div style="text-align:center; padding:40px;"><div class="spinner spinner-copper"></div></div>';
    const images = await galleryService.getGalleryImages(catId);
    container.innerHTML = renderGalleryGrid(images);

    document.querySelectorAll('[id^="gallery-tab-"]').forEach(btn => {
      btn.classList.toggle('active', btn.id === `gallery-tab-${catId}`);
    });
  };
}
