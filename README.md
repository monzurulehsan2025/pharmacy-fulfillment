# PharmPulse OpsHub — Enterprise Pharmacy Automation & Robotic Fulfillment Orchestrator

**PharmPulse OpsHub** is a modern, high-performance web application and telemetry dashboard designed for high-volume automated pharmacy fulfillment operations, robotic canister singulation, high-speed computer-vision optical pill verification, and customer-deployed on-premises edge dispensary fleet management.

---

## 🛠️ Technology Stack

- **Core & Architecture**: Semantic HTML5, Modular ECMAScript (ES6+), Event-Driven Architecture.
- **Design System & Styling**: Pure Vanilla CSS with CSS Custom Properties, Glassmorphism, Dark/Light theme switching, and responsive grid/flexbox layouts.
- **API Client & Networking**: RESTful API Client layer with simulated network latency, full in-memory data store, and real-time HTTP traffic interception & inspection.
- **Zero-Dependency Runtime**: Runs natively in any modern browser or lightweight HTTP server with zero build tooling required.

---

## 🚀 Quick Start Guide

### Option 1: Run with Node.js / npm
```bash
# Install local static server and launch on port 3000
npm start
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Run with Python 3
```bash
python3 -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 3: Run with npx serve
```bash
npx serve . -p 3000
```

---

## 🧪 Automated Test Suite (1 Test Per Endpoint)

The repository includes an automated test suite covering each of the 5 RESTful API endpoints with full assertion coverage using the native Node.js test runner (`node:test` and `node:assert`).

### Running Tests via Terminal CLI:
```bash
npm test
```

### Test Coverage Summary:
| # | Test Suite | Target Endpoint | Coverage / Assertions |
|---|---|---|---|
| **1** | [`tests/fulfillmentBatches.test.js`](file:///Users/monzurulehsan/lab_v2/iA2/tests/fulfillmentBatches.test.js) | `GET`, `POST /api/v1/fulfillment/batches` | Batch queue retrieval, filtering, priority validation, SHA-256 checksum generation. |
| **2** | [`tests/roboticsCells.test.js`](file:///Users/monzurulehsan/lab_v2/iA2/tests/roboticsCells.test.js) | `GET`, `PUT /api/v1/robotics/dispensing-cells` | Canister fill telemetry, RFID authentication, singulation accuracy SLA (>=99%), laser calibration mode. |
| **3** | [`tests/opticalInspection.test.js`](file:///Users/monzurulehsan/lab_v2/iA2/tests/opticalInspection.test.js) | `GET`, `POST /api/v1/verification/inspections` | 120 FPS vision metrics, imprint OCR confidence, anomaly score, pharmacist sign-off, gate routing. |
| **4** | [`tests/fleetNodes.test.js`](file:///Users/monzurulehsan/lab_v2/iA2/tests/fleetNodes.test.js) | `GET`, `POST /api/v1/telemetry/nodes` | Customer hospital nodes, backward compatibility contracts, staged canary rollout job execution. |
| **5** | [`tests/observabilityMetrics.test.js`](file:///Users/monzurulehsan/lab_v2/iA2/tests/observabilityMetrics.test.js) | `GET /api/v1/observability/metrics` | Daily dispensed units, accuracy SLA rate, P99 dispense latency, singulation error PPM, hourly throughput. |

*In addition, the web interface includes an interactive in-browser test runner located under the **REST API Inspector** tab.*

---

## 📐 Key Functional Modules

1. **🚀 Fulfillment Batches**: Manage high-velocity prescription dispensing queues, canister singulation pipelines, batch priorities (`STAT`, `URGENT`, `ROUTINE`), and view prescription manifests.
2. **🤖 Robotics Dispensing Cells**: Monitor robotic dispensing cells, canister inventory levels, RFID authentication, humidity/temperature telemetry, and trigger laser recalibration or restock cycles.
3. **🔬 Optical Pill Inspection & Pharmacist Verification**: 120 FPS multi-spectral computer vision inspection with imprint OCR confidence, dimensional tolerance matching, anomaly detection, and pharmacist downstream conveyer gating.
4. **🌐 Customer-Deployed Fleet Nodes**: Telemetry and staged canary rollout management across customer hospital networks (Mayo Clinic, Memorial Sloan, NorthShore Health, Kaiser Regional) with automated health gates.
5. **📊 Observability & Telemetry Dashboard**: Real-time throughput (units/hr), P99 dispense latency, singulation error rate (PPM), and active system event feeds.
6. **⚡ Live REST API Inspector**: Real-time HTTP network console to inspect headers, request payloads, response payloads, status codes, and copy JSON directly.

---

## 📡 RESTful API Endpoints Specification

The application consumes 5 core RESTful API endpoints. All request and response payloads are structured with concrete, realistic pharmacy automation data.

---

### Endpoint 1: Dispense Fulfillment Batches & Orders API

#### `GET /api/v1/fulfillment/batches`
Retrieves the active queue of prescription dispensing batches with filtering by status and priority.

**Request Headers:**
```http
GET /api/v1/fulfillment/batches?status=all&priority=all HTTP/1.1
Host: api.pharmpulse.internal
Authorization: Bearer syn_live_9941a87b02c1f
X-Facility-Context: FAC-CENTRAL-01
X-Client-Version: v3.14.2
Accept: application/json
```

**Response Body (`200 OK`):**
```json
{
  "totalCount": 4,
  "facilityId": "FAC-CENTRAL-01",
  "serverTimestamp": "2026-10-07T15:00:00.000Z",
  "batches": [
    {
      "batchId": "BATCH-2026-0891",
      "priority": "STAT",
      "status": "dispensing",
      "facilityCode": "FAC-CENTRAL-01",
      "targetStationId": "CELL-ALPHA-01",
      "patientCount": 14,
      "totalUnits": 420,
      "dispensedUnits": 280,
      "createdAt": "2026-10-07T14:15:30Z",
      "estimatedCompletionSeconds": 145,
      "verificationChecksum": "SHA256:7f8a92b3c4d5e6f7a8b9c0d1e2f3a4b5",
      "prescriptions": [
        {
          "rxNumber": "RX-8801924",
          "patientInitials": "J.D.",
          "medicationName": "Atorvastatin Calcium",
          "ndc": "00071-0156-23",
          "dosage": "20mg Tablet",
          "quantity": 90,
          "canisterSlot": "CAN-01-A",
          "pillShape": "Oval",
          "pillColor": "White",
          "imprint": "PD 156 20",
          "status": "DISPENSING"
        },
        {
          "rxNumber": "RX-8801925",
          "patientInitials": "M.R.",
          "medicationName": "Metformin Hydrochloride",
          "ndc": "00591-2718-01",
          "dosage": "500mg ER Tablet",
          "quantity": 180,
          "canisterSlot": "CAN-01-B",
          "pillShape": "Round",
          "pillColor": "White",
          "imprint": "M 500",
          "status": "QUEUED"
        },
        {
          "rxNumber": "RX-8801926",
          "patientInitials": "E.S.",
          "medicationName": "Lisinopril",
          "ndc": "00006-0207-58",
          "dosage": "10mg Tablet",
          "quantity": 150,
          "canisterSlot": "CAN-01-C",
          "pillShape": "Round",
          "pillColor": "Pink",
          "imprint": "MSD 207",
          "status": "QUEUED"
        }
      ]
    },
    {
      "batchId": "BATCH-2026-0892",
      "priority": "URGENT",
      "status": "verification",
      "facilityCode": "FAC-CENTRAL-01",
      "targetStationId": "CELL-BETA-02",
      "patientCount": 8,
      "totalUnits": 240,
      "dispensedUnits": 240,
      "createdAt": "2026-10-07T14:02:11Z",
      "estimatedCompletionSeconds": 40,
      "verificationChecksum": "SHA256:3c8d19e0a2b4f6c8d0e2a4b6c8d0e2a4",
      "prescriptions": [
        {
          "rxNumber": "RX-8801918",
          "patientInitials": "A.W.",
          "medicationName": "Levothyroxine Sodium",
          "ndc": "00074-6567-13",
          "dosage": "50mcg Tablet",
          "quantity": 90,
          "canisterSlot": "CAN-02-A",
          "pillShape": "Round",
          "pillColor": "White",
          "imprint": "SYNTHROID 50",
          "status": "INSPECTED_PASS"
        },
        {
          "rxNumber": "RX-8801919",
          "patientInitials": "K.L.",
          "medicationName": "Amlodipine Besylate",
          "ndc": "00069-1530-68",
          "dosage": "5mg Tablet",
          "quantity": 90,
          "canisterSlot": "CAN-02-C",
          "pillShape": "Diamond",
          "pillColor": "White",
          "imprint": "NORVASC 5",
          "status": "AWAITING_SIGN_OFF"
        }
      ]
    }
  ]
}
```

---

#### `POST /api/v1/fulfillment/batches`
Registers and dispatches a new prescription fulfillment batch to a robotic cell.

**Request Headers & Body:**
```http
POST /api/v1/fulfillment/batches HTTP/1.1
Host: api.pharmpulse.internal
Authorization: Bearer syn_live_9941a87b02c1f
Content-Type: application/json

{
  "priority": "STAT",
  "targetStationId": "CELL-ALPHA-01",
  "facilityCode": "FAC-CENTRAL-01",
  "patientCount": 12,
  "prescriptions": [
    {
      "rxNumber": "RX-8804912",
      "patientInitials": "B.K.",
      "medicationName": "Atorvastatin Calcium",
      "ndc": "00071-0156-23",
      "dosage": "20mg Tablet",
      "quantity": 90,
      "canisterSlot": "CAN-01-A",
      "pillShape": "Oval",
      "pillColor": "White",
      "imprint": "PD 156 20",
      "status": "QUEUED"
    },
    {
      "rxNumber": "RX-8804913",
      "patientInitials": "L.H.",
      "medicationName": "Lisinopril",
      "ndc": "00006-0207-58",
      "dosage": "10mg Tablet",
      "quantity": 180,
      "canisterSlot": "CAN-01-C",
      "pillShape": "Round",
      "pillColor": "Pink",
      "imprint": "MSD 207",
      "status": "QUEUED"
    }
  ]
}
```

**Response Body (`201 Created`):**
```json
{
  "message": "Dispense fulfillment batch registered successfully.",
  "batch": {
    "batchId": "BATCH-2026-0895",
    "priority": "STAT",
    "status": "queued",
    "facilityCode": "FAC-CENTRAL-01",
    "targetStationId": "CELL-ALPHA-01",
    "patientCount": 12,
    "totalUnits": 270,
    "dispensedUnits": 0,
    "createdAt": "2026-10-07T15:01:12.441Z",
    "estimatedCompletionSeconds": 180,
    "verificationChecksum": "SHA256:4d8a11bc90fa72ce4812f8aa09b34e12",
    "prescriptions": [
      {
        "rxNumber": "RX-8804912",
        "patientInitials": "B.K.",
        "medicationName": "Atorvastatin Calcium",
        "ndc": "00071-0156-23",
        "dosage": "20mg Tablet",
        "quantity": 90,
        "canisterSlot": "CAN-01-A",
        "pillShape": "Oval",
        "pillColor": "White",
        "imprint": "PD 156 20",
        "status": "QUEUED"
      },
      {
        "rxNumber": "RX-8804913",
        "patientInitials": "L.H.",
        "medicationName": "Lisinopril",
        "ndc": "00006-0207-58",
        "dosage": "10mg Tablet",
        "quantity": 180,
        "canisterSlot": "CAN-01-C",
        "pillShape": "Round",
        "pillColor": "Pink",
        "imprint": "MSD 207",
        "status": "QUEUED"
      }
    ]
  },
  "queuePosition": 1,
  "dispatchTimeEstimate": "2026-10-07T15:05:00Z"
}
```

---

### Endpoint 2: Automated Robotics Dispensing Cells & Canister Telemetry API

#### `GET /api/v1/robotics/dispensing-cells`
Returns real-time telemetry from all connected robotic dispensing cells and canister slots.

**Request Headers:**
```http
GET /api/v1/robotics/dispensing-cells HTTP/1.1
Host: api.pharmpulse.internal
Authorization: Bearer syn_live_9941a87b02c1f
X-Facility-Context: FAC-CENTRAL-01
Accept: application/json
```

**Response Body (`200 OK`):**
```json
{
  "facility": "FAC-CENTRAL-01",
  "totalCells": 4,
  "cellsOnline": 3,
  "timestamp": "2026-10-07T15:00:00.000Z",
  "cells": [
    {
      "cellId": "CELL-ALPHA-01",
      "model": "RoboDispense UltraMatrix V4",
      "zone": "Zone A - High Velocity",
      "status": "ONLINE_DISPENSING",
      "activeBatchId": "BATCH-2026-0891",
      "dispenseSpeedUnitsSec": 4.8,
      "temperatureC": 21.4,
      "relativeHumidityPct": 38.2,
      "lastCalibrationDate": "2026-10-06T08:00:00Z",
      "totalPillsDispensedShift": 14850,
      "jamCountToday": 0,
      "canisters": [
        {
          "slotId": "CAN-01-A",
          "medication": "Atorvastatin Calcium 20mg",
          "ndc": "00071-0156-23",
          "lotNumber": "LOT-ATV-9842",
          "expirationDate": "2028-04-30",
          "currentCount": 3850,
          "capacity": 5000,
          "fillPercent": 77,
          "rfidStatus": "AUTHENTICATED",
          "singulationAccuracy": 99.98,
          "sensorVibrationG": 0.04
        },
        {
          "slotId": "CAN-01-B",
          "medication": "Metformin HCl 500mg ER",
          "ndc": "00591-2718-01",
          "lotNumber": "LOT-MET-3321",
          "expirationDate": "2027-11-15",
          "currentCount": 1240,
          "capacity": 6000,
          "fillPercent": 20.6,
          "rfidStatus": "AUTHENTICATED",
          "singulationAccuracy": 99.94,
          "sensorVibrationG": 0.06
        },
        {
          "slotId": "CAN-01-C",
          "medication": "Lisinopril 10mg",
          "ndc": "00006-0207-58",
          "lotNumber": "LOT-LIS-4402",
          "expirationDate": "2028-01-20",
          "currentCount": 4200,
          "capacity": 5000,
          "fillPercent": 84,
          "rfidStatus": "AUTHENTICATED",
          "singulationAccuracy": 99.99,
          "sensorVibrationG": 0.03
        },
        {
          "slotId": "CAN-01-D",
          "medication": "Pantoprazole Sodium 40mg",
          "ndc": "00008-0841-81",
          "lotNumber": "LOT-PAN-7789",
          "expirationDate": "2027-09-30",
          "currentCount": 480,
          "capacity": 4500,
          "fillPercent": 10.6,
          "rfidStatus": "LOW_INVENTORY_WARNING",
          "singulationAccuracy": 99.91,
          "sensorVibrationG": 0.05
        }
      ]
    }
  ]
}
```

---

#### `PUT /api/v1/robotics/dispensing-cells/{cellId}/maintenance`
Triggers laser recalibration, restock authentication, or diagnostic modes on a robotic cell.

**Request Headers & Body:**
```http
PUT /api/v1/robotics/dispensing-cells/CELL-ALPHA-01/maintenance HTTP/1.1
Host: api.pharmpulse.internal
Authorization: Bearer syn_live_9941a87b02c1f
Content-Type: application/json

{
  "mode": "CALIBRATE",
  "technicianId": "TECH-4092-ENG",
  "notes": "Laser count singulation sensor recalibration."
}
```

**Response Body (`200 OK`):**
```json
{
  "message": "Cell CELL-ALPHA-01 maintenance command executed: CALIBRATE",
  "cell": {
    "cellId": "CELL-ALPHA-01",
    "status": "CALIBRATING",
    "dispenseSpeedUnitsSec": 0.0,
    "lastCalibrationDate": "2026-10-07T15:02:10.118Z"
  },
  "auditLog": {
    "technicianId": "TECH-4092-ENG",
    "timestamp": "2026-10-07T15:02:10.119Z",
    "status": "SUCCESS"
  }
}
```

---

### Endpoint 3: Computer-Vision Optical Pill Inspection & Pharmacist Verification API

#### `GET /api/v1/verification/inspections`
Fetches high-speed optical vision verification records and anomaly detection metrics.

**Request Headers:**
```http
GET /api/v1/verification/inspections?state=all HTTP/1.1
Host: api.pharmpulse.internal
Authorization: Bearer syn_live_9941a87b02c1f
Accept: application/json
```

**Response Body (`200 OK`):**
```json
{
  "inspectionsCount": 4,
  "pendingReviewCount": 2,
  "cameraStationStatus": "ALL_ACTIVE_120FPS",
  "inspections": [
    {
      "inspectionId": "CV-INSPECT-78402",
      "rxNumber": "RX-8801919",
      "batchId": "BATCH-2026-0892",
      "stationId": "VISION-STATION-01",
      "cameraFps": 120,
      "lightingSpectrumNm": 525,
      "timestamp": "2026-10-07T14:24:02Z",
      "medication": {
        "name": "Amlodipine Besylate",
        "ndc": "00069-1530-68",
        "dosage": "5mg",
        "expectedColorHex": "#FAFAFA",
        "expectedShape": "Diamond Faceted",
        "expectedDiameterMm": 8.5,
        "expectedThicknessMm": 3.4,
        "expectedImprint": "NORVASC 5"
      },
      "visionMetrics": {
        "detectedPillCount": 90,
        "expectedPillCount": 90,
        "countIntegrity": "MATCH_CONFIRMED",
        "colorConfidence": 98.6,
        "shapeConfidence": 97.4,
        "imprintOcrConfidence": 94.1,
        "averageDiameterMm": 8.44,
        "diameterDeviationPct": 0.7,
        "surfaceChippingDetected": true,
        "foreignObjectDetected": false,
        "anomalyScore": 0.18
      },
      "decisionState": "FLAGGED_FOR_REVIEW",
      "verifiedBy": null,
      "pharmacistNotes": "Minor surface erosion flag on 1 tablet corner. Requires Pharmacist visual sign-off.",
      "conveyorGate": "GATE-MANUAL-INSPECTION-LANE"
    }
  ]
}
```

---

#### `POST /api/v1/verification/inspections/{inspectionId}/decision`
Submits a pharmacist's sign-off decision and routes the prescription to downstream packaging or rework bins.

**Request Headers & Body:**
```http
POST /api/v1/verification/inspections/CV-INSPECT-78402/decision HTTP/1.1
Host: api.pharmpulse.internal
Authorization: Bearer syn_live_9941a87b02c1f
Content-Type: application/json

{
  "decision": "APPROVE_DISPENSE",
  "pharmacistLicenseNumber": "RPH-DR-M-VAZQUEZ-9921",
  "overrideReason": "Visual verification completed. Chip within acceptable FDA tolerance."
}
```

**Response Body (`200 OK`):**
```json
{
  "message": "Verification decision recorded for CV-INSPECT-78402",
  "inspectionId": "CV-INSPECT-78402",
  "decision": "APPROVE_DISPENSE",
  "routedGate": "GATE-POUCH-PACKAGER-1",
  "cryptographicAuditSignature": "SIG-RPH-2026-F89AB210",
  "timestamp": "2026-10-07T15:03:00.184Z"
}
```

---

### Endpoint 4: Customer-Deployed Edge Pharmacy Nodes & Fleet Telemetry API

#### `GET /api/v1/telemetry/nodes`
Returns fleet telemetry across customer-deployed on-premises hospital pharmacy nodes.

**Request Headers:**
```http
GET /api/v1/telemetry/nodes HTTP/1.1
Host: api.pharmpulse.internal
Authorization: Bearer syn_live_9941a87b02c1f
Accept: application/json
```

**Response Body (`200 OK`):**
```json
{
  "totalNodes": 4,
  "fleetHealthSummary": {
    "healthyCount": 3,
    "warningCount": 1,
    "averageLatencyMs": 22.3
  },
  "nodes": [
    {
      "nodeId": "NODE-MAYO-CLINIC-EAST",
      "facilityName": "Mayo Regional Hospital - Central Dispense Hub",
      "facilityType": "ACUTE_CARE_HOSPITAL",
      "location": "Rochester, MN",
      "runtimeEnvironment": "On-Premises Kubernetes (v1.30.2)",
      "agentVersion": "v3.14.2",
      "canaryStage": "STABLE_PROD",
      "trafficPercent": 100,
      "backwardCompatibilityContract": "API-CONTRACT-V2-STRICT",
      "nodeHealth": "HEALTHY",
      "uptimeDays": 142.6,
      "latencyToCloudHubMs": 18.4,
      "connectedCellsCount": 16,
      "activeAlarms": 0,
      "lastHeartbeat": "2026-10-07T14:59:10Z",
      "deployedConfigHash": "cfg-8841a0e",
      "recentRolloutHistory": [
        {
          "version": "v3.14.2",
          "deployedAt": "2026-09-15",
          "status": "SUCCESS"
        }
      ]
    },
    {
      "nodeId": "NODE-MEMORIAL-CENTRAL-01",
      "facilityName": "Memorial Sloan Central Pharmacy Automation",
      "facilityType": "HIGH_VOLUME_MAIL_ORDER",
      "location": "New York, NY",
      "runtimeEnvironment": "Bare-Metal Linux Appliance RHEL 9.4",
      "agentVersion": "v3.15.0-rc3",
      "canaryStage": "CANARY_STAGED",
      "trafficPercent": 25,
      "backwardCompatibilityContract": "API-CONTRACT-V2-PERMISSIVE",
      "nodeHealth": "HEALTHY",
      "uptimeDays": 89.2,
      "latencyToCloudHubMs": 12.1,
      "connectedCellsCount": 32,
      "activeAlarms": 0,
      "lastHeartbeat": "2026-10-07T14:59:44Z",
      "deployedConfigHash": "cfg-9921b7c",
      "recentRolloutHistory": [
        {
          "version": "v3.15.0-rc3",
          "deployedAt": "2026-10-05",
          "status": "CANARY_EVALUATION"
        }
      ]
    }
  ]
}
```

---

#### `POST /api/v1/telemetry/nodes/{nodeId}/rollout`
Triggers a staged canary software rollout or firmware update to an edge dispensary node.

**Request Headers & Body:**
```http
POST /api/v1/telemetry/nodes/NODE-MAYO-CLINIC-EAST/rollout HTTP/1.1
Host: api.pharmpulse.internal
Authorization: Bearer syn_live_9941a87b02c1f
Content-Type: application/json

{
  "targetVersion": "v3.15.0-rc3",
  "rolloutStrategy": "CANARY_STAGED",
  "trafficPercentage": 25,
  "autoRollbackOnHealthDegradation": true
}
```

**Response Body (`200 OK`):**
```json
{
  "jobId": "ROLLOUT-JOB-1760000000000",
  "nodeId": "NODE-MAYO-CLINIC-EAST",
  "targetVersion": "v3.15.0-rc3",
  "rolloutStrategy": "CANARY_STAGED",
  "trafficAllocation": "25%",
  "safetyRollbackThresholdPct": 99.5,
  "status": "IN_PROGRESS",
  "deploymentPipes": [
    "IaC-Terraform-Apply",
    "Ansible-CellConfig",
    "Health-Canary-Gate"
  ]
}
```

---

### Endpoint 5: Pharmacy Fulfillment Observability & SLA Telemetry API

#### `GET /api/v1/observability/metrics`
Fetches global fulfillment throughput, P99 robotic dispense latencies, singulation PPM accuracy, and active facility alarms.

**Request Headers:**
```http
GET /api/v1/observability/metrics?timeframe=24h HTTP/1.1
Host: api.pharmpulse.internal
Authorization: Bearer syn_live_9941a87b02c1f
Accept: application/json
```

**Response Body (`200 OK`):**
```json
{
  "timeframe": "24h",
  "generatedAt": "2026-10-07T15:00:00.000Z",
  "observability": {
    "systemHealth": "OPTIMAL",
    "activeFacility": "ENTERPRISE_GLOBAL_AGGREGATE",
    "currentTimestamp": "2026-10-07T15:00:00Z",
    "kpis": {
      "totalPillsDispensedToday": 284920,
      "prescriptionsFulfilledToday": 14892,
      "activeBatchesInFlight": 3,
      "overallAccuracySlaRate": 99.984,
      "p99DispenseLatencyMs": 142.6,
      "p50DispenseLatencyMs": 44.1,
      "singulationErrorPpm": 16.0,
      "opticalVisionRejectRatePct": 0.12,
      "activeRoboticCellsOnline": "68 / 72",
      "telemetryThroughputUnitsMin": 3420
    },
    "hourlyThroughput": [
      { "hour": "06:00", "unitsDispensed": 12400, "accuracyRate": 99.98, "rejections": 1 },
      { "hour": "07:00", "unitsDispensed": 24800, "accuracyRate": 99.99, "rejections": 2 },
      { "hour": "08:00", "unitsDispensed": 38200, "accuracyRate": 99.98, "rejections": 4 },
      { "hour": "09:00", "unitsDispensed": 42100, "accuracyRate": 99.97, "rejections": 6 },
      { "hour": "10:00", "unitsDispensed": 45600, "accuracyRate": 99.99, "rejections": 3 },
      { "hour": "11:00", "unitsDispensed": 41200, "accuracyRate": 99.98, "rejections": 4 },
      { "hour": "12:00", "unitsDispensed": 32900, "accuracyRate": 99.99, "rejections": 2 },
      { "hour": "13:00", "unitsDispensed": 44800, "accuracyRate": 99.98, "rejections": 5 },
      { "hour": "14:00", "unitsDispensed": 46100, "accuracyRate": 99.98, "rejections": 3 },
      { "hour": "15:00", "unitsDispensed": 36820, "accuracyRate": 99.99, "rejections": 1 }
    ],
    "activeAlerts": [
      {
        "alertId": "ALRT-9921",
        "severity": "INFO",
        "source": "CELL-ALPHA-01 / CAN-01-D",
        "message": "Canister Pantoprazole 40mg inventory at 10.6% capacity (480 units remaining). Restock scheduled.",
        "timestamp": "2026-10-07T14:48:10Z"
      },
      {
        "alertId": "ALRT-9918",
        "severity": "WARNING",
        "source": "NODE-METRO-HEALTH-NORTH",
        "message": "Optical laser timing drift +2.4ms detected during diagnostic scan. Auto-calibration pending.",
        "timestamp": "2026-10-07T14:32:04Z"
      }
    ]
  }
}
```

---

## 🔒 Security & Verification Controls

- **Cryptographic Batch Checksums**: Every dispense batch is bound with SHA-256 verification hashes.
- **RFID Token Authentication**: Canister slots validate hardware RFID tokens prior to releasing mechanical gating.
- **Pharmacist Digital Signatures**: Optical inspection overrides generate immutable audit trail entries (`SIG-RPH-*`).
- **Telemetry Health Gates**: Automated canary rollback triggers whenever singulation error rate exceeds 5 PPM.

---

## 📄 License
MIT License. Open-source enterprise pharmacy automation framework.
