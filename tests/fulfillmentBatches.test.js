/**
 * Test Suite for Endpoint 1: Fulfillment Batches API
 * GET /api/v1/fulfillment/batches & POST /api/v1/fulfillment/batches
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { apiClient } from '../js/apiClient.js';

test('Endpoint 1: Fulfillment Batches API - Fetch and Create Batches', async (t) => {
  await t.test('GET /api/v1/fulfillment/batches returns initial batch queue and filters properly', async () => {
    const res = await apiClient.getBatches({ status: 'all', priority: 'all' });
    
    assert.ok(res, 'Response should exist');
    assert.strictEqual(typeof res.totalCount, 'number', 'Total count should be a number');
    assert.strictEqual(res.facilityId, 'FAC-CENTRAL-01', 'Facility ID should match central facility');
    assert.ok(Array.isArray(res.batches), 'Batches should be an array');
    assert.ok(res.batches.length > 0, 'Batches array should contain active records');

    const firstBatch = res.batches[0];
    assert.ok(firstBatch.batchId.startsWith('BATCH-2026-'), 'Batch ID should match expected prefix format');
    assert.ok(['STAT', 'URGENT', 'ROUTINE'].includes(firstBatch.priority), 'Priority should be valid');
    assert.ok(Array.isArray(firstBatch.prescriptions), 'Prescriptions should be an array');
    assert.ok(firstBatch.prescriptions[0].ndc, 'Prescription should contain valid NDC code');
  });

  await t.test('POST /api/v1/fulfillment/batches registers a new dispense batch with cryptographic verification hash', async () => {
    const newBatchPayload = {
      priority: 'STAT',
      targetStationId: 'CELL-ALPHA-01',
      facilityCode: 'FAC-CENTRAL-01',
      patientCount: 6,
      prescriptions: [
        {
          rxNumber: 'RX-TEST-9901',
          patientInitials: 'T.U.',
          medicationName: 'Atorvastatin Calcium',
          ndc: '00071-0156-23',
          dosage: '20mg Tablet',
          quantity: 90,
          canisterSlot: 'CAN-01-A',
          pillShape: 'Oval',
          pillColor: 'White',
          imprint: 'PD 156 20',
          status: 'QUEUED'
        }
      ]
    };

    const createRes = await apiClient.createBatch(newBatchPayload);
    assert.ok(createRes, 'Create response should exist');
    assert.strictEqual(createRes.batch.priority, 'STAT', 'Batch priority should be STAT');
    assert.strictEqual(createRes.batch.targetStationId, 'CELL-ALPHA-01', 'Target station should match');
    assert.strictEqual(createRes.batch.status, 'queued', 'Initial status should be queued');
    assert.ok(createRes.batch.verificationChecksum.startsWith('SHA256:'), 'Batch must include SHA-256 verification hash');
  });
});
