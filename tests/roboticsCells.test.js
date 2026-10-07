/**
 * Test Suite for Endpoint 2: Robotics Dispensing Cells & Canister Telemetry API
 * GET /api/v1/robotics/dispensing-cells & PUT /api/v1/robotics/dispensing-cells/{cellId}/maintenance
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { apiClient } from '../js/apiClient.js';

test('Endpoint 2: Robotics Dispensing Cells API - Telemetry and Maintenance Control', async (t) => {
  await t.test('GET /api/v1/robotics/dispensing-cells returns active dispensing cells and canister metrics', async () => {
    const res = await apiClient.getDispensingCells();

    assert.ok(res, 'Response should exist');
    assert.strictEqual(res.facility, 'FAC-CENTRAL-01', 'Facility code should match');
    assert.ok(Array.isArray(res.cells), 'Cells should be an array');
    assert.ok(res.cells.length > 0, 'Must have at least one active cell');

    const cell = res.cells[0];
    assert.ok(cell.cellId.startsWith('CELL-'), 'Cell ID should have standard prefix');
    assert.strictEqual(typeof cell.dispenseSpeedUnitsSec, 'number', 'Dispense speed should be numeric');
    assert.ok(Array.isArray(cell.canisters), 'Canisters should be an array');

    const canister = cell.canisters[0];
    assert.ok(canister.slotId.startsWith('CAN-'), 'Slot ID should have standard format');
    assert.strictEqual(typeof canister.fillPercent, 'number', 'Fill percentage should be numeric');
    assert.ok(['AUTHENTICATED', 'LOW_INVENTORY_WARNING'].includes(canister.rfidStatus), 'RFID status should be valid');
    assert.ok(canister.singulationAccuracy >= 99.0, 'Singulation accuracy SLA should be at least 99%');
  });

  await t.test('PUT /api/v1/robotics/dispensing-cells/{cellId}/maintenance triggers laser calibration mode', async () => {
    const cellId = 'CELL-ALPHA-01';
    const maintenancePayload = {
      mode: 'CALIBRATE',
      technicianId: 'TECH-4092-ENG',
      notes: 'Automated test suite laser singulation verification'
    };

    const res = await apiClient.updateCellMaintenance(cellId, maintenancePayload);

    assert.ok(res, 'Response should exist');
    assert.strictEqual(res.cell.status, 'CALIBRATING', 'Cell status should change to CALIBRATING');
    assert.strictEqual(res.cell.dispenseSpeedUnitsSec, 0.0, 'Speed should be 0 while calibrating');
    assert.strictEqual(res.auditLog.technicianId, 'TECH-4092-ENG', 'Audit log should record technician ID');
    assert.strictEqual(res.auditLog.status, 'SUCCESS', 'Maintenance status should be SUCCESS');
  });
});
