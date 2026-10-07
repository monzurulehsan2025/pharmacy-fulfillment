/**
 * Test Suite for Endpoint 4: Customer-Deployed Edge Pharmacy Nodes & Fleet Telemetry API
 * GET /api/v1/telemetry/nodes & POST /api/v1/telemetry/nodes/{nodeId}/rollout
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { apiClient } from '../js/apiClient.js';

test('Endpoint 4: Edge Pharmacy Fleet Nodes API - Telemetry and Canary Rollout', async (t) => {
  await t.test('GET /api/v1/telemetry/nodes retrieves customer hospital node states', async () => {
    const res = await apiClient.getEdgeNodes();

    assert.ok(res, 'Response should exist');
    assert.strictEqual(typeof res.totalNodes, 'number', 'Total nodes should be a number');
    assert.ok(res.fleetHealthSummary, 'Fleet health summary must exist');
    assert.ok(Array.isArray(res.nodes), 'Nodes should be an array');
    assert.ok(res.nodes.length > 0, 'Nodes array should not be empty');

    const node = res.nodes[0];
    assert.ok(node.nodeId.startsWith('NODE-'), 'Node ID should follow standard prefix');
    assert.ok(node.facilityName, 'Facility name must be defined');
    assert.ok(node.runtimeEnvironment, 'Runtime environment must be defined');
    assert.ok(node.backwardCompatibilityContract.startsWith('API-CONTRACT-'), 'Contract version should be specified');
    assert.strictEqual(typeof node.latencyToCloudHubMs, 'number', 'Latency should be numeric');
  });

  await t.test('POST /api/v1/telemetry/nodes/{nodeId}/rollout schedules canary deployment pipeline', async () => {
    const nodeId = 'NODE-MAYO-CLINIC-EAST';
    const rolloutPayload = {
      targetVersion: 'v3.15.0-rc3',
      rolloutStrategy: 'CANARY_STAGED',
      trafficPercentage: 30,
      autoRollbackOnHealthDegradation: true
    };

    const res = await apiClient.triggerNodeRollout(nodeId, rolloutPayload);

    assert.ok(res, 'Rollout response should exist');
    assert.ok(res.jobId.startsWith('ROLLOUT-JOB-'), 'Job ID should be generated');
    assert.strictEqual(res.nodeId, nodeId, 'Target node ID should match');
    assert.strictEqual(res.targetVersion, 'v3.15.0-rc3', 'Target version should match');
    assert.strictEqual(res.rolloutStrategy, 'CANARY_STAGED', 'Strategy should match');
    assert.strictEqual(res.status, 'IN_PROGRESS', 'Job status should be IN_PROGRESS');
    assert.ok(Array.isArray(res.deploymentPipes), 'Deployment pipeline stages must be present');
  });
});
