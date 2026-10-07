/**
 * PharmPulse Automation Operations Hub
 * Realistic Hardcoded Data Store for Pharmacy Robotics & Fulfillment Platform
 */

export const INITIAL_DATA = {
  // =========================================================================
  // 1. FULFILLMENT BATCHES & PRESCRIPTION ORDERS DATA
  // =========================================================================
  batches: [
    {
      batchId: "BATCH-2026-0891",
      priority: "STAT",
      status: "dispensing",
      facilityCode: "FAC-CENTRAL-01",
      targetStationId: "CELL-ALPHA-01",
      patientCount: 14,
      totalUnits: 420,
      dispensedUnits: 280,
      createdAt: "2026-10-07T14:15:30Z",
      estimatedCompletionSeconds: 145,
      verificationChecksum: "SHA256:7f8a92b3c4d5e6f7a8b9c0d1e2f3a4b5",
      prescriptions: [
        {
          rxNumber: "RX-8801924",
          patientInitials: "J.D.",
          medicationName: "Atorvastatin Calcium",
          ndc: "00071-0156-23",
          dosage: "20mg Tablet",
          quantity: 90,
          canisterSlot: "CAN-01-A",
          pillShape: "Oval",
          pillColor: "White",
          imprint: "PD 156 20",
          status: "DISPENSING"
        },
        {
          rxNumber: "RX-8801925",
          patientInitials: "M.R.",
          medicationName: "Metformin Hydrochloride",
          ndc: "00591-2718-01",
          dosage: "500mg ER Tablet",
          quantity: 180,
          canisterSlot: "CAN-01-B",
          pillShape: "Round",
          pillColor: "White",
          imprint: "M 500",
          status: "QUEUED"
        },
        {
          rxNumber: "RX-8801926",
          patientInitials: "E.S.",
          medicationName: "Lisinopril",
          ndc: "00006-0207-58",
          dosage: "10mg Tablet",
          quantity: 150,
          canisterSlot: "CAN-01-C",
          pillShape: "Round",
          pillColor: "Pink",
          imprint: "MSD 207",
          status: "QUEUED"
        }
      ]
    },
    {
      batchId: "BATCH-2026-0892",
      priority: "URGENT",
      status: "verification",
      facilityCode: "FAC-CENTRAL-01",
      targetStationId: "CELL-BETA-02",
      patientCount: 8,
      totalUnits: 240,
      dispensedUnits: 240,
      createdAt: "2026-10-07T14:02:11Z",
      estimatedCompletionSeconds: 40,
      verificationChecksum: "SHA256:3c8d19e0a2b4f6c8d0e2a4b6c8d0e2a4",
      prescriptions: [
        {
          rxNumber: "RX-8801918",
          patientInitials: "A.W.",
          medicationName: "Levothyroxine Sodium",
          ndc: "00074-6567-13",
          dosage: "50mcg Tablet",
          quantity: 90,
          canisterSlot: "CAN-02-A",
          pillShape: "Round",
          pillColor: "White",
          imprint: "SYNTHROID 50",
          status: "INSPECTED_PASS"
        },
        {
          rxNumber: "RX-8801919",
          patientInitials: "K.L.",
          medicationName: "Amlodipine Besylate",
          ndc: "00069-1530-68",
          dosage: "5mg Tablet",
          quantity: 90,
          canisterSlot: "CAN-02-C",
          pillShape: "Diamond",
          pillColor: "White",
          imprint: "NORVASC 5",
          status: "AWAITING_SIGN_OFF"
        },
        {
          rxNumber: "RX-8801920",
          patientInitials: "H.B.",
          medicationName: "Omeprazole",
          ndc: "00186-5020-31",
          dosage: "20mg Delayed-Release",
          quantity: 60,
          canisterSlot: "CAN-02-D",
          pillShape: "Capsule",
          pillColor: "Purple/Gold",
          imprint: "PRILOSEC 20",
          status: "AWAITING_SIGN_OFF"
        }
      ]
    },
    {
      batchId: "BATCH-2026-0893",
      priority: "ROUTINE",
      status: "queued",
      facilityCode: "FAC-CENTRAL-01",
      targetStationId: "CELL-GAMMA-03",
      patientCount: 22,
      totalUnits: 880,
      dispensedUnits: 0,
      createdAt: "2026-10-07T14:28:45Z",
      estimatedCompletionSeconds: 420,
      verificationChecksum: "SHA256:91b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
      prescriptions: [
        {
          rxNumber: "RX-8801931",
          patientInitials: "S.M.",
          medicationName: "Losartan Potassium",
          ndc: "00006-0952-54",
          dosage: "50mg Tablet",
          quantity: 180,
          canisterSlot: "CAN-03-A",
          pillShape: "Oval",
          pillColor: "White",
          imprint: "952",
          status: "QUEUED"
        },
        {
          rxNumber: "RX-8801932",
          patientInitials: "T.C.",
          medicationName: "Gabapentin",
          ndc: "00071-0805-24",
          dosage: "300mg Capsule",
          quantity: 270,
          canisterSlot: "CAN-03-B",
          pillShape: "Capsule",
          pillColor: "Yellow",
          imprint: "PD 300",
          status: "QUEUED"
        },
        {
          rxNumber: "RX-8801933",
          patientInitials: "R.G.",
          medicationName: "Hydrochlorothiazide",
          ndc: "00093-0138-01",
          dosage: "25mg Tablet",
          quantity: 90,
          canisterSlot: "CAN-03-C",
          pillShape: "Round",
          pillColor: "Peach",
          imprint: "H 138",
          status: "QUEUED"
        }
      ]
    },
    {
      batchId: "BATCH-2026-0890",
      priority: "ROUTINE",
      status: "completed",
      facilityCode: "FAC-CENTRAL-01",
      targetStationId: "CELL-DELTA-04",
      patientCount: 30,
      totalUnits: 1250,
      dispensedUnits: 1250,
      createdAt: "2026-10-07T13:30:00Z",
      estimatedCompletionSeconds: 0,
      verificationChecksum: "SHA256:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      prescriptions: [
        {
          rxNumber: "RX-8801901",
          patientInitials: "V.P.",
          medicationName: "Sertraline Hydrochloride",
          ndc: "00049-4960-66",
          dosage: "50mg Tablet",
          quantity: 90,
          canisterSlot: "CAN-04-A",
          pillShape: "Oval",
          pillColor: "Blue",
          imprint: "ZOLOFT 50",
          status: "VERIFIED_DISPATCHED"
        },
        {
          rxNumber: "RX-8801902",
          patientInitials: "N.K.",
          medicationName: "Simvastatin",
          ndc: "00006-0740-61",
          dosage: "20mg Tablet",
          quantity: 90,
          canisterSlot: "CAN-04-B",
          pillShape: "Shield",
          pillColor: "Tan",
          imprint: "MSD 740",
          status: "VERIFIED_DISPATCHED"
        }
      ]
    }
  ],

  // =========================================================================
  // 2. ROBOTICS DISPENSING CELLS & CANISTER TELEMETRY DATA
  // =========================================================================
  dispensingCells: [
    {
      cellId: "CELL-ALPHA-01",
      model: "RoboDispense UltraMatrix V4",
      zone: "Zone A - High Velocity",
      status: "ONLINE_DISPENSING",
      activeBatchId: "BATCH-2026-0891",
      dispenseSpeedUnitsSec: 4.8,
      temperatureC: 21.4,
      relativeHumidityPct: 38.2,
      lastCalibrationDate: "2026-10-06T08:00:00Z",
      totalPillsDispensedShift: 14850,
      jamCountToday: 0,
      canisters: [
        {
          slotId: "CAN-01-A",
          medication: "Atorvastatin Calcium 20mg",
          ndc: "00071-0156-23",
          lotNumber: "LOT-ATV-9842",
          expirationDate: "2028-04-30",
          currentCount: 3850,
          capacity: 5000,
          fillPercent: 77,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.98,
          sensorVibrationG: 0.04
        },
        {
          slotId: "CAN-01-B",
          medication: "Metformin HCl 500mg ER",
          ndc: "00591-2718-01",
          lotNumber: "LOT-MET-3321",
          expirationDate: "2027-11-15",
          currentCount: 1240,
          capacity: 6000,
          fillPercent: 20.6,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.94,
          sensorVibrationG: 0.06
        },
        {
          slotId: "CAN-01-C",
          medication: "Lisinopril 10mg",
          ndc: "00006-0207-58",
          lotNumber: "LOT-LIS-4402",
          expirationDate: "2028-01-20",
          currentCount: 4200,
          capacity: 5000,
          fillPercent: 84,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.99,
          sensorVibrationG: 0.03
        },
        {
          slotId: "CAN-01-D",
          medication: "Pantoprazole Sodium 40mg",
          ndc: "00008-0841-81",
          lotNumber: "LOT-PAN-7789",
          expirationDate: "2027-09-30",
          currentCount: 480,
          capacity: 4500,
          fillPercent: 10.6,
          rfidStatus: "LOW_INVENTORY_WARNING",
          singulationAccuracy: 99.91,
          sensorVibrationG: 0.05
        }
      ]
    },
    {
      cellId: "CELL-BETA-02",
      model: "RoboDispense UltraMatrix V4",
      zone: "Zone A - High Velocity",
      status: "ONLINE_IDLE",
      activeBatchId: null,
      dispenseSpeedUnitsSec: 5.2,
      temperatureC: 21.8,
      relativeHumidityPct: 37.9,
      lastCalibrationDate: "2026-10-07T06:30:00Z",
      totalPillsDispensedShift: 18240,
      jamCountToday: 0,
      canisters: [
        {
          slotId: "CAN-02-A",
          medication: "Levothyroxine Sodium 50mcg",
          ndc: "00074-6567-13",
          lotNumber: "LOT-LEV-1190",
          expirationDate: "2028-06-15",
          currentCount: 4100,
          capacity: 5000,
          fillPercent: 82,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.99,
          sensorVibrationG: 0.02
        },
        {
          slotId: "CAN-02-B",
          medication: "Amlodipine Besylate 5mg",
          ndc: "00069-1530-68",
          lotNumber: "LOT-AML-8921",
          expirationDate: "2028-03-10",
          currentCount: 3900,
          capacity: 5000,
          fillPercent: 78,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.97,
          sensorVibrationG: 0.03
        },
        {
          slotId: "CAN-02-C",
          medication: "Omeprazole DR 20mg",
          ndc: "00186-5020-31",
          lotNumber: "LOT-OME-6734",
          expirationDate: "2027-12-01",
          currentCount: 2950,
          capacity: 4000,
          fillPercent: 73.7,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.95,
          sensorVibrationG: 0.04
        },
        {
          slotId: "CAN-02-D",
          medication: "Metoprolol Succinate ER 50mg",
          ndc: "00186-1090-05",
          lotNumber: "LOT-METP-901",
          expirationDate: "2027-08-19",
          currentCount: 3100,
          capacity: 5000,
          fillPercent: 62,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.96,
          sensorVibrationG: 0.03
        }
      ]
    },
    {
      cellId: "CELL-GAMMA-03",
      model: "RoboDispense PrecisionCell V3",
      zone: "Zone B - Specialty Oral Solutes",
      status: "CALIBRATING",
      activeBatchId: null,
      dispenseSpeedUnitsSec: 0.0,
      temperatureC: 22.1,
      relativeHumidityPct: 39.5,
      lastCalibrationDate: "2026-10-07T14:10:00Z",
      totalPillsDispensedShift: 8940,
      jamCountToday: 1,
      canisters: [
        {
          slotId: "CAN-03-A",
          medication: "Losartan Potassium 50mg",
          ndc: "00006-0952-54",
          lotNumber: "LOT-LOS-5532",
          expirationDate: "2028-05-12",
          currentCount: 2150,
          capacity: 4000,
          fillPercent: 53.7,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.88,
          sensorVibrationG: 0.08
        },
        {
          slotId: "CAN-03-B",
          medication: "Gabapentin 300mg",
          ndc: "00071-0805-24",
          lotNumber: "LOT-GAB-9920",
          expirationDate: "2027-10-25",
          currentCount: 1800,
          capacity: 3500,
          fillPercent: 51.4,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.92,
          sensorVibrationG: 0.07
        },
        {
          slotId: "CAN-03-C",
          medication: "Hydrochlorothiazide 25mg",
          ndc: "00093-0138-01",
          lotNumber: "LOT-HCT-2201",
          expirationDate: "2028-02-18",
          currentCount: 3600,
          capacity: 5000,
          fillPercent: 72,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.98,
          sensorVibrationG: 0.03
        }
      ]
    },
    {
      cellId: "CELL-DELTA-04",
      model: "RoboDispense UltraMatrix V4",
      zone: "Zone C - High Volume Pouch",
      status: "ONLINE_DISPENSING",
      activeBatchId: "BATCH-2026-0890",
      dispenseSpeedUnitsSec: 4.9,
      temperatureC: 21.2,
      relativeHumidityPct: 36.8,
      lastCalibrationDate: "2026-10-06T12:00:00Z",
      totalPillsDispensedShift: 21500,
      jamCountToday: 0,
      canisters: [
        {
          slotId: "CAN-04-A",
          medication: "Sertraline HCl 50mg",
          ndc: "00049-4960-66",
          lotNumber: "LOT-SER-7812",
          expirationDate: "2028-07-01",
          currentCount: 4500,
          capacity: 5000,
          fillPercent: 90,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.99,
          sensorVibrationG: 0.02
        },
        {
          slotId: "CAN-04-B",
          medication: "Simvastatin 20mg",
          ndc: "00006-0740-61",
          lotNumber: "LOT-SIM-3104",
          expirationDate: "2027-11-20",
          currentCount: 3750,
          capacity: 5000,
          fillPercent: 75,
          rfidStatus: "AUTHENTICATED",
          singulationAccuracy: 99.97,
          sensorVibrationG: 0.03
        }
      ]
    }
  ],

  // =========================================================================
  // 3. COMPUTER-VISION OPTICAL PILL INSPECTION & VERIFICATION QUEUE
  // =========================================================================
  inspections: [
    {
      inspectionId: "CV-INSPECT-78401",
      rxNumber: "RX-8801918",
      batchId: "BATCH-2026-0892",
      stationId: "VISION-STATION-01",
      cameraFps: 120,
      lightingSpectrumNm: 525,
      timestamp: "2026-10-07T14:22:15Z",
      medication: {
        name: "Levothyroxine Sodium",
        ndc: "00074-6567-13",
        dosage: "50mcg",
        expectedColorHex: "#FFFFFF",
        expectedShape: "Round Bi-Convex",
        expectedDiameterMm: 6.8,
        expectedThicknessMm: 2.9,
        expectedImprint: "SYNTHROID 50"
      },
      visionMetrics: {
        detectedPillCount: 90,
        expectedPillCount: 90,
        countIntegrity: "MATCH_CONFIRMED",
        colorConfidence: 99.8,
        shapeConfidence: 99.9,
        imprintOcrConfidence: 99.4,
        averageDiameterMm: 6.82,
        diameterDeviationPct: 0.29,
        surfaceChippingDetected: false,
        foreignObjectDetected: false,
        anomalyScore: 0.02
      },
      decisionState: "APPROVED",
      verifiedBy: "RPH-SYSTEM-AUTO-ACCEPT",
      pharmacistNotes: "High-confidence multi-angle spectral match.",
      conveyorGate: "GATE-POUCH-PACKAGER-1"
    },
    {
      inspectionId: "CV-INSPECT-78402",
      rxNumber: "RX-8801919",
      batchId: "BATCH-2026-0892",
      stationId: "VISION-STATION-01",
      cameraFps: 120,
      lightingSpectrumNm: 525,
      timestamp: "2026-10-07T14:24:02Z",
      medication: {
        name: "Amlodipine Besylate",
        ndc: "00069-1530-68",
        dosage: "5mg",
        expectedColorHex: "#FAFAFA",
        expectedShape: "Diamond Faceted",
        expectedDiameterMm: 8.5,
        expectedThicknessMm: 3.4,
        expectedImprint: "NORVASC 5"
      },
      visionMetrics: {
        detectedPillCount: 90,
        expectedPillCount: 90,
        countIntegrity: "MATCH_CONFIRMED",
        colorConfidence: 98.6,
        shapeConfidence: 97.4,
        imprintOcrConfidence: 94.1,
        averageDiameterMm: 8.44,
        diameterDeviationPct: 0.70,
        surfaceChippingDetected: true,
        foreignObjectDetected: false,
        anomalyScore: 0.18
      },
      decisionState: "FLAGGED_FOR_REVIEW",
      verifiedBy: null,
      pharmacistNotes: "Minor surface erosion flag on 1 tablet corner. Requires Pharmacist visual sign-off.",
      conveyorGate: "GATE-MANUAL-INSPECTION-LANE"
    },
    {
      inspectionId: "CV-INSPECT-78403",
      rxNumber: "RX-8801920",
      batchId: "BATCH-2026-0892",
      stationId: "VISION-STATION-02",
      cameraFps: 120,
      lightingSpectrumNm: 525,
      timestamp: "2026-10-07T14:26:40Z",
      medication: {
        name: "Omeprazole",
        ndc: "00186-5020-31",
        dosage: "20mg DR",
        expectedColorHex: "#6B21A8",
        expectedShape: "Oblong Capsule",
        expectedDiameterMm: 15.2,
        expectedThicknessMm: 5.8,
        expectedImprint: "PRILOSEC 20"
      },
      visionMetrics: {
        detectedPillCount: 60,
        expectedPillCount: 60,
        countIntegrity: "MATCH_CONFIRMED",
        colorConfidence: 99.2,
        shapeConfidence: 98.9,
        imprintOcrConfidence: 97.8,
        averageDiameterMm: 15.18,
        diameterDeviationPct: 0.13,
        surfaceChippingDetected: false,
        foreignObjectDetected: false,
        anomalyScore: 0.04
      },
      decisionState: "FLAGGED_FOR_REVIEW",
      verifiedBy: null,
      pharmacistNotes: "Batch verification sequence ready for RPh sign-off.",
      conveyorGate: "GATE-STAGE-VERIFY"
    },
    {
      inspectionId: "CV-INSPECT-78399",
      rxNumber: "RX-8801890",
      batchId: "BATCH-2026-0888",
      stationId: "VISION-STATION-01",
      cameraFps: 120,
      lightingSpectrumNm: 525,
      timestamp: "2026-10-07T13:45:10Z",
      medication: {
        name: "Warfarin Sodium",
        ndc: "00056-0170-70",
        dosage: "2mg",
        expectedColorHex: "#93C5FD",
        expectedShape: "Round",
        expectedDiameterMm: 6.4,
        expectedThicknessMm: 2.5,
        expectedImprint: "COUMADIN 2"
      },
      visionMetrics: {
        detectedPillCount: 30,
        expectedPillCount: 30,
        countIntegrity: "MATCH_CONFIRMED",
        colorConfidence: 99.9,
        shapeConfidence: 99.8,
        imprintOcrConfidence: 99.7,
        averageDiameterMm: 6.41,
        diameterDeviationPct: 0.15,
        surfaceChippingDetected: false,
        foreignObjectDetected: false,
        anomalyScore: 0.01
      },
      decisionState: "APPROVED",
      verifiedBy: "RPH-DR-M-VAZQUEZ",
      pharmacistNotes: "High risk medication verified manually under magnification.",
      conveyorGate: "GATE-POUCH-PACKAGER-2"
    }
  ],

  // =========================================================================
  // 4. CUSTOMER-DEPLOYED EDGE PHARMACY NODES & FLEET TELEMETRY
  // =========================================================================
  edgeNodes: [
    {
      nodeId: "NODE-MAYO-CLINIC-EAST",
      facilityName: "Mayo Regional Hospital - Central Dispense Hub",
      facilityType: "ACUTE_CARE_HOSPITAL",
      location: "Rochester, MN",
      runtimeEnvironment: "On-Premises Kubernetes (v1.30.2)",
      agentVersion: "v3.14.2",
      canaryStage: "STABLE_PROD",
      trafficPercent: 100,
      backwardCompatibilityContract: "API-CONTRACT-V2-STRICT",
      nodeHealth: "HEALTHY",
      uptimeDays: 142.6,
      latencyToCloudHubMs: 18.4,
      connectedCellsCount: 16,
      activeAlarms: 0,
      lastHeartbeat: "2026-10-07T14:59:10Z",
      deployedConfigHash: "cfg-8841a0e",
      recentRolloutHistory: [
        { version: "v3.14.2", deployedAt: "2026-09-15", status: "SUCCESS" },
        { version: "v3.14.0", deployedAt: "2026-08-01", status: "SUCCESS" }
      ]
    },
    {
      nodeId: "NODE-MEMORIAL-CENTRAL-01",
      facilityName: "Memorial Sloan Central Pharmacy Automation",
      facilityType: "HIGH_VOLUME_MAIL_ORDER",
      location: "New York, NY",
      runtimeEnvironment: "Bare-Metal Linux Appliance RHEL 9.4",
      agentVersion: "v3.15.0-rc3",
      canaryStage: "CANARY_STAGED",
      trafficPercent: 25,
      backwardCompatibilityContract: "API-CONTRACT-V2-PERMISSIVE",
      nodeHealth: "HEALTHY",
      uptimeDays: 89.2,
      latencyToCloudHubMs: 12.1,
      connectedCellsCount: 32,
      activeAlarms: 0,
      lastHeartbeat: "2026-10-07T14:59:44Z",
      deployedConfigHash: "cfg-9921b7c",
      recentRolloutHistory: [
        { version: "v3.15.0-rc3", deployedAt: "2026-10-05", status: "CANARY_EVALUATION" },
        { version: "v3.14.2", deployedAt: "2026-09-12", status: "SUCCESS" }
      ]
    },
    {
      nodeId: "NODE-METRO-HEALTH-NORTH",
      facilityName: "NorthShore University Health System Fill Lab",
      facilityType: "INTEGRATED_DELIVERY_NETWORK",
      location: "Evanston, IL",
      runtimeEnvironment: "VMware vSphere Virtual Appliance",
      agentVersion: "v3.14.2",
      canaryStage: "STABLE_PROD",
      trafficPercent: 100,
      backwardCompatibilityContract: "API-CONTRACT-V2-STRICT",
      nodeHealth: "WARNING_CALIBRATION_DRIFT",
      uptimeDays: 64.1,
      latencyToCloudHubMs: 24.8,
      connectedCellsCount: 12,
      activeAlarms: 1,
      lastHeartbeat: "2026-10-07T14:58:50Z",
      deployedConfigHash: "cfg-7730e2a",
      recentRolloutHistory: [
        { version: "v3.14.2", deployedAt: "2026-09-20", status: "SUCCESS" }
      ]
    },
    {
      nodeId: "NODE-KAISER-REGIONAL-WEST",
      facilityName: "Kaiser Permanente Centralized Fulfillment Center",
      facilityType: "CENTRAL_FILL_HIGH_THROUGHPUT",
      location: "Downey, CA",
      runtimeEnvironment: "On-Premises OpenShift 4.16",
      agentVersion: "v3.14.2",
      canaryStage: "STABLE_PROD",
      trafficPercent: 100,
      backwardCompatibilityContract: "API-CONTRACT-V2-STRICT",
      nodeHealth: "HEALTHY",
      uptimeDays: 210.4,
      latencyToCloudHubMs: 34.2,
      connectedCellsCount: 48,
      activeAlarms: 0,
      lastHeartbeat: "2026-10-07T14:59:52Z",
      deployedConfigHash: "cfg-6619d44",
      recentRolloutHistory: [
        { version: "v3.14.2", deployedAt: "2026-09-10", status: "SUCCESS" }
      ]
    }
  ],

  // =========================================================================
  // 5. PHARMACY OBSERVABILITY & THROUGHPUT TELEMETRY METRICS
  // =========================================================================
  observability: {
    systemHealth: "OPTIMAL",
    activeFacility: "ENTERPRISE_GLOBAL_AGGREGATE",
    currentTimestamp: "2026-10-07T15:00:00Z",
    kpis: {
      totalPillsDispensedToday: 284920,
      prescriptionsFulfilledToday: 14892,
      activeBatchesInFlight: 3,
      overallAccuracySlaRate: 99.984,
      p99DispenseLatencyMs: 142.6,
      p50DispenseLatencyMs: 44.1,
      singulationErrorPpm: 16.0,
      opticalVisionRejectRatePct: 0.12,
      activeRoboticCellsOnline: "68 / 72",
      telemetryThroughputUnitsMin: 3420
    },
    hourlyThroughput: [
      { hour: "06:00", unitsDispensed: 12400, accuracyRate: 99.98, rejections: 1 },
      { hour: "07:00", unitsDispensed: 24800, accuracyRate: 99.99, rejections: 2 },
      { hour: "08:00", unitsDispensed: 38200, accuracyRate: 99.98, rejections: 4 },
      { hour: "09:00", unitsDispensed: 42100, accuracyRate: 99.97, rejections: 6 },
      { hour: "10:00", unitsDispensed: 45600, accuracyRate: 99.99, rejections: 3 },
      { hour: "11:00", unitsDispensed: 41200, accuracyRate: 99.98, rejections: 4 },
      { hour: "12:00", unitsDispensed: 32900, accuracyRate: 99.99, rejections: 2 },
      { hour: "13:00", unitsDispensed: 44800, accuracyRate: 99.98, rejections: 5 },
      { hour: "14:00", unitsDispensed: 46100, accuracyRate: 99.98, rejections: 3 },
      { hour: "15:00", unitsDispensed: 36820, accuracyRate: 99.99, rejections: 1 }
    ],
    activeAlerts: [
      {
        alertId: "ALRT-9921",
        severity: "INFO",
        source: "CELL-ALPHA-01 / CAN-01-D",
        message: "Canister Pantoprazole 40mg inventory at 10.6% capacity (480 units remaining). Restock scheduled.",
        timestamp: "2026-10-07T14:48:10Z"
      },
      {
        alertId: "ALRT-9918",
        severity: "WARNING",
        source: "NODE-METRO-HEALTH-NORTH",
        message: "Optical laser timing drift +2.4ms detected during diagnostic scan. Auto-calibration pending.",
        timestamp: "2026-10-07T14:32:04Z"
      }
    ]
  }
};
