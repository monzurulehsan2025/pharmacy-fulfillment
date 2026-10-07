/**
 * REST API Network Inspector & Live Payload Explorer Component
 * Captures and displays all 5 RESTful API requests and responses in real-time.
 */

import { apiClient } from '../apiClient.js';

export class ApiInspectorView {
  constructor(containerId, onNotification) {
    this.container = document.getElementById(containerId);
    this.notify = onNotification;
    this.trafficLogs = [];
    this.selectedLogId = null;
    this.activeMethodFilter = 'ALL';
    this.init();
  }

  init() {
    this.renderSkeleton();
    this.bindEvents();

    // Subscribe to API Client traffic
    apiClient.onNetworkActivity((record) => {
      this.trafficLogs.unshift(record);
      if (this.trafficLogs.length > 50) this.trafficLogs.pop();
      if (!this.selectedLogId) this.selectedLogId = record.id;
      this.renderTrafficList();
      this.renderSelectedPayload();
    });
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h2>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            RESTful API Live Network Inspector & Payload Explorer
          </h2>
          <p>Real-time audit log of HTTP requests and responses consumed across all 5 RESTful API endpoints</p>
        </div>
        <div class="view-actions">
          <div class="filter-chips" id="method-filter-chips">
            <button class="chip-btn active" data-method="ALL">ALL Methods</button>
            <button class="chip-btn" data-method="GET">GET</button>
            <button class="chip-btn" data-method="POST">POST</button>
            <button class="chip-btn" data-method="PUT">PUT</button>
          </div>
          <button class="btn btn-secondary" id="clear-logs-btn">Clear Trace</button>
        </div>
      </div>

      <!-- Quick Endpoint Runner Bar -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <span style="font-size: 0.82rem; color: var(--text-secondary); font-weight: 500;">
          ⚡ Quick Test Any of the 5 RESTful Endpoints:
        </span>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-secondary trigger-test-endpoint" data-ep="batches-get" style="font-size:0.75rem; padding:0.3rem 0.6rem;">GET /batches</button>
          <button class="btn btn-secondary trigger-test-endpoint" data-ep="cells-get" style="font-size:0.75rem; padding:0.3rem 0.6rem;">GET /dispensing-cells</button>
          <button class="btn btn-secondary trigger-test-endpoint" data-ep="inspections-get" style="font-size:0.75rem; padding:0.3rem 0.6rem;">GET /inspections</button>
          <button class="btn btn-secondary trigger-test-endpoint" data-ep="nodes-get" style="font-size:0.75rem; padding:0.3rem 0.6rem;">GET /telemetry/nodes</button>
          <button class="btn btn-secondary trigger-test-endpoint" data-ep="metrics-get" style="font-size:0.75rem; padding:0.3rem 0.6rem;">GET /observability/metrics</button>
        </div>
      </div>

      <div class="api-inspector-container">
        <!-- Live Traffic Feed -->
        <div class="network-traffic-panel">
          <h3 style="font-size: 0.95rem; font-family: var(--font-heading); margin-bottom: 0.85rem; color: var(--text-primary); display: flex; justify-content: space-between;">
            <span>HTTP Request Log</span>
            <span id="traffic-count-badge" class="badge badge-routine">0 Calls</span>
          </h3>
          <div id="traffic-entries-list">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Request & Response JSON Inspector -->
        <div class="api-payload-viewer" id="payload-viewer-panel">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelector('#clear-logs-btn').addEventListener('click', () => {
      this.trafficLogs = [];
      this.selectedLogId = null;
      this.renderTrafficList();
      this.renderSelectedPayload();
      this.notify("Network logs cleared", "info");
    });

    const methodChips = this.container.querySelectorAll('#method-filter-chips .chip-btn');
    methodChips.forEach(chip => {
      chip.addEventListener('click', () => {
        methodChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeMethodFilter = chip.dataset.method;
        this.renderTrafficList();
      });
    });

    // Quick Endpoint Test Buttons
    this.container.querySelectorAll('.trigger-test-endpoint').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const ep = e.currentTarget.dataset.ep;
        try {
          if (ep === 'batches-get') await apiClient.getBatches();
          else if (ep === 'cells-get') await apiClient.getDispensingCells();
          else if (ep === 'inspections-get') await apiClient.getInspections();
          else if (ep === 'nodes-get') await apiClient.getEdgeNodes();
          else if (ep === 'metrics-get') await apiClient.getObservabilityMetrics('24h');
          this.notify(`Endpoint call completed`, "success");
        } catch (err) {
          this.notify(`Test call error: ${err.message}`, "error");
        }
      });
    });
  }

  renderTrafficList() {
    const list = this.container.querySelector('#traffic-entries-list');
    const badge = this.container.querySelector('#traffic-count-badge');
    
    let filtered = this.trafficLogs;
    if (this.activeMethodFilter !== 'ALL') {
      filtered = filtered.filter(l => l.method === this.activeMethodFilter);
    }

    if (badge) badge.textContent = `${filtered.length} Requests`;

    if (filtered.length === 0) {
      list.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem; padding:1.5rem; text-align:center;">No HTTP traffic recorded yet. Perform actions across tabs or click test buttons above.</p>`;
      return;
    }

    list.innerHTML = filtered.map(log => {
      const isSelected = log.id === this.selectedLogId;
      const methodClass = `method-${log.method.toLowerCase()}`;

      return `
        <div class="traffic-entry ${isSelected ? 'active' : ''}" data-log-id="${log.id}">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span class="method-badge ${methodClass}">${log.method}</span>
            <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-primary); word-break: break-all;">
              ${log.url}
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span class="status-200">${log.statusCode}</span>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${log.durationMs}ms</span>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.traffic-entry').forEach(el => {
      el.addEventListener('click', () => {
        this.selectedLogId = el.dataset.logId;
        this.renderTrafficList();
        this.renderSelectedPayload();
      });
    });
  }

  renderSelectedPayload() {
    const panel = this.container.querySelector('#payload-viewer-panel');
    const log = this.trafficLogs.find(l => l.id === this.selectedLogId);

    if (!log) {
      panel.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:3rem;">Select an HTTP request from the log to view headers, request payload, and JSON response.</p>`;
      return;
    }

    const reqJson = log.requestPayload ? JSON.stringify(log.requestPayload, null, 2) : '/* No Request Body (GET / Query Parameters) */';
    const resJson = JSON.stringify(log.responsePayload, null, 2);

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; padding-bottom: 0.65rem; border-bottom: 1px solid var(--border-subtle);">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span class="method-badge method-${log.method.toLowerCase()}">${log.method}</span>
          <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">${log.url}</span>
        </div>
        <div style="display: flex; gap: 0.4rem;">
          <button class="btn btn-secondary" id="copy-json-btn" style="padding: 0.25rem 0.65rem; font-size: 0.72rem;">
            📋 Copy Response JSON
          </button>
        </div>
      </div>

      <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 0.6rem;">
        HTTP/1.1 <strong>${log.statusCode} ${log.statusText}</strong> • Duration: <strong>${log.durationMs}ms</strong> • ${new Date(log.timestamp).toLocaleTimeString()}
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem; flex: 1; overflow: hidden;">
        <div>
          <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.3rem;">Request Payload / Body</div>
          <pre class="payload-code-block" style="max-height: 140px;"><code>${this.escapeHtml(reqJson)}</code></pre>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
          <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.3rem;">Response Body (JSON)</div>
          <pre class="payload-code-block" style="flex: 1;"><code>${this.escapeHtml(resJson)}</code></pre>
        </div>
      </div>
    `;

    panel.querySelector('#copy-json-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(resJson);
      this.notify("Response JSON copied to clipboard", "success");
    });
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
