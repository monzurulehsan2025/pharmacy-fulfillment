/**
 * Observability & Telemetry Dashboard Component
 * Consumes Endpoint 5: GET /api/v1/observability/metrics
 */

import { apiClient } from '../apiClient.js';

export class ObservabilityDashboardView {
  constructor(containerId, onNotification) {
    this.container = document.getElementById(containerId);
    this.notify = onNotification;
    this.timeframe = '24h';
    this.metricsData = null;
    this.autoRefreshTimer = null;
    this.init();
  }

  async init() {
    this.renderSkeleton();
    this.bindEvents();
    await this.fetchAndRenderMetrics();
    this.startAutoRefresh();
  }

  startAutoRefresh() {
    if (this.autoRefreshTimer) clearInterval(this.autoRefreshTimer);
    this.autoRefreshTimer = setInterval(() => {
      this.fetchAndRenderMetrics(true);
    }, 12000);
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h2>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 20V10"></path>
              <path d="M12 20V4"></path>
              <path d="M6 20v-6"></path>
            </svg>
            Pharmacy Fulfillment Observability & SLA Telemetry
          </h2>
          <p>Real-time fulfillment velocity, P99 robotic dispense latencies, canister singulation accuracy, and system health</p>
        </div>
        <div class="view-actions">
          <div class="filter-chips" id="timeframe-filter-chips">
            <button class="chip-btn" data-timeframe="1h">1 Hour</button>
            <button class="chip-btn" data-timeframe="6h">6 Hours</button>
            <button class="chip-btn active" data-timeframe="24h">24 Hours</button>
            <button class="chip-btn" data-timeframe="7d">7 Days</button>
          </div>
          <button class="btn btn-secondary" id="refresh-metrics-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Refresh Telemetry
          </button>
        </div>
      </div>

      <!-- Live KPI Cards -->
      <div class="kpi-grid" id="observability-kpis-grid">
        <!-- Rendered dynamically -->
      </div>

      <!-- Throughput Chart Card -->
      <div class="chart-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="font-size: 1.1rem; font-family: var(--font-heading); color: var(--text-primary);">
              Hourly Medication Dispensing Throughput (Units / Hour)
            </h3>
            <p style="font-size: 0.78rem; color: var(--text-secondary);">Singulated doses processed across all robotic cell zones</p>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.75rem; font-family: var(--font-mono);">
            <span style="display: flex; align-items: center; gap: 0.35rem;">
              <span style="width: 10px; height: 10px; background: var(--accent-cyan); border-radius: 2px;"></span> Units Dispensed
            </span>
            <span style="display: flex; align-items: center; gap: 0.35rem;">
              <span style="width: 10px; height: 10px; background: var(--accent-emerald); border-radius: 2px;"></span> SLA Accuracy %
            </span>
          </div>
        </div>

        <div class="svg-chart-container" id="hourly-chart-wrapper">
          <!-- Rendered dynamically -->
        </div>
      </div>

      <!-- Active Alerts Stream -->
      <div class="chart-card" style="margin-top: 1.25rem;">
        <h3 style="font-size: 1.05rem; font-family: var(--font-heading); margin-bottom: 0.85rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Active Pharmacy Automation Event Stream & Alerts
        </h3>
        <div class="alert-feed-list" id="observability-alerts-list">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelector('#refresh-metrics-btn').addEventListener('click', () => {
      this.fetchAndRenderMetrics(false);
      this.notify("Telemetry metrics updated from API", "info");
    });

    const timeframeChips = this.container.querySelectorAll('#timeframe-filter-chips .chip-btn');
    timeframeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        timeframeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.timeframe = chip.dataset.timeframe;
        this.fetchAndRenderMetrics(false);
      });
    });
  }

  async fetchAndRenderMetrics(silent = false) {
    try {
      const response = await apiClient.getObservabilityMetrics(this.timeframe);
      this.metricsData = response.observability;
      this.renderKPIs();
      this.renderChart();
      this.renderAlerts();
    } catch (err) {
      if (!silent) this.notify(`Failed to load metrics: ${err.message}`, "error");
    }
  }

  renderKPIs() {
    const kpiGrid = this.container.querySelector('#observability-kpis-grid');
    if (!this.metricsData) return;
    const k = this.metricsData.kpis;

    kpiGrid.innerHTML = `
      <div class="kpi-card">
        <div class="kpi-title">
          <span>Today's Total Units</span>
          <span>💊</span>
        </div>
        <div class="kpi-value">${k.totalPillsDispensedToday.toLocaleString()}</div>
        <div class="kpi-subtext">
          <span class="kpi-trend-up">↑ +8.4%</span> vs yesterday shift
        </div>
      </div>

      <div class="kpi-card emerald">
        <div class="kpi-title">
          <span>Singulation Accuracy SLA</span>
          <span>🎯</span>
        </div>
        <div class="kpi-value" style="color:var(--accent-emerald);">${k.overallAccuracySlaRate}%</div>
        <div class="kpi-subtext">
          <span>Error rate: <strong>${k.singulationErrorPpm} PPM</strong></span>
        </div>
      </div>

      <div class="kpi-card amber">
        <div class="kpi-title">
          <span>P99 Dispense Latency</span>
          <span>⚡</span>
        </div>
        <div class="kpi-value">${k.p99DispenseLatencyMs} <span style="font-size:1rem; font-weight:500;">ms</span></div>
        <div class="kpi-subtext">
          <span>Median P50: <strong>${k.p50DispenseLatencyMs}ms</strong></span>
        </div>
      </div>

      <div class="kpi-card violet">
        <div class="kpi-title">
          <span>Active Robotics Fleet</span>
          <span>🤖</span>
        </div>
        <div class="kpi-value">${k.activeRoboticCellsOnline}</div>
        <div class="kpi-subtext">
          <span>Throughput: <strong>${k.telemetryThroughputUnitsMin} units/min</strong></span>
        </div>
      </div>
    `;
  }

  renderChart() {
    const chartWrapper = this.container.querySelector('#hourly-chart-wrapper');
    if (!this.metricsData || !this.metricsData.hourlyThroughput) return;

    const data = this.metricsData.hourlyThroughput;
    const maxUnits = Math.max(...data.map(d => d.unitsDispensed), 50000);
    const chartHeight = 180;
    const chartWidth = 900;
    const barWidth = 42;
    const spacing = chartWidth / data.length;

    const svgBars = data.map((d, index) => {
      const height = (d.unitsDispensed / maxUnits) * chartHeight;
      const x = index * spacing + (spacing - barWidth) / 2;
      const y = chartHeight - height + 20;

      return `
        <g class="bar-group" style="cursor: pointer;">
          <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" rx="4" fill="url(#barGradient)" />
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="JetBrains Mono">${(d.unitsDispensed / 1000).toFixed(1)}k</text>
          <text x="${x + barWidth / 2}" y="${chartHeight + 38}" text-anchor="middle" fill="#64748b" font-size="11" font-family="JetBrains Mono">${d.hour}</text>
        </g>
      `;
    }).join('');

    chartWrapper.innerHTML = `
      <svg viewBox="0 0 ${chartWidth} 240" width="100%" height="100%" style="overflow: visible;">
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#06b6d4" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>
        </defs>
        <!-- Horizontal Guide Lines -->
        <line x1="0" y1="20" x2="${chartWidth}" y2="20" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
        <line x1="0" y1="80" x2="${chartWidth}" y2="80" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
        <line x1="0" y1="140" x2="${chartWidth}" y2="140" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
        <line x1="0" y1="${chartHeight + 20}" x2="${chartWidth}" y2="${chartHeight + 20}" stroke="rgba(255,255,255,0.12)" />
        ${svgBars}
      </svg>
    `;
  }

  renderAlerts() {
    const list = this.container.querySelector('#observability-alerts-list');
    if (!this.metricsData || !this.metricsData.activeAlerts) return;

    list.innerHTML = this.metricsData.activeAlerts.map(alert => {
      const isWarn = alert.severity === 'WARNING';
      return `
        <div class="alert-item" style="border-left-color: ${isWarn ? 'var(--accent-amber)' : 'var(--accent-cyan)'};">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="badge ${isWarn ? 'badge-warning' : 'badge-routine'}">${alert.severity}</span>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">${alert.alertId} • ${alert.source}</span>
            </div>
            <div style="font-size:0.85rem; color:var(--text-primary); margin-top:0.35rem;">${alert.message}</div>
          </div>
          <div style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono); white-space:nowrap;">
            ${new Date(alert.timestamp).toLocaleTimeString()}
          </div>
        </div>
      `;
    }).join('');
  }
}
