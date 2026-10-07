/**
 * Batch Management Component
 * Consumes Endpoint 1: GET /api/v1/fulfillment/batches & POST /api/v1/fulfillment/batches
 */

import { apiClient } from '../apiClient.js';

export class BatchManagementView {
  constructor(containerId, onNotification) {
    this.container = document.getElementById(containerId);
    this.notify = onNotification;
    this.currentFilter = 'all';
    this.currentPriority = 'all';
    this.searchQuery = '';
    this.batchesData = [];
    this.init();
  }

  async init() {
    this.renderSkeleton();
    this.bindGlobalEvents();
    await this.fetchAndRenderBatches();
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h2>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            Prescription Dispensing Batches
          </h2>
          <p>Real-time queue of high-velocity robotic dispensing batches and canister singulation queues</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary" id="refresh-batches-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Refresh Queue
          </button>
          <button class="btn btn-primary" id="open-dispatch-modal-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Dispatch New Batch
          </button>
        </div>
      </div>

      <div class="filter-bar">
        <div class="filter-group">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Status:</span>
          <div class="filter-chips" id="batch-status-chips">
            <button class="chip-btn active" data-status="all">All</button>
            <button class="chip-btn" data-status="queued">Queued</button>
            <button class="chip-btn" data-status="dispensing">Dispensing</button>
            <button class="chip-btn" data-status="verification">Verification</button>
            <button class="chip-btn" data-status="completed">Completed</button>
          </div>
        </div>

        <div class="filter-group">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Priority:</span>
          <div class="filter-chips" id="batch-priority-chips">
            <button class="chip-btn active" data-priority="all">All</button>
            <button class="chip-btn" data-priority="STAT">STAT</button>
            <button class="chip-btn" data-priority="URGENT">Urgent</button>
            <button class="chip-btn" data-priority="ROUTINE">Routine</button>
          </div>
        </div>

        <div class="search-box">
          <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="batch-search-input" placeholder="Search Batch ID, Drug, Rx..." />
        </div>
      </div>

      <div class="batch-cards-container" id="batches-list-container">
        <!-- Rendered dynamically -->
      </div>
    `;
  }

  bindGlobalEvents() {
    this.container.querySelector('#refresh-batches-btn').addEventListener('click', () => {
      this.fetchAndRenderBatches();
      this.notify("Fulfillment batches refreshed from API", "info");
    });

    this.container.querySelector('#open-dispatch-modal-btn').addEventListener('click', () => {
      this.openCreateBatchModal();
    });

    const statusChips = this.container.querySelectorAll('#batch-status-chips .chip-btn');
    statusChips.forEach(chip => {
      chip.addEventListener('click', () => {
        statusChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentFilter = chip.dataset.status;
        this.fetchAndRenderBatches();
      });
    });

    const priorityChips = this.container.querySelectorAll('#batch-priority-chips .chip-btn');
    priorityChips.forEach(chip => {
      chip.addEventListener('click', () => {
        priorityChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentPriority = chip.dataset.priority;
        this.fetchAndRenderBatches();
      });
    });

    const searchInput = this.container.querySelector('#batch-search-input');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.fetchAndRenderBatches();
    });
  }

  async fetchAndRenderBatches() {
    try {
      const response = await apiClient.getBatches({
        status: this.currentFilter,
        priority: this.currentPriority,
        search: this.searchQuery
      });

      this.batchesData = response.batches || [];
      this.renderBatchCards();
    } catch (err) {
      this.notify(`Failed to load batches: ${err.message}`, "error");
    }
  }

  renderBatchCards() {
    const list = this.container.querySelector('#batches-list-container');
    if (this.batchesData.length === 0) {
      list.innerHTML = `
        <div style="text-align:center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <p style="color: var(--text-muted); font-size: 0.95rem;">No prescription batches match current filter criteria.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = this.batchesData.map(batch => {
      const percent = Math.round((batch.dispensedUnits / batch.totalUnits) * 100) || 0;
      const priorityClass = batch.priority === 'STAT' ? 'badge-stat' : (batch.priority === 'URGENT' ? 'badge-urgent' : 'badge-routine');
      const statusBadgeClass = batch.status === 'completed' ? 'badge-success' : (batch.status === 'dispensing' ? 'badge-stat' : 'badge-routine');

      return `
        <div class="batch-card" data-batch-id="${batch.batchId}">
          <div class="batch-header">
            <div class="batch-id-info">
              <span class="batch-id">${batch.batchId}</span>
              <span class="badge ${priorityClass}">${batch.priority}</span>
              <span class="badge ${statusBadgeClass}">${batch.status.toUpperCase()}</span>
              <span class="station-tag">Target: ${batch.targetStationId}</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">
                Est: ${batch.estimatedCompletionSeconds}s | ${batch.patientCount} Patients
              </span>
              ${batch.status !== 'completed' ? `
                <button class="btn btn-secondary advance-batch-btn" data-batch-id="${batch.batchId}" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;">
                  Advance Stage ➔
                </button>
              ` : `
                <span class="badge badge-success">READY FOR SEAL</span>
              `}
            </div>
          </div>

          <div class="progress-container">
            <div class="progress-labels">
              <span>Units Singulated: <strong>${batch.dispensedUnits} / ${batch.totalUnits}</strong></span>
              <span>${percent}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${percent}%;"></div>
            </div>
          </div>

          <details style="margin-top: 0.85rem;">
            <summary style="font-size: 0.8rem; color: var(--accent-cyan); cursor: pointer; user-select: none;">
              View Prescription Manifest (${batch.prescriptions ? batch.prescriptions.length : 0} items)
            </summary>
            <table class="prescriptions-table">
              <thead>
                <tr>
                  <th>Rx #</th>
                  <th>Patient</th>
                  <th>Medication & Formulation</th>
                  <th>NDC</th>
                  <th>Qty</th>
                  <th>Canister Slot</th>
                  <th>Imprint</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${(batch.prescriptions || []).map(rx => `
                  <tr>
                    <td style="font-family: var(--font-mono); font-weight:600; color:var(--accent-cyan);">${rx.rxNumber}</td>
                    <td>${rx.patientInitials}</td>
                    <td><strong>${rx.medicationName}</strong> <span style="color:var(--text-muted); font-size:0.75rem;">${rx.dosage}</span></td>
                    <td style="font-family: var(--font-mono); font-size:0.75rem;">${rx.ndc}</td>
                    <td style="font-family: var(--font-mono);">${rx.quantity}</td>
                    <td><span class="pill-preview-pill">${rx.canisterSlot}</span></td>
                    <td><code style="font-size:0.75rem; color:var(--text-highlight);">${rx.imprint}</code></td>
                    <td><span class="badge ${rx.status === 'VERIFIED_DISPATCHED' ? 'badge-success' : 'badge-routine'}">${rx.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </details>
        </div>
      `;
    }).join('');

    // Attach advance stage events
    list.querySelectorAll('.advance-batch-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const batchId = e.currentTarget.dataset.batchId;
        try {
          btn.disabled = true;
          btn.textContent = 'Processing...';
          await apiClient.advanceBatchStatus(batchId);
          this.notify(`Batch ${batchId} advanced to next pipeline stage`, "success");
          await this.fetchAndRenderBatches();
        } catch (err) {
          this.notify(`Failed to advance batch: ${err.message}`, "error");
        }
      });
    });
  }

  openCreateBatchModal() {
    const modalBackdrop = document.getElementById('global-modal-backdrop');
    const modalContainer = document.getElementById('global-modal-container');

    modalContainer.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Dispatch New Robotic Dispense Batch</h3>
        <button class="btn btn-icon" id="close-modal-x-btn">✕</button>
      </div>
      <form id="create-batch-form">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Batch Priority Tier</label>
            <select class="form-select" id="new-batch-priority" required>
              <option value="STAT">STAT (Immediate Emergency / ICU Dispatch)</option>
              <option value="URGENT">URGENT (Expedited Inpatient / Next Hour)</option>
              <option value="ROUTINE" selected>ROUTINE (Standard High-Velocity Batch)</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Target Dispensing Cell</label>
              <select class="form-select" id="new-batch-cell" required>
                <option value="CELL-ALPHA-01">CELL-ALPHA-01 (Zone A - High Velocity)</option>
                <option value="CELL-BETA-02">CELL-BETA-02 (Zone A - High Velocity)</option>
                <option value="CELL-GAMMA-03">CELL-GAMMA-03 (Zone B - Precision)</option>
                <option value="CELL-DELTA-04">CELL-DELTA-04 (Zone C - Pouch Packager)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Prescription Order Preset</label>
              <select class="form-select" id="new-batch-preset">
                <option value="cardio">Cardiovascular Pack (Atorvastatin, Lisinopril)</option>
                <option value="metabolic">Metabolic Maintenance (Metformin, Levothyroxine)</option>
                <option value="custom">Standard Multi-Dose Inpatient Batch</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Patient Count & Total Dose Allocation</label>
            <input type="number" class="form-input" id="new-batch-patient-count" value="12" min="1" max="100" />
          </div>

          <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem; font-size: 0.78rem; color: var(--text-secondary);">
            🔒 All prescription dispatches will be signed with automated cryptographic audit hash and assigned to optical verification queues upon canister singulation completion.
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="close-modal-cancel-btn">Cancel</button>
          <button type="submit" class="btn btn-primary" id="submit-create-batch-btn">Dispatch to Robotics Cell</button>
        </div>
      </form>
    `;

    modalBackdrop.classList.add('active');

    const closeModal = () => modalBackdrop.classList.remove('active');
    modalContainer.querySelector('#close-modal-x-btn').addEventListener('click', closeModal);
    modalContainer.querySelector('#close-modal-cancel-btn').addEventListener('click', closeModal);

    modalContainer.querySelector('#create-batch-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const priority = modalContainer.querySelector('#new-batch-priority').value;
      const targetCell = modalContainer.querySelector('#new-batch-cell').value;
      const patientCount = parseInt(modalContainer.querySelector('#new-batch-patient-count').value, 10);
      const preset = modalContainer.querySelector('#new-batch-preset').value;

      let prescriptions = [];
      if (preset === 'cardio') {
        prescriptions = [
          { rxNumber: `RX-880${Math.floor(1000 + Math.random()*9000)}`, patientInitials: "B.K.", medicationName: "Atorvastatin Calcium", ndc: "00071-0156-23", dosage: "20mg Tablet", quantity: 90, canisterSlot: "CAN-01-A", pillShape: "Oval", pillColor: "White", imprint: "PD 156 20", status: "QUEUED" },
          { rxNumber: `RX-880${Math.floor(1000 + Math.random()*9000)}`, patientInitials: "L.H.", medicationName: "Lisinopril", ndc: "00006-0207-58", dosage: "10mg Tablet", quantity: 180, canisterSlot: "CAN-01-C", pillShape: "Round", pillColor: "Pink", imprint: "MSD 207", status: "QUEUED" }
        ];
      } else {
        prescriptions = [
          { rxNumber: `RX-880${Math.floor(1000 + Math.random()*9000)}`, patientInitials: "W.P.", medicationName: "Metformin HCl ER", ndc: "00591-2718-01", dosage: "500mg Tablet", quantity: 180, canisterSlot: "CAN-01-B", pillShape: "Round", pillColor: "White", imprint: "M 500", status: "QUEUED" },
          { rxNumber: `RX-880${Math.floor(1000 + Math.random()*9000)}`, patientInitials: "T.M.", medicationName: "Levothyroxine Sodium", ndc: "00074-6567-13", dosage: "50mcg Tablet", quantity: 90, canisterSlot: "CAN-02-A", pillShape: "Round", pillColor: "White", imprint: "SYNTHROID 50", status: "QUEUED" }
        ];
      }

      try {
        const result = await apiClient.createBatch({
          priority,
          targetStationId: targetCell,
          patientCount,
          facilityCode: "FAC-CENTRAL-01",
          prescriptions
        });

        closeModal();
        this.notify(`Batch ${result.batch.batchId} created and dispatched to ${targetCell}`, "success");
        await this.fetchAndRenderBatches();
      } catch (err) {
        this.notify(`Error creating batch: ${err.message}`, "error");
      }
    });
  }
}
