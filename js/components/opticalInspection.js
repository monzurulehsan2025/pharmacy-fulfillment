/**
 * Computer-Vision Optical Pill Inspection & Pharmacist Verification Component
 * Consumes Endpoint 3: GET /api/v1/verification/inspections & POST /api/v1/verification/inspections/{inspectionId}/decision
 */

import { apiClient } from '../apiClient.js';

export class OpticalInspectionView {
  constructor(containerId, onNotification) {
    this.container = document.getElementById(containerId);
    this.notify = onNotification;
    this.currentFilter = 'all';
    this.inspectionsData = [];
    this.selectedInspectionId = null;
    this.init();
  }

  async init() {
    this.renderSkeleton();
    this.bindEvents();
    await this.fetchAndRenderInspections();
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h2>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="22" y1="12" x2="18" y2="12"></line>
              <line x1="6" y1="12" x2="2" y2="12"></line>
              <line x1="12" y1="6" x2="12" y2="2"></line>
              <line x1="12" y1="22" x2="12" y2="18"></line>
            </svg>
            High-Speed Optical Pill Inspection & Pharmacist Sign-Off
          </h2>
          <p>120 FPS multi-spectral computer vision verification, imprint OCR matching, and downstream conveyer gating</p>
        </div>
        <div class="view-actions">
          <div class="filter-chips" id="inspection-filter-chips">
            <button class="chip-btn active" data-filter="all">All Records</button>
            <button class="chip-btn" data-filter="pending">Flagged For Review</button>
            <button class="chip-btn" data-filter="approved">Approved</button>
          </div>
          <button class="btn btn-secondary" id="refresh-inspections-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Sync Queue
          </button>
        </div>
      </div>

      <div class="inspection-container">
        <!-- Inspection List -->
        <div class="inspection-list-card">
          <h3 style="font-size: 0.95rem; font-family: var(--font-heading); margin-bottom: 0.85rem; color: var(--text-primary); display: flex; justify-content: space-between;">
            <span>Inspection Feed</span>
            <span id="pending-count-badge" class="badge badge-warning">0 Pending</span>
          </h3>
          <div id="inspections-list-items">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Inspection Detail & Pill Inspector -->
        <div class="inspection-detail-card" id="inspection-detail-panel">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelector('#refresh-inspections-btn').addEventListener('click', () => {
      this.fetchAndRenderInspections();
      this.notify("Optical inspection queue synchronized", "info");
    });

    const chips = this.container.querySelectorAll('#inspection-filter-chips .chip-btn');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentFilter = chip.dataset.filter;
        this.fetchAndRenderInspections();
      });
    });
  }

  async fetchAndRenderInspections() {
    try {
      const response = await apiClient.getInspections(this.currentFilter);
      this.inspectionsData = response.inspections || [];
      
      const pendingBadge = this.container.querySelector('#pending-count-badge');
      if (pendingBadge) {
        pendingBadge.textContent = `${response.pendingReviewCount || 0} Flagged For Review`;
      }

      if (!this.selectedInspectionId || !this.inspectionsData.some(i => i.inspectionId === this.selectedInspectionId)) {
        if (this.inspectionsData.length > 0) {
          // Default to flagged item if present, else first
          const flagged = this.inspectionsData.find(i => i.decisionState === 'FLAGGED_FOR_REVIEW');
          this.selectedInspectionId = flagged ? flagged.inspectionId : this.inspectionsData[0].inspectionId;
        } else {
          this.selectedInspectionId = null;
        }
      }

      this.renderList();
      this.renderDetail();
    } catch (err) {
      this.notify(`Failed to load inspections: ${err.message}`, "error");
    }
  }

  renderList() {
    const list = this.container.querySelector('#inspections-list-items');
    if (this.inspectionsData.length === 0) {
      list.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem; padding:1rem; text-align:center;">No inspections found.</p>`;
      return;
    }

    list.innerHTML = this.inspectionsData.map(item => {
      const isSelected = item.inspectionId === this.selectedInspectionId;
      const isFlagged = item.decisionState === 'FLAGGED_FOR_REVIEW';
      const statusBadge = isFlagged 
        ? '<span class="badge badge-warning">FLAGGED FOR REVIEW</span>'
        : (item.decisionState === 'APPROVED' ? '<span class="badge badge-success">APPROVED</span>' : '<span class="badge badge-stat">REJECTED</span>');

      return `
        <div class="inspection-item ${isSelected ? 'selected' : ''}" data-id="${item.inspectionId}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
            <div>
              <strong style="color: var(--text-primary); font-size: 0.88rem;">${item.medication.name}</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">
                ${item.rxNumber} • Batch: ${item.batchId}
              </div>
            </div>
            ${statusBadge}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-secondary); margin-top: 0.4rem;">
            <span>OCR Confidence: <strong style="color:var(--accent-emerald);">${item.visionMetrics.imprintOcrConfidence}%</strong></span>
            <span>Anomaly Score: <strong style="color:${item.visionMetrics.anomalyScore > 0.1 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}">${item.visionMetrics.anomalyScore}</strong></span>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.inspection-item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        this.selectedInspectionId = itemEl.dataset.id;
        this.renderList();
        this.renderDetail();
      });
    });
  }

  renderDetail() {
    const detailPanel = this.container.querySelector('#inspection-detail-panel');
    const item = this.inspectionsData.find(i => i.inspectionId === this.selectedInspectionId);

    if (!item) {
      detailPanel.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:3rem;">Select an inspection record from the list to view computer vision telemetry and verify pills.</p>`;
      return;
    }

    const pillShapeClass = item.medication.expectedShape.toLowerCase().includes('oval') ? 'oval'
      : (item.medication.expectedShape.toLowerCase().includes('capsule') ? 'capsule'
      : (item.medication.expectedShape.toLowerCase().includes('diamond') ? 'diamond' : ''));

    const isFlagged = item.decisionState === 'FLAGGED_FOR_REVIEW';

    detailPanel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.85rem; margin-bottom: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <h3 style="font-size: 1.15rem; font-family: var(--font-heading);">${item.medication.name} ${item.medication.dosage}</h3>
            <span class="badge ${isFlagged ? 'badge-warning' : 'badge-success'}">${item.decisionState}</span>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 0.2rem;">
            ID: ${item.inspectionId} | Station: ${item.stationId} | NDC: ${item.medication.ndc}
          </p>
        </div>
        <div style="text-align: right; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-secondary);">
          Conveyor Gate:<br/>
          <strong style="color: var(--accent-cyan); font-size: 0.85rem;">${item.conveyorGate}</strong>
        </div>
      </div>

      <!-- Vision Camera Comparison -->
      <div class="optical-feed-split">
        <div class="feed-box">
          <span class="feed-badge">LIVE 120FPS CAMERA FEED</span>
          <div class="crosshair-overlay"></div>
          <div class="simulated-pill-canvas ${pillShapeClass}" style="background-color: ${item.medication.expectedColorHex};">
            <span>${item.medication.expectedImprint}</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.75rem; font-family: var(--font-mono);">
            Detected: ${item.visionMetrics.detectedPillCount} / ${item.visionMetrics.expectedPillCount} Units (${item.visionMetrics.countIntegrity})
          </div>
        </div>

        <div class="feed-box">
          <span class="feed-badge" style="color: var(--accent-emerald);">MASTER FDA NDC SPEC</span>
          <div class="simulated-pill-canvas ${pillShapeClass}" style="background-color: ${item.medication.expectedColorHex}; opacity: 0.95;">
            <span>${item.medication.expectedImprint}</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.75rem; font-family: var(--font-mono);">
            Spec: ${item.medication.expectedShape} (${item.medication.expectedDiameterMm}mm × ${item.medication.expectedThicknessMm}mm)
          </div>
        </div>
      </div>

      <!-- Vision AI Metrics Grid -->
      <div class="vision-metrics-grid">
        <div class="v-metric">
          <div class="v-metric-label">Color Match Index</div>
          <div class="v-metric-val">${item.visionMetrics.colorConfidence}%</div>
        </div>
        <div class="v-metric">
          <div class="v-metric-label">Shape Geometry Match</div>
          <div class="v-metric-val">${item.visionMetrics.shapeConfidence}%</div>
        </div>
        <div class="v-metric">
          <div class="v-metric-label">Imprint OCR Confidence</div>
          <div class="v-metric-val">${item.visionMetrics.imprintOcrConfidence}%</div>
        </div>
        <div class="v-metric">
          <div class="v-metric-label">Diameter Deviation</div>
          <div class="v-metric-val" style="color:${item.visionMetrics.diameterDeviationPct > 0.5 ? 'var(--accent-amber)' : 'var(--accent-emerald)'};">
            ${item.visionMetrics.diameterDeviationPct}% (${item.visionMetrics.averageDiameterMm}mm)
          </div>
        </div>
        <div class="v-metric">
          <div class="v-metric-label">Surface Chipping Flag</div>
          <div class="v-metric-val" style="color:${item.visionMetrics.surfaceChippingDetected ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
            ${item.visionMetrics.surfaceChippingDetected ? 'DETECTED' : 'CLEAR'}
          </div>
        </div>
        <div class="v-metric">
          <div class="v-metric-label">Composite Anomaly Score</div>
          <div class="v-metric-val" style="color:${item.visionMetrics.anomalyScore > 0.1 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
            ${item.visionMetrics.anomalyScore}
          </div>
        </div>
      </div>

      <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem; font-size: 0.8rem; margin-bottom: 1rem;">
        <span style="color: var(--text-muted);">Inspection Notes:</span>
        <div style="color: var(--text-primary); margin-top: 0.2rem;">${item.pharmacistNotes}</div>
        ${item.verifiedBy ? `<div style="font-size: 0.72rem; color: var(--accent-cyan); margin-top: 0.35rem; font-family: var(--font-mono);">Verified By: ${item.verifiedBy}</div>` : ''}
      </div>

      <!-- Pharmacist Sign-Off Actions -->
      <div class="pharmacist-review-panel">
        <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.6rem; color: var(--text-primary);">
          Pharmacist Verification & Downstream Conveyor Gating
        </div>
        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
          <button class="btn btn-success" id="btn-approve-inspection" style="flex: 1;">
            ✓ Approve & Route to Pouch Packager
          </button>
          <button class="btn btn-secondary" id="btn-recount-inspection">
            ↺ Request Recount
          </button>
          <button class="btn btn-danger" id="btn-reject-inspection">
            ✕ Reject to Rework Bin
          </button>
        </div>
      </div>
    `;

    // Bind Decisions
    const approveBtn = detailPanel.querySelector('#btn-approve-inspection');
    const rejectBtn = detailPanel.querySelector('#btn-reject-inspection');
    const recountBtn = detailPanel.querySelector('#btn-recount-inspection');

    approveBtn.addEventListener('click', async () => {
      try {
        await apiClient.submitVerificationDecision(item.inspectionId, {
          decision: "APPROVE_DISPENSE",
          pharmacistLicenseNumber: "RPH-DR-M-VAZQUEZ-9921",
          overrideReason: "Visual verification completed. Chip within acceptable FDA pharmaceutical tolerance."
        });
        this.notify(`Prescription ${item.rxNumber} approved and routed downstream`, "success");
        await this.fetchAndRenderInspections();
      } catch (err) {
        this.notify(`Decision failed: ${err.message}`, "error");
      }
    });

    rejectBtn.addEventListener('click', async () => {
      try {
        await apiClient.submitVerificationDecision(item.inspectionId, {
          decision: "REJECT_TO_REWORK_BIN",
          pharmacistLicenseNumber: "RPH-DR-M-VAZQUEZ-9921",
          overrideReason: "Surface erosion exceeds standard. Routed to automated quarantine bin."
        });
        this.notify(`Prescription ${item.rxNumber} rejected to rework bin`, "warning");
        await this.fetchAndRenderInspections();
      } catch (err) {
        this.notify(`Decision failed: ${err.message}`, "error");
      }
    });

    recountBtn.addEventListener('click', async () => {
      try {
        await apiClient.submitVerificationDecision(item.inspectionId, {
          decision: "REQUEST_MANUAL_RECOUNT",
          pharmacistLicenseNumber: "RPH-DR-M-VAZQUEZ-9921",
          overrideReason: "Manual verification lane secondary check triggered."
        });
        this.notify(`Manual recount requested for ${item.rxNumber}`, "info");
        await this.fetchAndRenderInspections();
      } catch (err) {
        this.notify(`Decision failed: ${err.message}`, "error");
      }
    });
  }
}
