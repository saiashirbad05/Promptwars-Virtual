// ──────────────────────────────────────────────────────────────────────
// iot.js — WebSocket client for IoT hardware communication.
// Connects to ws://localhost:8765 (Python bridge).
// Handles button, joystick, biometric, and environment messages.
// The game works without IoT — a quiet, dignified fallback.
// ──────────────────────────────────────────────────────────────────────

import { showToast } from './ui.js';

let ws = null;
let connected = false;
let reconnectTimer = null;
const WS_URL = 'ws://localhost:8765';
const RECONNECT_INTERVAL = 5000; // 5 seconds

// Callbacks for different message types
let onButton = null;
let onJoystick = null;
let onBiometric = null;
let onEnvironment = null;

/**
 * Set callbacks for IoT message types.
 */
export function setIoTCallbacks({ button, joystick, biometric, environment }) {
  onButton = button || null;
  onJoystick = joystick || null;
  onBiometric = biometric || null;
  onEnvironment = environment || null;
}

/**
 * Check if IoT is connected.
 */
export function isIoTConnected() {
  return connected;
}

/**
 * Initialize the WebSocket connection.
 * Silently fails if the bridge is not running.
 */
export function initIoT() {
  if (ws) return;
  connect();
}

function connect() {
  try {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      connected = true;
      if (reconnectTimer) {
        clearInterval(reconnectTimer);
        reconnectTimer = null;
      }
      showToast('IoT connected ❤', 2000);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleMessage(data);
      } catch {
        // Silently ignore malformed messages
      }
    };

    ws.onclose = () => {
      connected = false;
      ws = null;
      scheduleReconnect();
    };

    ws.onerror = () => {
      connected = false;
      if (ws) {
        ws.close();
        ws = null;
      }
      // Only show toast on first failure, not every reconnect attempt
      if (!reconnectTimer) {
        showToast('IoT not connected — classic mode active', 3000);
      }
      scheduleReconnect();
    };
  } catch {
    connected = false;
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setInterval(() => {
    if (!connected) {
      connect();
    } else {
      clearInterval(reconnectTimer);
      reconnectTimer = null;
    }
  }, RECONNECT_INTERVAL);
}

function handleMessage(data) {
  switch (data.type) {
    case 'button':
      if (onButton) onButton(data);
      break;
    case 'joystick':
      if (onJoystick) onJoystick(data);
      break;
    case 'biometric':
      if (onBiometric) onBiometric(data);
      break;
    case 'environment':
      if (onEnvironment) onEnvironment(data);
      break;
  }
}

/**
 * Disconnect IoT cleanly.
 */
export function disconnectIoT() {
  if (reconnectTimer) {
    clearInterval(reconnectTimer);
    reconnectTimer = null;
  }
  if (ws) {
    ws.close();
    ws = null;
  }
  connected = false;
}
