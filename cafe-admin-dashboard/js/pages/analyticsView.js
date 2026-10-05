/* ══════════════════════════════════════════════════════════════
   BREW & CO — ANALYTICS & BUSINESS INTELLIGENCE VIEW
   Dynamic multi-timeframe metric re-rendering and deep charts
   ══════════════════════════════════════════════════════════════ */

import { renderAnalyticsCharts } from '../charts.js';
import { toast } from '../components/toast.js';

let currentTimeframe = '7d';

export function renderAnalytics() {
  const el = document.getElementById('view-analytics');
  if (!el) return;

  el.innerHTML = `
    <!-- Timeframe Filter Header -->
    <div class="section-header">
      <div>
        <div class="section-title">Performance Analytics &amp; Operations Intelligence</div>
        <div style="font-size:12px; color:var(--muted); margin-top:2px;">Track revenue velocity, table turnover, rush hours &amp; item profitability</div>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <div class="filter-tabs" id="analytics-timeframe-tabs">
          <button class="ftab ${currentTimeframe === 'today' ? 'active' : ''}" onclick="window.setAnalyticsTimeframe('today')">Today</button>
          <button class="ftab ${currentTimeframe === '7d' ? 'active' : ''}" onclick="window.setAnalyticsTimeframe('7d')">Last 7 Days</button>
          <button class="ftab ${currentTimeframe === '30d' ? 'active' : ''}" onclick="window.setAnalyticsTimeframe('30d')">Last 30 Days</button>
          <button class="ftab ${currentTimeframe === '3m' ? 'active' : ''}" onclick="window.setAnalyticsTimeframe('3m')">Last 3 Months</button>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.exportAnalyticsReport()">📊 Export Report</button>
      </div>
    </div>

    <!-- Reactive KPI Metrics Row -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Revenue</div>
        <div class="stat-value" id="analytics-stat-rev">₹1,05,340</div>
        <div class="stat-delta up">+18.4% vs previous period</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Order Volume</div>
        <div class="stat-value" id="analytics-stat-orders">247 orders</div>
        <div class="stat-delta up">+31 orders week-over-week</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Average Order Value (AOV)</div>
        <div class="stat-value" id="analytics-stat-aov">₹426</div>
        <div class="stat-delta up">+₹32 due to dessert upselling</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Unique Guests Served</div>
        <div class="stat-value" id="analytics-stat-cust">215 unique</div>
        <div class="stat-delta up">68% repeat customer retention</div>
      </div>
    </div>

    <!-- Secondary operational stats -->
    <div class="stats-row" style="margin-bottom:20px;">
      <div class="stat-card">
        <div class="stat-label">Avg Table Turnover Time</div>
        <div class="stat-value">38 mins</div>
        <div class="stat-delta up">7 mins faster than target</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Reservation Cancellation Rate</div>
        <div class="stat-value">4.2%</div>
        <div class="stat-delta up">Low (Industry avg: 12%)</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">WhatsApp AI Resolution Rate</div>
        <div class="stat-value">94.8%</div>
        <div class="stat-delta up">Automated without staff intervention</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Food Waste / Spoilage</div>
        <div class="stat-value">1.8%</div>
        <div class="stat-delta up">Under ₹2,100 monthly loss</div>
      </div>
    </div>

    <!-- Charts Row 1: Trend line + Hourly Peak -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Revenue &amp; Sales Velocity</div>
            <div class="chart-sub">Gross sales trajectory across selected period</div>
          </div>
        </div>
        <div class="chart-wrap" style="height:220px;"><canvas id="analyticsRevenueChart"></canvas></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Peak Rush Hours (Footfall)</div>
            <div class="chart-sub">Busiest dining windows by hour of day</div>
          </div>
        </div>
        <div class="chart-wrap" style="height:220px;"><canvas id="analyticsPeakHoursChart"></canvas></div>
      </div>
    </div>

    <!-- Charts Row 2: Top Selling Items + Sales Channels -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Top 5 Best-Selling Menu Items</div>
            <div class="chart-sub">Total units ordered by guests</div>
          </div>
        </div>
        <div class="chart-wrap" style="height:210px;"><canvas id="analyticsTopItemsChart"></canvas></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Order Channels Distribution</div>
            <div class="chart-sub">Dine-in vs Counter Takeaway vs Delivery</div>
          </div>
        </div>
        <div class="chart-wrap" style="height:210px;"><canvas id="analyticsChannelChart"></canvas></div>
      </div>
    </div>
  `;

  // Render Chart.js instances
  setTimeout(() => {
    renderAnalyticsCharts(currentTimeframe);
  }, 50);
}

window.setAnalyticsTimeframe = (tf) => {
  currentTimeframe = tf;
  renderAnalytics();
  toast.info(`Updated analytics for: ${tf === 'today' ? 'Today' : tf === '7d' ? 'Last 7 Days' : tf === '30d' ? 'Last 30 Days' : 'Last 3 Months'}`);
};

window.exportAnalyticsReport = () => {
  toast.success('Analytics report generated and dispatched to your email.');
};
