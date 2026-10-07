/**
 * Customer-Deployed Fleet Nodes & Telemetry Component
 * Consumes Endpoint 4: GET /api/v1/telemetry/nodes & POST /api/v1/telemetry/nodes/{nodeId}/rollout
 */

import { apiClient } from '../apiClient.js';

export class FleetDeploymentView {
  constructor(containerId, onNotification) {
    this.container = document.getElementById(containerId);
    this.notify = onNotification;
    this.nodesData = [];
    this.init();
  }

  async init() {
    this.renderSkeleton();
    this.bindEvents();
    await this.fetchAndRenderNodes();
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h2>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            Customer-Deployed On-Premises Dispensary Nodes
          </h2>
          <p>Fleet orchestration for customer-deployed hospital pharmacies, staged canary rollouts, backward compatibility contracts, and edge telemetry</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" id="refresh-fleet-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Sync Fleet Status
          </button>
        </div>
      </div>

      <div class="fleet-grid" id="fleet-nodes-container">
        <!-- Rendered dynamically -->
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelector('#refresh-fleet-btn').addEventListener('click', () => {
      this.fetchAndRenderNodes();
      this.notify("Customer edge dispensary fleet telemetry synchronized", "info");
    });
  }

  async fetchAndRenderNodes() {
    try {
      const response = await apiClient.getEdgeNodes();
      this.nodesData = response.nodes || [];
      this.renderNodes();
    } catch (err) {
      this.notify(`Failed to load fleet nodes: ${err.message}`, "error");
    }
  }

  renderNodes() {
    const grid = this.container.querySelector('#fleet-nodes-container');

    grid.innerHTML = this.nodesData.map(node => {
      const isHealthy = node.nodeHealth === 'HEALTHY';
      const isCanary = node.canaryStage.includes('CANARY');
      const healthBadge = isHealthy 
        ? '<span class="badge badge-success">HEALTHY</span>'
        : '<span class="badge badge-warning">DRIFT WARNING</span>';

      return `
        <div class="fleet-node-card" data-node-id="${node.nodeId}">
          <div class="node-top">
            <div>
              <div class="node-title">${node.facilityName}</div>
              <div class="node-location">${node.location} • <span style="font-family:var(--font-mono); color:var(--accent-cyan);">${node.nodeId}</span></div>
            </div>
            ${healthBadge}
          </div>

          <div class="node-details-list">
            <div class="node-detail-row">
              <span class="node-detail-label">Runtime Substrate</span>
              <span class="node-detail-val">${node.runtimeEnvironment}</span>
            </div>
            <div class="node-detail-row">
              <span class="node-detail-label">Software Agent Version</span>
              <span class="node-detail-val" style="color:var(--text-highlight);">${node.agentVersion}</span>
            </div>
            <div class="node-detail-row">
              <span class="node-detail-label">Rollout Stage & Traffic</span>
              <span class="node-detail-val">
                <span class="badge ${isCanary ? 'badge-urgent' : 'badge-routine'}">${node.canaryStage} (${node.trafficPercent}%)</span>
              </span>
            </div>
            <div class="node-detail-row">
              <span class="node-detail-label">Backward Compat Contract</span>
              <span class="node-detail-val" style="font-size:0.75rem;">${node.backwardCompatibilityContract}</span>
            </div>
            <div class="node-detail-row">
              <span class="node-detail-label">Connected Robotics Cells</span>
              <span class="node-detail-val">${node.connectedCellsCount} Cells Active</span>
            </div>
            <div class="node-detail-row">
              <span class="node-detail-label">Cloud Sync Latency / Uptime</span>
              <span class="node-detail-val">${node.latencyToCloudHubMs}ms • ${node.uptimeDays}d uptime</span>
            </div>
          </div>

          <div style="margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">
              Config: ${node.deployedConfigHash}
            </div>
            <button class="btn btn-primary trigger-rollout-btn" data-node-id="${node.nodeId}" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
              🚀 Staged Rollout
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind Rollout Action
    grid.querySelectorAll('.trigger-rollout-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nodeId = e.currentTarget.dataset.nodeId;
        this.openRolloutModal(nodeId);
      });
    });
  }

  openRolloutModal(nodeId) {
    const node = this.nodesData.find(n => n.nodeId === nodeId);
    if (!node) return;

    const modalBackdrop = document.getElementById('global-modal-backdrop');
    const modalContainer = document.getElementById('global-modal-container');

    modalContainer.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Staged Rollout Orchestration: ${node.nodeId}</h3>
        <button class="btn btn-icon" id="close-modal-x-btn">✕</button>
      </div>
      <form id="node-rollout-form">
        <div class="modal-body">
          <div style="margin-bottom: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
            Target Facility: <strong>${node.facilityName}</strong><br/>
            Current Version: <strong style="color:var(--text-highlight);">${node.agentVersion}</strong>
          </div>

          <div class="form-group">
            <label class="form-label">Target Release Image / Package</label>
            <select class="form-select" id="rollout-version-select">
              <option value="v3.15.0-rc3">v3.15.0-rc3 (Latest Release Candidate with Low-Latency Canister Drivers)</option>
              <option value="v3.15.0-GA">v3.15.0-GA (General Availability Modernized Microservices)</option>
              <option value="v3.14.2-patch1">v3.14.2-patch1 (Long-Term Support Maintenance Hotfix)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Rollout Strategy</label>
            <select class="form-select" id="rollout-strategy-select">
              <option value="CANARY_STAGED">Canary Staged Deployment (Gradual 10% -> 25% -> 100%)</option>
              <option value="BLUE_GREEN_SWAP">Blue/Green Instance Switch (Zero-Downtime Appliance Swap)</option>
              <option value="SHADOW_MIRROR">Shadow Traffic Mirroring (Validate against active customer config)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Initial Canary Traffic Allocation (%)</label>
            <input type="number" class="form-input" id="rollout-traffic-input" value="25" min="5" max="100" />
          </div>

          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 0.85rem; font-size: 0.78rem; color: var(--accent-emerald);">
            ✓ Automated Rollback Gate Enabled: Deployment will instantly revert if singulation accuracy drops below 99.9% or error rate exceeds 5 PPM.
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="close-modal-cancel-btn">Cancel</button>
          <button type="submit" class="btn btn-primary">Deploy Rollout Pipeline</button>
        </div>
      </form>
    `;

    modalBackdrop.classList.add('active');

    const closeModal = () => modalBackdrop.classList.remove('active');
    modalContainer.querySelector('#close-modal-x-btn').addEventListener('click', closeModal);
    modalContainer.querySelector('#close-modal-cancel-btn').addEventListener('click', closeModal);

    modalContainer.querySelector('#node-rollout-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const targetVersion = modalContainer.querySelector('#rollout-version-select').value;
      const rolloutStrategy = modalContainer.querySelector('#rollout-strategy-select').value;
      const trafficPercentage = parseInt(modalContainer.querySelector('#rollout-traffic-input').value, 10);

      try {
        const result = await apiClient.triggerNodeRollout(nodeId, {
          targetVersion,
          rolloutStrategy,
          trafficPercentage,
          autoRollbackOnHealthDegradation: true
        });

        closeModal();
        this.notify(`Rollout job ${result.jobId} initiated for ${nodeId} (${targetVersion})`, "success");
        await this.fetchAndRenderNodes();
      } catch (err) {
        this.notify(`Rollout trigger failed: ${err.message}`, "error");
      }
    });
  }
}
