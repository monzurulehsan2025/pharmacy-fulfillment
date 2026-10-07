/**
 * PharmPulse Automation Operations Hub
 * RESTful API Client & Network Interceptor Layer
 * Consumes 5 RESTful Endpoints with concrete data and simulated network latencies.
 */

import { INITIAL_DATA } from './mockData.js';

class ApiClient {
  constructor() {
    // Clone initial dataset into working memory
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.networkListeners = [];
    this.simulatedLatencyMs = 180;
  }

  // Subscribe to live API network traffic (for the API Inspector UI)
  onNetworkActivity(callback) {
    this.networkListeners.push(callback);
  }

  _notifyNetwork(record) {
    this.networkListeners.forEach(cb => {
      try {
        cb(record);
      } catch (e) {
        console.error("Network listener error:", e);
      }
    });
  }

  // Simulates realistic network delay
  async _delay(ms = this.simulatedLatencyMs) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Internal helper to trace requests
  async _traceRequest(method, url, requestPayload, handler) {
    const startTime = performance.now();
    const requestId = `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const headers = {
      "Content-Type": "application/json",
      "X-Client-Version": "v3.14.2",
      "X-Facility-Context": "FAC-CENTRAL-01",
      "X-Request-ID": requestId,
      "Authorization": "Bearer syn_live_9941a87b02c1f"
    };

    let responsePayload = null;
    let statusCode = 200;
    let statusText = "OK";

    try {
      await this._delay();
      const result = await handler();
      responsePayload = result.data;
      statusCode = result.status || 200;
      statusText = result.statusText || (statusCode === 201 ? "Created" : "OK");
      return responsePayload;
    } catch (err) {
      statusCode = 500;
      statusText = "Internal Server Error";
      responsePayload = { error: err.message };
      throw err;
    } finally {
      const durationMs = Math.round(performance.now() - startTime);
      this._notifyNetwork({
        id: requestId,
        timestamp: new Date().toISOString(),
        method,
        url,
        headers,
        requestPayload: requestPayload || null,
        statusCode,
        statusText,
        durationMs,
        responsePayload
      });
    }
  }

  // =========================================================================
  // ENDPOINT 1: FULFILLMENT BATCHES & PRESCRIPTION ORDERS
  // GET  /api/v1/fulfillment/batches
  // POST /api/v1/fulfillment/batches
  // =========================================================================
  async getBatches(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `/api/v1/fulfillment/batches${queryParams ? '?' + queryParams : ''}`;

    return this._traceRequest("GET", url, null, async () => {
      let filtered = [...this.data.batches];
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(b => b.status === filters.status);
      }
      if (filters.priority && filters.priority !== 'all') {
        filtered = filtered.filter(b => b.priority === filters.priority);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(b => 
          b.batchId.toLowerCase().includes(q) ||
          b.targetStationId.toLowerCase().includes(q) ||
          b.prescriptions.some(rx => rx.medicationName.toLowerCase().includes(q) || rx.rxNumber.toLowerCase().includes(q))
        );
      }

      return {
        status: 200,
        statusText: "OK",
        data: {
          totalCount: filtered.length,
          facilityId: "FAC-CENTRAL-01",
          serverTimestamp: new Date().toISOString(),
          batches: filtered
        }
      };
    });
  }

  async createBatch(batchData) {
    const url = `/api/v1/fulfillment/batches`;

    return this._traceRequest("POST", url, batchData, async () => {
      const newBatchId = `BATCH-2026-${String(894 + this.data.batches.length).padStart(4, '0')}`;
      const totalUnits = (batchData.prescriptions || []).reduce((acc, p) => acc + (p.quantity || 0), 0);

      const newBatch = {
        batchId: newBatchId,
        priority: batchData.priority || "ROUTINE",
        status: "queued",
        facilityCode: batchData.facilityCode || "FAC-CENTRAL-01",
        targetStationId: batchData.targetStationId || "CELL-ALPHA-01",
        patientCount: batchData.patientCount || (batchData.prescriptions ? batchData.prescriptions.length : 5),
        totalUnits: totalUnits || 360,
        dispensedUnits: 0,
        createdAt: new Date().toISOString(),
        estimatedCompletionSeconds: 180,
        verificationChecksum: `SHA256:${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
        prescriptions: batchData.prescriptions || [
          {
            rxNumber: `RX-880${Math.floor(1000 + Math.random() * 9000)}`,
            patientInitials: "R.B.",
            medicationName: "Atorvastatin Calcium",
            ndc: "00071-0156-23",
            dosage: "20mg Tablet",
            quantity: 90,
            canisterSlot: "CAN-01-A",
            pillShape: "Oval",
            pillColor: "White",
            imprint: "PD 156 20",
            status: "QUEUED"
          }
        ]
      };

      this.data.batches.unshift(newBatch);

      return {
        status: 201,
        statusText: "Created",
        data: {
          message: "Dispense fulfillment batch registered successfully.",
          batch: newBatch,
          queuePosition: 1,
          dispatchTimeEstimate: "2026-10-07T15:05:00Z"
        }
      };
    });
  }

  // Advance batch status progression
  async advanceBatchStatus(batchId) {
    const batch = this.data.batches.find(b => b.batchId === batchId);
    if (!batch) throw new Error(`Batch ${batchId} not found`);

    const url = `/api/v1/fulfillment/batches/${batchId}/advance-state`;
    return this._traceRequest("POST", url, { action: "ADVANCE_STAGE" }, async () => {
      if (batch.status === "queued") {
        batch.status = "dispensing";
        batch.dispensedUnits = Math.round(batch.totalUnits * 0.5);
      } else if (batch.status === "dispensing") {
        batch.status = "verification";
        batch.dispensedUnits = batch.totalUnits;
      } else if (batch.status === "verification") {
        batch.status = "completed";
      }

      return {
        status: 200,
        data: {
          message: `Batch ${batchId} transitioned to ${batch.status}`,
          batch
        }
      };
    });
  }

  // =========================================================================
  // ENDPOINT 2: ROBOTICS DISPENSING CELLS & CANISTER TELEMETRY
  // GET /api/v1/robotics/dispensing-cells
  // PUT /api/v1/robotics/dispensing-cells/{cellId}/maintenance
  // =========================================================================
  async getDispensingCells() {
    const url = `/api/v1/robotics/dispensing-cells`;

    return this._traceRequest("GET", url, null, async () => {
      return {
        status: 200,
        data: {
          facility: "FAC-CENTRAL-01",
          totalCells: this.data.dispensingCells.length,
          cellsOnline: this.data.dispensingCells.filter(c => c.status.startsWith("ONLINE")).length,
          timestamp: new Date().toISOString(),
          cells: this.data.dispensingCells
        }
      };
    });
  }

  async updateCellMaintenance(cellId, maintenancePayload) {
    const url = `/api/v1/robotics/dispensing-cells/${cellId}/maintenance`;

    return this._traceRequest("PUT", url, maintenancePayload, async () => {
      const cell = this.data.dispensingCells.find(c => c.cellId === cellId);
      if (!cell) throw new Error(`Robotic Cell ${cellId} not found`);

      if (maintenancePayload.mode === "CALIBRATE") {
        cell.status = "CALIBRATING";
        cell.dispenseSpeedUnitsSec = 0.0;
        cell.lastCalibrationDate = new Date().toISOString();
      } else if (maintenancePayload.mode === "RESUME_ONLINE") {
        cell.status = "ONLINE_DISPENSING";
        cell.dispenseSpeedUnitsSec = 4.8;
      } else if (maintenancePayload.mode === "REFILL_RESTOCK") {
        cell.canisters.forEach(can => {
          can.currentCount = can.capacity;
          can.fillPercent = 100;
          can.rfidStatus = "AUTHENTICATED";
        });
      }

      return {
        status: 200,
        data: {
          message: `Cell ${cellId} maintenance command executed: ${maintenancePayload.mode}`,
          cell,
          auditLog: {
            technicianId: maintenancePayload.technicianId || "TECH-4092",
            timestamp: new Date().toISOString(),
            status: "SUCCESS"
          }
        }
      };
    });
  }

  // =========================================================================
  // ENDPOINT 3: COMPUTER-VISION OPTICAL PILL INSPECTION & PHARMACIST SIGN-OFF
  // GET  /api/v1/verification/inspections
  // POST /api/v1/verification/inspections/{inspectionId}/decision
  // =========================================================================
  async getInspections(filter = "all") {
    const query = filter !== "all" ? `?state=${filter}` : "";
    const url = `/api/v1/verification/inspections${query}`;

    return this._traceRequest("GET", url, null, async () => {
      let items = [...this.data.inspections];
      if (filter === "pending") {
        items = items.filter(i => i.decisionState === "FLAGGED_FOR_REVIEW");
      } else if (filter === "approved") {
        items = items.filter(i => i.decisionState === "APPROVED");
      }

      return {
        status: 200,
        data: {
          inspectionsCount: items.length,
          pendingReviewCount: this.data.inspections.filter(i => i.decisionState === "FLAGGED_FOR_REVIEW").length,
          cameraStationStatus: "ALL_ACTIVE_120FPS",
          inspections: items
        }
      };
    });
  }

  async submitVerificationDecision(inspectionId, decisionPayload) {
    const url = `/api/v1/verification/inspections/${inspectionId}/decision`;

    return this._traceRequest("POST", url, decisionPayload, async () => {
      const inspectRecord = this.data.inspections.find(i => i.inspectionId === inspectionId);
      if (!inspectRecord) throw new Error(`Inspection ${inspectionId} not found`);

      if (decisionPayload.decision === "APPROVE_DISPENSE") {
        inspectRecord.decisionState = "APPROVED";
        inspectRecord.verifiedBy = decisionPayload.pharmacistLicenseNumber || "RPH-992140";
        inspectRecord.conveyorGate = "GATE-POUCH-PACKAGER-1";
      } else if (decisionPayload.decision === "REJECT_TO_REWORK_BIN") {
        inspectRecord.decisionState = "REJECTED_REWORK";
        inspectRecord.verifiedBy = decisionPayload.pharmacistLicenseNumber || "RPH-992140";
        inspectRecord.conveyorGate = "GATE-REJECT-BIN-2";
      } else if (decisionPayload.decision === "REQUEST_MANUAL_RECOUNT") {
        inspectRecord.decisionState = "MANUAL_RECOUNT_REQUESTED";
        inspectRecord.verifiedBy = decisionPayload.pharmacistLicenseNumber || "RPH-992140";
        inspectRecord.conveyorGate = "GATE-MANUAL-INSPECTION-LANE";
      }

      inspectRecord.pharmacistNotes = decisionPayload.overrideReason || inspectRecord.pharmacistNotes;

      return {
        status: 200,
        data: {
          message: `Verification decision recorded for ${inspectionId}`,
          inspectionId,
          decision: decisionPayload.decision,
          routedGate: inspectRecord.conveyorGate,
          cryptographicAuditSignature: `SIG-RPH-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          timestamp: new Date().toISOString()
        }
      };
    });
  }

  // =========================================================================
  // ENDPOINT 4: CUSTOMER-DEPLOYED EDGE PHARMACY NODES & FLEET TELEMETRY
  // GET  /api/v1/telemetry/nodes
  // POST /api/v1/telemetry/nodes/{nodeId}/rollout
  // =========================================================================
  async getEdgeNodes() {
    const url = `/api/v1/telemetry/nodes`;

    return this._traceRequest("GET", url, null, async () => {
      return {
        status: 200,
        data: {
          totalNodes: this.data.edgeNodes.length,
          fleetHealthSummary: {
            healthyCount: this.data.edgeNodes.filter(n => n.nodeHealth === "HEALTHY").length,
            warningCount: this.data.edgeNodes.filter(n => n.nodeHealth.includes("WARNING")).length,
            averageLatencyMs: 22.3
          },
          nodes: this.data.edgeNodes
        }
      };
    });
  }

  async triggerNodeRollout(nodeId, rolloutPayload) {
    const url = `/api/v1/telemetry/nodes/${nodeId}/rollout`;

    return this._traceRequest("POST", url, rolloutPayload, async () => {
      const node = this.data.edgeNodes.find(n => n.nodeId === nodeId);
      if (!node) throw new Error(`Node ${nodeId} not found`);

      node.agentVersion = rolloutPayload.targetVersion || "v3.15.0";
      node.canaryStage = rolloutPayload.rolloutStrategy || "CANARY_STAGED";
      node.trafficPercent = rolloutPayload.trafficPercentage || 50;
      node.recentRolloutHistory.unshift({
        version: node.agentVersion,
        deployedAt: new Date().toISOString().split('T')[0],
        status: "ROLLOUT_ACTIVE"
      });

      return {
        status: 200,
        data: {
          jobId: `ROLLOUT-JOB-${Date.now()}`,
          nodeId,
          targetVersion: node.agentVersion,
          rolloutStrategy: node.canaryStage,
          trafficAllocation: `${node.trafficPercent}%`,
          safetyRollbackThresholdPct: 99.5,
          status: "IN_PROGRESS",
          deploymentPipes: ["IaC-Terraform-Apply", "Ansible-CellConfig", "Health-Canary-Gate"]
        }
      };
    });
  }

  // =========================================================================
  // ENDPOINT 5: PHARMACY OBSERVABILITY & THROUGHPUT TELEMETRY METRICS
  // GET /api/v1/observability/metrics
  // =========================================================================
  async getObservabilityMetrics(timeframe = "24h") {
    const url = `/api/v1/observability/metrics?timeframe=${timeframe}`;

    return this._traceRequest("GET", url, null, async () => {
      // Small simulated live fluctuation
      const liveData = JSON.parse(JSON.stringify(this.data.observability));
      const jitter = (Math.random() * 6 - 3).toFixed(1);
      liveData.kpis.telemetryThroughputUnitsMin = Math.round(3420 + Number(jitter) * 10);
      liveData.kpis.totalPillsDispensedToday += Math.floor(Math.random() * 5);

      return {
        status: 200,
        data: {
          timeframe,
          generatedAt: new Date().toISOString(),
          observability: liveData
        }
      };
    });
  }
}

export const apiClient = new ApiClient();
