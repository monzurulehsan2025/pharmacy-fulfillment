/**
 * Test Suite for Endpoint 5: Pharmacy Observability & Throughput Telemetry API
 * GET /api/v1/observability/metrics
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { apiClient } from '../js/apiClient.js';

test('Endpoint 5: Observability & SLA Telemetry API - High-Volume Metrics & Alarms', async (t) => {
  await t.test('GET /api/v1/observability/metrics returns throughput KPIs and hourly metrics', async () => {
    const res = await apiClient.getObservabilityMetrics('24h');

    assert.ok(res, 'Response should exist');
    assert.strictEqual(res.timeframe, '24h', 'Timeframe parameter should match');
    assert.ok(res.observability, 'Observability object must be defined');

    const kpis = res.observability.kpis;
    assert.strictEqual(typeof kpis.totalPillsDispensedToday, 'number', 'Total pills dispensed must be numeric');
    assert.ok(kpis.totalPillsDispensedToday > 0, 'Total pills should be greater than zero');
    assert.strictEqual(typeof kpis.prescriptionsFulfilledToday, 'number', 'Prescriptions fulfilled must be numeric');
    assert.strictEqual(typeof kpis.overallAccuracySlaRate, 'number', 'Accuracy SLA rate must be numeric');
    assert.ok(kpis.overallAccuracySlaRate >= 99.0, 'Accuracy SLA rate should be >= 99%');
    assert.strictEqual(typeof kpis.p99DispenseLatencyMs, 'number', 'P99 latency must be numeric');
    assert.strictEqual(typeof kpis.singulationErrorPpm, 'number', 'Singulation PPM error must be numeric');

    assert.ok(Array.isArray(res.observability.hourlyThroughput), 'Hourly throughput must be an array');
    assert.ok(res.observability.hourlyThroughput.length > 0, 'Hourly throughput array should contain data points');

    const firstHour = res.observability.hourlyThroughput[0];
    assert.ok(firstHour.hour, 'Hour label must be defined');
    assert.strictEqual(typeof firstHour.unitsDispensed, 'number', 'Hourly units dispensed must be numeric');

    assert.ok(Array.isArray(res.observability.activeAlerts), 'Active alerts must be an array');
  });
});
