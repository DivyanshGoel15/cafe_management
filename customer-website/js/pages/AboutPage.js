/**
 * About Page View
 * Cafe heritage, single-origin sourcing, sourdough baking philosophy, team and brand values
 */
import { CAFE_INFO, TEAM_MEMBERS } from '../data/cafeData.js';

export async function renderAboutPage() {
  return `
    <!-- Header -->
    <div style="background:var(--forest); color:#FFF; padding:60px 0 50px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Our Heritage &amp; Craft</span>
        <h1 style="color:#FFF; margin-bottom:14px;">The Cafe Aroma Story</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:640px; margin:0 auto; font-size:1.1rem;">
          Rooted in a passion for honest ingredients, artisanal roasting, and unhurried hospitality in New Delhi's Connaught Place since ${CAFE_INFO.foundedYear}.
        </p>
      </div>
    </div>

    <!-- Chapter 1: The Origin -->
    <section class="section">
      <div class="container">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:54px; align-items:center;">
          <div>
            <span class="section-tag">Chapter One</span>
            <h2 class="section-title">Born From a Love for True Craft</h2>
            <p style="margin-bottom:16px;">
              In 2018, amidst the bustling commercial energy of Connaught Place, we set out to build an intimate sanctuary for people who appreciate exceptional coffee and scratch cooking.
            </p>
            <p style="margin-bottom:16px;">
              We began with a single vintage copper-drum roaster and a dream: to celebrate India's magnificent single-estate coffees that were historically exported rather than cherished locally.
            </p>
            <p>
              Today, Cafe Aroma is a vibrant meeting ground for writers, founders, artists, and families who gather for the aromas of fresh sourdough bread baked at 6:00 AM and specialty pour overs poured with surgical precision.
            </p>
          </div>
          <div style="border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg);">
            <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80" alt="Manual coffee cupping and roasting" style="width:100%; height:420px; object-fit:cover;">
          </div>
        </div>
      </div>
    </section>

    <!-- Chapter 2: The Two Pillars -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Our Dual Passion</span>
          <h2 class="section-title">The Coffee &amp; The Kitchen</h2>
          <p class="section-subtitle">We don't cut corners. From farm soil to your cup and plate.</p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:36px;">
          <!-- Pillar 1: Coffee -->
          <div class="card" style="padding:36px; border-top:4px solid var(--copper);">
            <div style="font-size:2.4rem; margin-bottom:14px;">☕</div>
            <h3 style="font-size:1.4rem; margin-bottom:12px;">Specialty Coffee Philosophy</h3>
            <p style="margin-bottom:16px;">
              We partner exclusively with certified organic, shade-grown estates in the Western Ghats (Chikmagalur, Biligirirangana Hills, and Coorg).
            </p>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:0.92rem; color:var(--text-secondary);">
              <li>✓ <strong>Micro-Lot Roasting:</strong> Small 5kg batches roasted weekly on site for peak aromatic volatility.</li>
              <li>✓ <strong>Custom Mineral Water:</strong> Water remineralized to 130 TDS for optimal flavor clarity.</li>
              <li>✓ <strong>SCA Certified Baristas:</strong> Every pour over follows strict recipe ratios (1:16 at 93°C).</li>
            </ul>
          </div>

          <!-- Pillar 2: Kitchen -->
          <div class="card" style="padding:36px; border-top:4px solid var(--forest);">
            <div style="font-size:2.4rem; margin-bottom:14px;">🥖</div>
            <h3 style="font-size:1.4rem; margin-bottom:12px;">36-Hour Sourdough Mastery</h3>
            <p style="margin-bottom:16px;">
              Our bread and pizza dough are fermented for 36 hours using a wild sourdough starter lovingly nicknamed <em>"Mother Roma"</em>, nurtured since 2018.
            </p>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:0.92rem; color:var(--text-secondary);">
              <li>✓ <strong>Zero Commercial Yeast:</strong> Natural lactic acid breakdown creates an easily digestible, airy crumb.</li>
              <li>✓ <strong>San Marzano DOP Tomatoes:</strong> Sun-ripened tomatoes grown in rich volcanic soil for authentic sugo.</li>
              <li>✓ <strong>Farm Fresh Mozzarella:</strong> Artisanal buffalo fior di latte sourced locally from organic dairy farms.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Chapter 3: The Team -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Master Craftsmen</span>
          <h2 class="section-title">Meet the Culinary &amp; Coffee Team</h2>
          <p class="section-subtitle">The passionate artisans shaping your daily sensory experience.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:32px;">
          ${TEAM_MEMBERS.map(member => `
            <div class="card" style="padding:0; overflow:hidden; display:flex; flex-direction:column;">
              <div style="height:280px; overflow:hidden;">
                <img src="${member.image}" alt="${member.name}" style="width:100%; height:100%; object-fit:cover;">
              </div>
              <div style="padding:24px; flex:1; display:flex; flex-direction:column;">
                <h3 style="font-size:1.2rem; margin-bottom:4px;">${member.name}</h3>
                <span style="font-size:0.84rem; font-weight:600; color:var(--copper); text-transform:uppercase; margin-bottom:12px;">${member.role}</span>
                <p style="font-size:0.9rem; line-height:1.6; color:var(--text-secondary);">${member.bio}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Chapter 4: Core Brand Values -->
    <section class="section section-dark">
      <div class="container">
        <div class="section-header">
          <span class="section-tag" style="color:var(--copper-light);">Guiding Principles</span>
          <h2 class="section-title" style="color:#FFF;">What We Stand For</h2>
          <p class="section-subtitle" style="color:rgba(255,255,255,0.7);">Our commitment to our guests, our growers, and our craft.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:24px;">
          <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:28px;">
            <div style="font-size:2rem; margin-bottom:12px; color:var(--copper-light);">✨ Craftsmanship</div>
            <h4 style="color:#FFF; margin-bottom:8px;">Uncompromised Quality</h4>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.7);">Every espresso extraction is weighed to 0.1g, and every dough is hand-shaped with care.</p>
          </div>

          <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:28px;">
            <div style="font-size:2rem; margin-bottom:12px; color:var(--copper-light);">🤝 Community</div>
            <h4 style="color:#FFF; margin-bottom:8px;">Warm Inclusive Space</h4>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.7);">A welcoming community hub for quiet reading, remote work, live jazz, and long conversations.</p>
          </div>

          <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:28px;">
            <div style="font-size:2rem; margin-bottom:12px; color:var(--copper-light);">🌿 Sustainability</div>
            <h4 style="color:#FFF; margin-bottom:8px;">Direct &amp; Fair Trade</h4>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.7);">We pay our partner farm estates 35% above fair-trade market price to support regenerative agriculture.</p>
          </div>

          <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:28px;">
            <div style="font-size:2rem; margin-bottom:12px; color:var(--copper-light);">🧡 Hospitality</div>
            <h4 style="color:#FFF; margin-bottom:8px;">Heartfelt Warmth</h4>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.7);">We remember our regulars by name, their favorite brew ratios, and their table preferences.</p>
          </div>
        </div>

        <div style="text-align:center; margin-top:48px;">
          <a href="#/reservations" class="btn btn-primary btn-lg">
            Experience Cafe Aroma in Person &rarr;
          </a>
        </div>
      </div>
    </section>
  `;
}
