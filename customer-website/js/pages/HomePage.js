/**
 * Home Page View
 */
import { CAFE_INFO } from '../data/cafeData.js';
import { menuService } from '../services/menuService.js';
import { offersService } from '../services/offersService.js';
import { reviewsService } from '../services/reviewsService.js';
import { galleryService } from '../services/galleryService.js';
import { cafeService } from '../services/cafeService.js';
import { Toast } from '../components/Toast.js';

export async function renderHomePage() {
  const [categories, featuredItems, signatureDishes, offers, reviewStats, reviews, galleryPreview] = await Promise.all([
    menuService.getCategories(),
    menuService.getFeaturedItems(4),
    menuService.getSignatureDishes(3),
    offersService.getOffers(true),
    reviewsService.getReviewStats(),
    reviewsService.getReviews(),
    galleryService.getPreviewImages(6)
  ]);

  const status = cafeService.isOpenNow();
  const topReviews = reviews.slice(0, 3);
  const activeOffers = offers.slice(0, 3);

  return `
    <!-- 1. HERO SECTION -->
    <section class="hero-section" id="hero">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-badge-wrap">
            <span>✨</span>
            <span>Connaught Place • Open Daily</span>
          </div>

          <h1 class="hero-title">
            Crafted with passion, roasted to <span class="accent">perfection</span>.
          </h1>

          <p class="hero-description">
            Welcome to ${CAFE_INFO.name}. A sunlit botanical sanctuary where single-origin Indian coffees meet 36-hour slow fermented sourdough and warm hospitality.
          </p>

          <div class="hero-cta-group">
            <a href="#/menu" class="btn btn-primary btn-lg" id="btn-hero-menu">
              <span>Explore Our Menu</span>
              <span>&rarr;</span>
            </a>
            <a href="#/reservations" class="btn btn-outline-copper btn-lg" id="btn-hero-book" style="color:#FFF; border-color:var(--copper-light);">
              <span>Reserve a Table</span>
            </a>
          </div>

          <!-- Hero Highlights Bar -->
          <div class="hero-stats-row">
            <div class="hero-stat-item">
              <span class="hero-stat-val">4.9 ★</span>
              <span class="hero-stat-label">520+ Reviews</span>
            </div>
            <div class="hero-stat-item">
              <span class="hero-stat-val">36 Hrs</span>
              <span class="hero-stat-label">Wild Sourdough</span>
            </div>
            <div class="hero-stat-item">
              <span class="hero-stat-val">100%</span>
              <span class="hero-stat-label">Single Origin</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-image-frame">
            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85" alt="Cafe Aroma Ambience and Coffee" loading="eager">
          </div>
          <div class="hero-floating-card">
            <div class="hero-floating-icon">☕</div>
            <div>
              <div class="hero-floating-title">Specialty Pour Over</div>
              <div class="hero-floating-desc">Single-origin Chikmagalur Estate V60</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. LIVE STATUS STRIP -->
    <div style="background:var(--forest-dark); border-bottom:1px solid rgba(255,255,255,0.08); padding:14px 0; color:#FFF; font-size:0.9rem;">
      <div class="container" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="status-dot ${status.isOpen ? 'open' : 'closed'}"></span>
          <strong>${status.statusText}:</strong>
          <span style="color:rgba(255,255,255,0.8);">${status.nextOpenText} (Today's Hours: ${status.hoursToday})</span>
        </div>
        <div style="display:flex; gap:18px; font-size:0.85rem;">
          <span>📍 12 Heritage Lane, CP</span>
          <span>📞 <a href="tel:${CAFE_INFO.contact.phone}" style="color:var(--copper-light);">${CAFE_INFO.contact.phoneDisplay}</a></span>
        </div>
      </div>
    </div>

    <!-- 3. CAFE INTRODUCTION & WHY CHOOSE US -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Our Philosophy</span>
          <h2 class="section-title">An Unhurried Coffee &amp; Culinary Haven</h2>
          <p class="section-subtitle">
            Founded in 2018, Cafe Aroma was envisioned as an antidote to frantic city life. A warm, aesthetic retreat where honest ingredients take center stage.
          </p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:24px; margin-bottom:48px;">
          <div class="card card-hover" style="border-top:3px solid var(--copper);">
            <div style="font-size:2rem; margin-bottom:12px;">🌱</div>
            <h3 style="font-size:1.25rem; margin-bottom:8px;">Farm-Direct Sourcing</h3>
            <p style="font-size:0.92rem;">Direct shade-grown Arabica beans from Chikmagalur estates and organic dairy delivered every morning.</p>
          </div>
          <div class="card card-hover" style="border-top:3px solid var(--copper);">
            <div style="font-size:2rem; margin-bottom:12px;">🥖</div>
            <h3 style="font-size:1.25rem; margin-bottom:8px;">36-Hour Sourdough</h3>
            <p style="font-size:0.92rem;">Naturally leavened daily at 6:00 AM with zero commercial yeast, creating crispy, gut-friendly crusts.</p>
          </div>
          <div class="card card-hover" style="border-top:3px solid var(--copper);">
            <div style="font-size:2rem; margin-bottom:12px;">🌿</div>
            <h3 style="font-size:1.25rem; margin-bottom:8px;">Botanical Courtyard</h3>
            <p style="font-size:0.92rem;">A pet-friendly sunlit glasshouse patio surrounded by tropical ferns, fresh rosemary, and natural breeze.</p>
          </div>
          <div class="card card-hover" style="border-top:3px solid var(--copper);">
            <div style="font-size:2rem; margin-bottom:12px;">⚡</div>
            <h3 style="font-size:1.25rem; margin-bottom:8px;">Remote Work Haven</h3>
            <p style="font-size:0.92rem;">Ergonomic walnut desks, 300Mbps fiber internet, and ample power outlets at every indoor station.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. CATEGORIES SHOWCASE -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Menu Categories</span>
          <h2 class="section-title">What Are You Craving Today?</h2>
          <p class="section-subtitle">From sunrise pour overs to midnight wood-fired sourdough pizzas.</p>
        </div>

        <div class="categories-grid">
          ${categories.filter(c => c.id !== 'all').map(cat => `
            <a href="#/menu?category=${cat.id}" class="category-card" id="cat-card-${cat.id}">
              <div class="category-icon-box">
                ${getCategoryEmoji(cat.id)}
              </div>
              <h3 class="category-title">${cat.shortName || cat.name}</h3>
              <span class="category-count">${cat.count} handcrafted items</span>
            </a>
          `).join('')}
        </div>

        <div style="text-align:center; margin-top:36px;">
          <a href="#/menu" class="btn btn-outline">
            Browse Complete Interactive Menu &rarr;
          </a>
        </div>
      </div>
    </section>

    <!-- 5. SIGNATURE DISHES SPOTLIGHT -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Chef's Masterpieces</span>
          <h2 class="section-title">Signature Tasting Spotlight</h2>
          <p class="section-subtitle">Dishes crafted with rare technique and celebrated by our regulars.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:32px;">
          ${signatureDishes.map(item => `
            <div class="card card-hover" style="overflow:hidden; padding:0; display:flex; flex-direction:column;">
              <div style="height:230px; position:relative; overflow:hidden;">
                <img src="${item.imageUrl}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">
                <span class="badge badge-gold" style="position:absolute; top:14px; left:14px;">Signature Choice</span>
                <span class="badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}" style="position:absolute; top:14px; right:14px;">${item.isVeg ? 'Veg' : 'Non-Veg'}</span>
              </div>
              <div style="padding:24px; flex:1; display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                  <h3 style="font-size:1.25rem;">${item.name}</h3>
                  <span style="font-family:var(--font-serif); font-size:1.3rem; font-weight:700; color:var(--copper);">${CAFE_INFO.currency}${item.price}</span>
                </div>
                <p style="font-size:0.9rem; margin-bottom:18px; flex:1;">${item.description}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.8rem; color:var(--text-muted);">⏱️ ${item.prepTime} • ★ ${item.rating}</span>
                  <button class="btn btn-primary btn-sm" onclick="window.openItemModal('${item.id}')">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 6. FEATURED BESTSELLERS -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Guest Favorites</span>
          <h2 class="section-title">Most Loved Creations</h2>
          <p class="section-subtitle">Tried, tested, and ordered on repeat by Delhi's coffee connoisseurs.</p>
        </div>

        <div class="menu-grid">
          ${featuredItems.map(item => `
            <div class="menu-item-card" id="featured-${item.id}">
              <div class="menu-item-image-wrap">
                <img src="${item.imageUrl}" alt="${item.name}" loading="lazy">
                <div class="menu-item-badges">
                  <span class="badge badge-copper">Bestseller</span>
                  <span class="badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}">${item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                </div>
              </div>
              <div class="menu-item-body">
                <div class="menu-item-header">
                  <h3 class="menu-item-name">${item.name}</h3>
                  <span class="menu-item-price">${CAFE_INFO.currency}${item.price}</span>
                </div>
                <p class="menu-item-desc">${item.description}</p>
                <div class="menu-item-meta">
                  <span>⏱️ ${item.prepTime}</span>
                  <span>🔥 ${item.calories}</span>
                  <span>★ ${item.rating} (${item.reviewsCount})</span>
                </div>
                <div class="menu-item-footer">
                  <button class="btn btn-outline btn-sm" onclick="window.openItemModal('${item.id}')">
                    Customise &amp; Info
                  </button>
                  <a href="#/reservations?item=${encodeURIComponent(item.name)}" class="btn btn-primary btn-sm">
                    Taste in Cafe
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 7. CURRENT OFFERS PREVIEW -->
    <section class="section section-dark">
      <div class="container">
        <div class="section-header">
          <span class="section-tag" style="color:var(--copper-light);">Special Perks</span>
          <h2 class="section-title" style="color:#FFF;">Exclusive Seasonal Offers</h2>
          <p class="section-subtitle" style="color:rgba(255,255,255,0.7);">Save on your morning brew, group brunches, and celebratory dinners.</p>
        </div>

        <div class="offers-grid">
          ${activeOffers.map(offer => `
            <div class="offer-card" style="background:${offer.bgGradient};">
              <div>
                <span class="offer-badge">${offer.badge}</span>
                <h3 class="offer-title">${offer.title}</h3>
                <div class="offer-discount">${offer.discountDisplay}</div>
                <p class="offer-desc">${offer.description}</p>
              </div>

              <div>
                <div class="offer-voucher-box">
                  <div>
                    <span style="font-size:0.75rem; text-transform:uppercase; color:rgba(255,255,255,0.6); display:block;">Coupon Code</span>
                    <span class="offer-code">${offer.code}</span>
                  </div>
                  <button class="btn btn-sm btn-outline-copper" style="color:#FFF; border-color:rgba(255,255,255,0.4);" onclick="window.copyHomeOfferCode('${offer.code}')">
                    Copy Code
                  </button>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="offer-validity">Valid: ${offer.validDays}</span>
                  <a href="#/reservations?code=${offer.code}" class="btn btn-sm btn-primary">
                    Book with Offer &rarr;
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align:center; margin-top:36px;">
          <a href="#/offers" class="btn btn-outline-copper" style="color:#FFF; border-color:rgba(255,255,255,0.4);">
            View All Active Offers &rarr;
          </a>
        </div>
      </div>
    </section>

    <!-- 8. CAFE EXPERIENCE STORYTELLING -->
    <section class="section">
      <div class="container">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:54px; align-items:center;">
          <div style="border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg);">
            <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80" alt="The Coffee Bar" style="width:100%; height:440px; object-fit:cover;">
          </div>
          <div>
            <span class="section-tag">The Experience</span>
            <h2 class="section-title">The Art of the Slow Pour</h2>
            <p style="margin-bottom:18px;">
              Every cup of coffee at Cafe Aroma begins with relationships. We source directly from third-generation estate planters in Karnataka, testing moisture levels, bean density, and roast profiles on our custom copper drum roaster.
            </p>
            <p style="margin-bottom:24px;">
              Whether you are settling in with a book, meeting a creative collaborator, or escaping the Delhi summer heat under our misted patio, our team is dedicated to making you feel genuinely at home.
            </p>
            <div style="display:flex; gap:16px;">
              <a href="#/about" class="btn btn-outline">Read Our Full Story</a>
              <a href="#/gallery" class="btn btn-ghost">View Photo Gallery &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. PHOTO GALLERY PREVIEW -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Visual Moments</span>
          <h2 class="section-title">Moments at Cafe Aroma</h2>
          <p class="section-subtitle">A glimpse into our sunlit corners, artisanal bakes, and vibrant community.</p>
        </div>

        <div class="gallery-grid">
          ${galleryPreview.map(img => `
            <div class="gallery-card" onclick="window.openLightbox('${img.id}')">
              <img src="${img.imageUrl}" alt="${img.title}" loading="lazy">
              <div class="gallery-overlay">
                <h4 class="gallery-title">${img.title}</h4>
                <p class="gallery-desc">${img.description}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align:center; margin-top:36px;">
          <a href="#/gallery" class="btn btn-outline">
            Open Full Gallery (16+ Photos) &rarr;
          </a>
        </div>
      </div>
    </section>

    <!-- 10. CUSTOMER REVIEWS & RATING CARD -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Guest Love</span>
          <h2 class="section-title">Stories From Our Community</h2>
          <p class="section-subtitle">Real experiences from our daily guests and coffee lovers.</p>
        </div>

        <div class="reviews-summary-card">
          <div class="rating-big-box">
            <div class="rating-big-num">${reviewStats.average}</div>
            <div class="star-rating" style="margin:8px 0; font-size:1.3rem;">★★★★★</div>
            <div style="font-weight:600; color:var(--forest);">Overall Guest Rating</div>
            <div style="font-size:0.85rem; color:var(--text-muted);">${reviewStats.count}+ Verified Experiences</div>
          </div>

          <div>
            <div class="rating-bar-row">
              <span style="width:50px;">5 Star</span>
              <div class="rating-bar-track">
                <div class="rating-bar-fill" style="width:${reviewStats.breakdown[5]}%;"></div>
              </div>
              <span style="width:40px; text-align:right; font-weight:600;">${reviewStats.breakdown[5]}%</span>
            </div>
            <div class="rating-bar-row">
              <span style="width:50px;">4 Star</span>
              <div class="rating-bar-track">
                <div class="rating-bar-fill" style="width:${reviewStats.breakdown[4]}%;"></div>
              </div>
              <span style="width:40px; text-align:right; font-weight:600;">${reviewStats.breakdown[4]}%</span>
            </div>
            <div class="rating-bar-row">
              <span style="width:50px;">3 Star</span>
              <div class="rating-bar-track">
                <div class="rating-bar-fill" style="width:${reviewStats.breakdown[3]}%;"></div>
              </div>
              <span style="width:40px; text-align:right; font-weight:600;">${reviewStats.breakdown[3]}%</span>
            </div>
          </div>
        </div>

        <div class="reviews-grid">
          ${topReviews.map(r => `
            <div class="review-card">
              <div>
                <div class="review-header">
                  <div class="review-avatar">${r.avatar}</div>
                  <div>
                    <div class="review-author-name">${r.author}</div>
                    <div class="review-meta">${r.location} • ${r.date}</div>
                  </div>
                </div>
                <div class="star-rating" style="margin-bottom:8px;">
                  ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
                </div>
                <h4 style="font-size:1.05rem; margin-bottom:6px; color:var(--forest);">${r.title || 'Exceptional experience'}</h4>
                <p class="review-body">"${r.review}"</p>
              </div>

              ${r.favoriteItem ? `
                <div style="margin-top:12px;">
                  <span class="review-fav-item">❤️ Loves: ${r.favoriteItem}</span>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 11. LOCATION & RESERVATION CTA -->
    <section class="section section-dark" style="background:linear-gradient(135deg, var(--forest-dark) 0%, var(--forest) 100%);">
      <div class="container" style="text-align:center; max-width:760px;">
        <span class="section-tag" style="color:var(--copper-light);">Reserve Your Moment</span>
        <h2 class="section-title" style="color:#FFF;">Planning a Date, Brunch or Celebration?</h2>
        <p style="font-size:1.1rem; color:rgba(255,255,255,0.8); margin-bottom:36px; line-height:1.6;">
          Tables during peak weekend hours fill quickly. Book your table in less than 60 seconds with instant table confirmation and zero reservation fees.
        </p>
        <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
          <a href="#/reservations" class="btn btn-primary btn-lg" id="btn-cta-reserve">
            <span>Book a Table Online Now</span>
            <span>&rarr;</span>
          </a>
          <a href="#/contact" class="btn btn-outline-copper btn-lg" style="color:#FFF; border-color:rgba(255,255,255,0.4);">
            <span>Find Us on Map</span>
          </a>
        </div>
      </div>
    </section>
  `;
}

function getCategoryEmoji(catId) {
  switch (catId) {
    case 'cat_starters': return '🍟';
    case 'cat_mains': return '🍲';
    case 'cat_pizza_pasta': return '🍕';
    case 'cat_beverages': return '☕';
    case 'cat_desserts': return '🍰';
    default: return '✨';
  }
}

// Global coupon copy helper
if (typeof window !== 'undefined') {
  window.copyHomeOfferCode = function(code) {
    navigator.clipboard?.writeText(code)
      .then(() => Toast.show(`Coupon code "${code}" copied! Use when booking.`, 'success'))
      .catch(() => Toast.show(`Coupon: ${code}`, 'info'));
  };
}
