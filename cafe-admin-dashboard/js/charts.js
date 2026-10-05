/* ══════════════════════════════════════════════════════════════
   BREW & CO — CHART.JS WRAPPER & VISUALIZATION MANAGER
   Maintains aesthetic parity with the reference design
   ══════════════════════════════════════════════════════════════ */

const ACCENT = '#B87333';
const GREEN = '#2E7D55';
const RED = '#C0392B';
const BLUE = '#2563EB';
const YELLOW = '#B8860B';

let chartInstances = {};

export function destroyChart(chartId) {
  if (chartInstances[chartId]) {
    chartInstances[chartId].destroy();
    delete chartInstances[chartId];
  }
}

export function initDashboardCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not yet loaded');
    return;
  }

  Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = '#6B6966';
  Chart.defaults.plugins.legend.display = false;

  // 1. Dashboard Revenue Line Chart
  const elRev = document.getElementById('chartRevenue');
  if (elRev) {
    destroyChart('chartRevenue');
    chartInstances['chartRevenue'] = new Chart(elRev, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Revenue (₹)',
          data: [11200, 13400, 12800, 15600, 14200, 19800, 18340],
          borderColor: ACCENT,
          borderWidth: 2.2,
          backgroundColor: 'rgba(184, 115, 51, 0.08)',
          fill: true,
          tension: 0.38,
          pointRadius: 3.5,
          pointBackgroundColor: ACCENT
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => '₹' + v / 1000 + 'k', font: { size: 10 } } }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => '₹' + ctx.raw.toLocaleString('en-IN')
            }
          }
        }
      }
    });
  }

  // 2. Dashboard Category Doughnut Chart
  const elCat = document.getElementById('chartCategory');
  if (elCat) {
    destroyChart('chartCategory');
    chartInstances['chartCategory'] = new Chart(elCat, {
      type: 'doughnut',
      data: {
        labels: ['Coffee', 'Food & Snacks', 'Desserts', 'Beverages'],
        datasets: [{
          data: [42, 30, 16, 12],
          backgroundColor: [ACCENT, GREEN, BLUE, YELLOW],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { boxWidth: 10, padding: 8, font: { size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw}% of orders`
            }
          }
        }
      }
    });
  }

  // 3. Dashboard Weekly Bookings Bar
  const elBook = document.getElementById('chartBookings');
  if (elBook) {
    destroyChart('chartBookings');
    chartInstances['chartBookings'] = new Chart(elBook, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Confirmed',
            data: [8, 12, 10, 14, 16, 22, 24],
            backgroundColor: 'rgba(184, 115, 51, 0.75)',
            borderRadius: 4
          },
          {
            label: 'Cancelled',
            data: [1, 0, 2, 1, 0, 2, 1],
            backgroundColor: 'rgba(192, 57, 43, 0.45)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { boxWidth: 10, padding: 8, font: { size: 11 } }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { stepSize: 5 } }
        }
      }
    });
  }
}

// ── ANALYTICS SECTION CHARTS (DYNAMIC RE-RENDERING) ──
const ANALYTICS_DATA = {
  today: {
    revenue: [1200, 2400, 4800, 3100, 2200, 4640],
    labels: ['9 AM', '11 AM', '1 PM', '4 PM', '7 PM', '9 PM'],
    totalRev: '₹18,340',
    totalOrders: '42 orders',
    aov: '₹436',
    customers: '38 visitors'
  },
  '7d': {
    revenue: [11200, 13400, 12800, 15600, 14200, 19800, 18340],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    totalRev: '₹1,05,340',
    totalOrders: '247 orders',
    aov: '₹426',
    customers: '215 unique'
  },
  '30d': {
    revenue: [21400, 24800, 26900, 28100, 29500, 34200, 31000, 29800],
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
    totalRev: '₹4,25,800',
    totalOrders: '984 orders',
    aov: '₹432',
    customers: '542 unique'
  },
  '3m': {
    revenue: [380000, 412000, 445000],
    labels: ['June 2026', 'July 2026', 'August 2026'],
    totalRev: '₹12,37,000',
    totalOrders: '2,910 orders',
    aov: '₹425',
    customers: '1,247 unique'
  }
};

export function renderAnalyticsCharts(timeframe = '7d') {
  if (typeof Chart === 'undefined') return;

  const dataset = ANALYTICS_DATA[timeframe] || ANALYTICS_DATA['7d'];

  // Update KPI summaries if elements exist
  const revEl = document.getElementById('analytics-stat-rev');
  const ordEl = document.getElementById('analytics-stat-orders');
  const aovEl = document.getElementById('analytics-stat-aov');
  const custEl = document.getElementById('analytics-stat-cust');
  if (revEl) revEl.textContent = dataset.totalRev;
  if (ordEl) ordEl.textContent = dataset.totalOrders;
  if (aovEl) aovEl.textContent = dataset.aov;
  if (custEl) custEl.textContent = dataset.customers;

  // 1. Revenue & Orders Trend
  const elRev = document.getElementById('analyticsRevenueChart');
  if (elRev) {
    destroyChart('analyticsRevenueChart');
    chartInstances['analyticsRevenueChart'] = new Chart(elRev, {
      type: 'line',
      data: {
        labels: dataset.labels,
        datasets: [{
          label: 'Revenue (₹)',
          data: dataset.revenue,
          borderColor: ACCENT,
          borderWidth: 2.5,
          backgroundColor: 'rgba(184, 115, 51, 0.08)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: ACCENT
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { callback: v => '₹' + (v >= 1000 ? v / 1000 + 'k' : v) }
          }
        },
        plugins: {
          tooltip: {
            callbacks: { label: ctx => ' ₹' + ctx.raw.toLocaleString('en-IN') }
          }
        }
      }
    });
  }

  // 2. Hourly Peak Hours Chart
  const elHours = document.getElementById('analyticsPeakHoursChart');
  if (elHours) {
    destroyChart('analyticsPeakHoursChart');
    chartInstances['analyticsPeakHoursChart'] = new Chart(elHours, {
      type: 'bar',
      data: {
        labels: ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'],
        datasets: [{
          label: 'Guests & Footfall',
          data: [12, 24, 38, 45, 78, 92, 84, 52, 48, 62, 88, 96, 85, 48, 18],
          backgroundColor: ctx => {
            const val = ctx.raw;
            return val > 75 ? ACCENT : 'rgba(184, 115, 51, 0.35)';
          },
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' } }
        },
        plugins: {
          tooltip: { callbacks: { label: ctx => ` ${ctx.raw} guests in store` } }
        }
      }
    });
  }

  // 3. Top Selling Items
  const elTop = document.getElementById('analyticsTopItemsChart');
  if (elTop) {
    destroyChart('analyticsTopItemsChart');
    chartInstances['analyticsTopItemsChart'] = new Chart(elTop, {
      type: 'bar',
      data: {
        labels: ['Cappuccino', 'Margherita Pizza', 'Paneer Sandwich', 'Cold Brew', 'Cheesecake'],
        datasets: [{
          label: 'Units Sold',
          data: [342, 280, 245, 198, 175],
          backgroundColor: [ACCENT, GREEN, '#D4944A', BLUE, '#8C5220'],
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.04)' } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // 4. Sales Channel Breakdown
  const elChan = document.getElementById('analyticsChannelChart');
  if (elChan) {
    destroyChart('analyticsChannelChart');
    chartInstances['analyticsChannelChart'] = new Chart(elChan, {
      type: 'doughnut',
      data: {
        labels: ['Dine-In', 'Takeaway', 'Delivery (Direct & Zomato)'],
        datasets: [{
          data: [58, 26, 16],
          backgroundColor: [ACCENT, GREEN, BLUE],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { boxWidth: 10, padding: 8 }
          }
        }
      }
    });
  }
}
