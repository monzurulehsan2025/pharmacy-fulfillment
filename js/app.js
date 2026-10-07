/**
 * PharmPulse Automation Operations Hub - Application Bootstrap
 */

import { BatchManagementView } from './components/batchManagement.js';
import { RoboticsTelemetryView } from './components/roboticsTelemetry.js';
import { OpticalInspectionView } from './components/opticalInspection.js';
import { FleetDeploymentView } from './components/fleetDeployment.js';
import { ObservabilityDashboardView } from './components/observabilityDashboard.js';
import { ApiInspectorView } from './components/apiInspector.js';

class App {
  constructor() {
    this.toastContainer = document.getElementById('toast-container');
    this.initTheme();
    this.initTabs();
    this.initComponents();
    this.bindHeaderControls();
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `
      <span>${icon}</span>
      <span style="flex:1;">${message}</span>
    `;

    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  initTheme() {
    const savedTheme = localStorage.getItem('pharmpulse-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButtonLabel(savedTheme);
  }

  updateThemeButtonLabel(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.title = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`;
    }
  }

  bindHeaderControls() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('pharmpulse-theme', nextTheme);
      this.updateThemeButtonLabel(nextTheme);
      this.showToast(`Switched to ${nextTheme} theme`, 'info');
    });
  }

  initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const activePanel = document.getElementById(`panel-${targetTab}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  }

  initComponents() {
    const notify = (msg, type) => this.showToast(msg, type);

    this.batchView = new BatchManagementView('panel-batches', notify);
    this.roboticsView = new RoboticsTelemetryView('panel-robotics', notify);
    this.opticalView = new OpticalInspectionView('panel-inspection', notify);
    this.fleetView = new FleetDeploymentView('panel-fleet', notify);
    this.observabilityView = new ObservabilityDashboardView('panel-observability', notify);
    this.inspectorView = new ApiInspectorView('panel-inspector', notify);
  }
}

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.pharmpulseApp = new App();
});
