/**
 * Test Suite for Endpoint 3: Computer-Vision Optical Pill Inspection & Pharmacist Verification API
 * GET /api/v1/verification/inspections & POST /api/v1/verification/inspections/{inspectionId}/decision
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { apiClient } from '../js/apiClient.js';

test('Endpoint 3: Optical Pill Inspection & Verification API - Vision Telemetry and Pharmacist Gating', async (t) => {
  await t.test('GET /api/v1/verification/inspections returns computer vision scan records', async () => {
    const res = await apiClient.getInspections('all');

    assert.ok(res, 'Response should exist');
    assert.strictEqual(typeof res.inspectionsCount, 'number', 'Inspections count should be a number');
    assert.strictEqual(res.cameraStationStatus, 'ALL_ACTIVE_120FPS', 'Camera status should indicate 120 FPS active');
    assert.ok(Array.isArray(res.inspections), 'Inspections should be an array');
    assert.ok(res.inspections.length > 0, 'Inspections array should contain items');

    const item = res.inspections[0];
    assert.ok(item.inspectionId.startsWith('CV-INSPECT-'), 'Inspection ID should have valid format');
    assert.ok(item.medication.name, 'Medication name must be populated');
    assert.strictEqual(typeof item.visionMetrics.colorConfidence, 'number', 'Color confidence should be numeric');
    assert.strictEqual(typeof item.visionMetrics.imprintOcrConfidence, 'number', 'Imprint OCR confidence should be numeric');
    assert.strictEqual(typeof item.visionMetrics.anomalyScore, 'number', 'Anomaly score should be numeric');
    assert.ok(item.conveyorGate.startsWith('GATE-'), 'Conveyor gate routing must be defined');
  });

  await t.test('POST /api/v1/verification/inspections/{id}/decision records pharmacist sign-off and downstream routing', async () => {
    const inspectionId = 'CV-INSPECT-78402';
    const decisionPayload = {
      decision: 'APPROVE_DISPENSE',
      pharmacistLicenseNumber: 'RPH-DR-M-VAZQUEZ-9921',
      overrideReason: 'Automated verification test run: approved for packaging'
    };

    const res = await apiClient.submitVerificationDecision(inspectionId, decisionPayload);

    assert.ok(res, 'Decision response should exist');
    assert.strictEqual(res.inspectionId, inspectionId, 'Inspection ID should match');
    assert.strictEqual(res.decision, 'APPROVE_DISPENSE', 'Recorded decision should match');
    assert.strictEqual(res.routedGate, 'GATE-POUCH-PACKAGER-1', 'Approved pill should be routed to pouch packager gate');
    assert.ok(res.cryptographicAuditSignature.startsWith('SIG-RPH-2026-'), 'Must produce cryptographic audit signature');
  });
});
