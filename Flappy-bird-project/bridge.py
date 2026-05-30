# ──────────────────────────────────────────────────────────────────────
# bridge.py — Python WebSocket bridge for serial → browser.
# Reads JSON from ESP32 via serial USB and forwards to the game
# via WebSocket so any modern browser can receive IoT data.
# ──────────────────────────────────────────────────────────────────────
#
# Requirements: pip install websockets pyserial
#
# Usage:
#   python bridge.py                     (auto-detect port)
#   python bridge.py --port COM3         (Windows)
#   python bridge.py --port /dev/ttyUSB0 (Linux/Mac)
#

import asyncio
import json
import sys
import argparse

try:
    import websockets
except ImportError:
    print("Missing dependency: pip install websockets")
    sys.exit(1)

try:
    import serial
    import serial.tools.list_ports
except ImportError:
    print("Missing dependency: pip install pyserial")
    sys.exit(1)

# ── Configuration ──────────────────────────────────────────────────────
BAUD_RATE = 115200
WS_HOST = 'localhost'
WS_PORT = 8765

def find_serial_port():
    """Auto-detect ESP32 serial port."""
    ports = list(serial.tools.list_ports.comports())
    
    # Common ESP32 USB-serial chip identifiers
    esp_keywords = ['CP210', 'CH340', 'FTDI', 'Silicon Labs', 'USB Serial']
    
    for port in ports:
        desc = f"{port.description} {port.manufacturer or ''}"
        for kw in esp_keywords:
            if kw.lower() in desc.lower():
                print(f"[bridge] Found ESP32 on {port.device}: {port.description}")
                return port.device
    
    if ports:
        print(f"[bridge] No ESP32 detected. Available ports:")
        for p in ports:
            print(f"  {p.device}: {p.description}")
        print(f"[bridge] Trying first available port: {ports[0].device}")
        return ports[0].device
    
    return None

async def handler(websocket, ser):
    """Read serial data and forward to WebSocket client."""
    print(f"[bridge] Browser connected: {websocket.remote_address}")
    try:
        while True:
            if ser.in_waiting:
                line = ser.readline().decode('utf-8', errors='replace').strip()
                if line:
                    try:
                        data = json.loads(line)
                        await websocket.send(json.dumps(data))
                    except json.JSONDecodeError:
                        pass  # Skip malformed serial lines
            else:
                await asyncio.sleep(0.01)  # 10ms poll — low latency, low CPU
    except websockets.exceptions.ConnectionClosed:
        print(f"[bridge] Browser disconnected")

async def main(port):
    """Start serial + WebSocket bridge."""
    if not port:
        port = find_serial_port()
    
    if not port:
        print("[bridge] ERROR: No serial port found.")
        print("[bridge] Connect your ESP32 and try again, or specify --port")
        sys.exit(1)
    
    try:
        ser = serial.Serial(port, BAUD_RATE, timeout=0.1)
        print(f"[bridge] Serial: {port} @ {BAUD_RATE} baud")
    except serial.SerialException as e:
        print(f"[bridge] ERROR: Cannot open {port}: {e}")
        sys.exit(1)
    
    print(f"[bridge] WebSocket server: ws://{WS_HOST}:{WS_PORT}")
    print(f"[bridge] Waiting for browser connection...")
    
    async with websockets.serve(
        lambda ws: handler(ws, ser),
        WS_HOST,
        WS_PORT
    ):
        await asyncio.Future()  # Run forever

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='FLAP.AI IoT Bridge')
    parser.add_argument('--port', help='Serial port (e.g. COM3 or /dev/ttyUSB0)')
    parser.add_argument('--ws-port', type=int, default=WS_PORT, help='WebSocket port')
    args = parser.parse_args()
    
    WS_PORT = args.ws_port
    
    try:
        asyncio.run(main(args.port))
    except KeyboardInterrupt:
        print("\n[bridge] Stopped.")
