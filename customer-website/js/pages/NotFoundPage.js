/**
 * 404 Not Found Page View
 */
export async function renderNotFoundPage() {
  return `
    <section class="section" style="padding:100px 0; text-align:center;">
      <div class="container" style="max-width:580px;">
        <div style="font-family:var(--font-serif); font-size:6rem; font-weight:800; color:var(--copper); line-height:1; margin-bottom:12px;">
          404
        </div>
        <h1 style="font-size:2rem; color:var(--forest); margin-bottom:14px;">
          Page Not Found
        </h1>
        <p style="color:var(--text-secondary); font-size:1.05rem; margin-bottom:32px; line-height:1.6;">
          It looks like the brew you're searching for hasn't been extracted yet. Let's guide you back to familiar flavors.
        </p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="#/" class="btn btn-primary">Return Home</a>
          <a href="#/menu" class="btn btn-outline">Explore Menu</a>
          <a href="#/reservations" class="btn btn-ghost">Book a Table</a>
        </div>
      </div>
    </section>
  `;
}
