/**
 * Robotics Dispensing Cells Telemetry Component
 * Consumes Endpoint 2: GET /api/v1/robotics/dispensing-cells & PUT /api/v1/robotics/dispensing-cells/{cellId}/maintenance
 */

import { apiClient } from '../apiClient.js';

export class RoboticsTelemetryView {
  constructor(containerId, onNotification) {
    this.container = document.getElementById(containerId);
    this.notify = onNotification;
    this.cellsData = [];
    this.init();
  }

  async init() {
    this.renderSkeleton();
    this.bindEvents();
    await this.fetchAndRenderCells();
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h2>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
              <line x1="8" y1="16" x2="8" y2="16"></line>
              <line x1="16" y1="16" x2="16" y2="16"></line>
            </svg>
            Automated Robotics Dispensing Cells
          </h2>
          <p>Real-time telemetry, canister singulation metrics, laser count calibration, and RFID authentication</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" id="refresh-cells-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Sync Cell Telemetry
          </button>
        </div>
      </div>

      <div class="cells-grid" id="cells-grid-container">
        <!-- Rendered dynamically -->
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelector('#refresh-cells-btn').addEventListener('click', () => {
      this.fetchAndRenderCells();
      this.notify("Robotic cell telemetry synchronized", "info");
    });
  }

  async fetchAndRenderCells() {
    try {
      const response = await apiClient.getDispensingCells();
      this.cellsData = response.cells || [];
      this.renderCells();
    } catch (err) {
      this.notify(`Failed to fetch dispensing cells: ${err.message}`, "error");
    }
  }

  renderCells() {
    const grid = this.container.querySelector('#cells-grid-container');

    grid.innerHTML = this.cellsData.map(cell => {
      const isOnline = cell.status.startsWith('ONLINE');
      const isCalibrating = cell.status === 'CALIBRATING';
      const statusClass = isOnline ? 'badge-success' : (isCalibrating ? 'badge-warning' : 'badge-stat');

      return `
        <div class="cell-card" data-cell-id="${cell.cellId}">
          <div class="cell-header">
            <div>
              <div class="cell-id-title">${cell.cellId}</div>
              <div class="cell-meta">${cell.model} • ${cell.zone}</div>
            </div>
            <span class="badge ${statusClass}">
              <span class="pulse-dot" style="background-color: currentColor;"></span>
              ${cell.status}
            </span>
          </div>

          <div class="cell-telemetry-row">
            <div class="telemetry-mini-stat">
              <div class="telemetry-mini-label">Dispense Speed</div>
              <div class="telemetry-mini-val">${cell.dispenseSpeedUnitsSec} <span style="font-size:0.7rem;">pills/s</span></div>
            </div>
            <div class="telemetry-mini-stat">
              <div class="telemetry-mini-label">Environment</div>
              <div class="telemetry-mini-val">${cell.temperatureC}°C <span style="font-size:0.7rem; color:var(--text-muted);">${cell.relativeHumidityPct}% RH</span></div>
            </div>
            <div class="telemetry-mini-stat">
              <div class="telemetry-mini-label">Shift Dispensed</div>
              <div class="telemetry-mini-val">${cell.totalPillsDispensedShift.toLocaleString()}</div>
            </div>
          </div>

          <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.4rem;">
            Active Medication Canisters (${cell.canisters.length})
          </div>

          <div class="canister-list">
            ${cell.canisters.map(can => {
              const isLow = can.fillPercent < 25;
              return `
                <div class="canister-item">
                  <div class="canister-header">
                    <div>
                      <div class="canister-drug">${can.medication}</div>
                      <div style="font-size:0.68rem; color:var(--text-muted); font-family:var(--font-mono);">
                        Slot: ${can.slotId} | Lot: ${can.lotNumber} | NDC: ${can.ndc}
                      </div>
                    </div>
                    <div style="text-align:right;">
                      <div class="canister-count">${can.currentCount} / ${can.capacity}</div>
                      <div style="font-size:0.68rem; color:${isLow ? 'var(--accent-rose)' : 'var(--accent-emerald)'}; font-family:var(--font-mono); font-weight:600;">
                        ${can.fillPercent}% ${isLow ? '⚠️ LOW' : 'OK'}
                      </div>
                    </div>
                  </div>
                  <div class="canister-progress">
                    <div class="canister-fill ${isLow ? 'low' : ''}" style="width: ${Math.min(100, can.fillPercent)}%;"></div>
                  </div>
                  <div style="display:flex; justify-content:space-between; font-size:0.68rem; color:var(--text-muted); margin-top:0.3rem;">
                    <span>RFID: <strong style="color:var(--text-primary);">${can.rfidStatus}</strong></span>
                    <span>Singulation: <strong style="color:var(--accent-emerald);">${can.singulationAccuracy}%</strong></span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="cell-card-footer">
            <div style="font-size:0.72rem; color:var(--text-muted);">
              Active Batch: <strong style="color:var(--accent-cyan);">${cell.activeBatchId || 'None (Idle)'}</strong>
            </div>
            <div style="display:flex; gap:0.4rem;">
              <button class="btn btn-secondary cell-maintenance-btn" data-cell-id="${cell.cellId}" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;">
                ⚙️ Maintenance & Refill
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind Maintenance Trigger Buttons
    grid.querySelectorAll('.cell-maintenance-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cellId = e.currentTarget.dataset.cellId;
        this.openMaintenanceModal(cellId);
      });
    });
  }

  openMaintenanceModal(cellId) {
    const cell = this.cellsData.find(c => c.cellId === cellId);
    if (!cell) return;

    const modalBackdrop = document.getElementById('global-modal-backdrop');
    const modalContainer = document.getElementById('global-modal-container');

    modalContainer.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Robotics Cell Maintenance & Diagnostics: ${cellId}</h3>
        <button class="btn btn-icon" id="close-modal-x-btn">✕</button>
      </div>
      <form id="cell-maintenance-form">
        <div class="modal-body">
          <div style="margin-bottom: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
            Model: <strong>${cell.model}</strong> | Zone: <strong>${cell.zone}</strong>
          </div>

          <div class="form-group">
            <label class="form-label">Maintenance / Diagnostic Operation</label>
            <select class="form-select" id="maintenance-mode-select">
              <option value="CALIBRATE">Laser Singulation Count Recalibration</option>
              <option value="REFILL_RESTOCK">Restock & Authenticate Canister Fill Levels (100%)</option>
              <option value="RESUME_ONLINE">Clear Diagnostic State & Resume Online Dispensing</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Authorized Technician Badge ID</label>
            <input type="text" class="form-input" id="tech-id-input" value="TECH-4092-ENG" required />
          </div>

          <div class="form-group">
            <label class="form-label">Calibration Verification Notes</label>
            <textarea class="form-textarea" id="tech-notes-input" rows="2" placeholder="Optical sensor alignment and canister latch inspection performed."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="close-modal-cancel-btn">Cancel</button>
          <button type="submit" class="btn btn-primary">Execute Maintenance Command</button>
        </div>
      </form>
    `;

    modalBackdrop.classList.add('active');

    const closeModal = () => modalBackdrop.classList.remove('active');
    modalContainer.querySelector('#close-modal-x-btn').addEventListener('click', closeModal);
    modalContainer.querySelector('#close-modal-cancel-btn').addEventListener('click', closeModal);

    modalContainer.querySelector('#cell-maintenance-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const mode = modalContainer.querySelector('#maintenance-mode-select').value;
      const technicianId = modalContainer.querySelector('#tech-id-input').value;
      const notes = modalContainer.querySelector('#tech-notes-input').value;

      try {
        await apiClient.updateCellMaintenance(cellId, {
          mode,
          technicianId,
          notes
        });

        closeModal();
        this.notify(`Cell ${cellId} maintenance mode '${mode}' executed successfully`, "success");
        await this.fetchAndRenderCells();
      } catch (err) {
        this.notify(`Maintenance operation failed: ${err.message}`, "error");
      }
    });
  }
}
