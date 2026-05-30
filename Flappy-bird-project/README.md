# Flappy-Bird-Project 

**Human-Adaptive Flappy Bird — Version 2.0**  
Developed for the GDG × Hack2Skill Promptwars Virtual Hackathon

VISIT THE GAME IN -[ flappyaipromptarsvirtual.netlify.app ]

## Overview

FLAPPY BIRD  is a complete reimagination of the classic Flappy Bird arcade game, engineered to respond dynamically to the player in real time. It integrates biometric feedback, ambient environmental sensing, and AI-generated game worlds powered by the Google Gemini API and physical IoT hardware via an ESP32 microcontroller.

The project bridges retro game mechanics with modern human-computer interaction — producing a gameplay experience that is unique to each player, each session, and each environment.

> All AI and IoT features are fully optional. The game operates standalone with no API key, no hardware, and no build tooling.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Controls](#controls)
- [Gemini AI Integrations](#gemini-ai-integrations)
- [IoT Hardware Setup](#iot-hardware-setup)
- [Game Physics](#game-physics)
- [Prerequisites](#prerequisites)
- [License](#license)

---

## Features

| Category | Capability |
|---|---|
| Biometric Awareness | Adapts gameplay to real-time heart rate and galvanic skin response (GSR) |
| Environment Sensing | Responds to ambient light level, background noise, and motion detection |
| AI World Generation | Generates unique themes, lore, and chapter structures per run via Gemini |
| Live AI Narration | Real-time voice commentary driven by gameplay events |
| Ghost Bird AI | Shadow Faby learns from play history and demonstrates an optimal path |
| Face-Controlled Input | Flap via head-nod gestures using MediaPipe FaceMesh, processed locally in-browser |
| Zero Build Requirement | Pure HTML5 and vanilla JavaScript — no framework, no bundler, no compilation |

---

## Quick Start

No build tools or package manager are required.

```bash
# Option 1 — Open directly in browser
open index.html

# Option 2 — Serve locally (recommended for ES module support)
npx serve .
# Visit http://localhost:3000
```

### Enabling Gemini AI Features (Optional)

The game ships with handcrafted fallback worlds and runs fully without an API key. To activate AI-powered world generation, narration, and shadow bird features, set your Gemini API key once via the browser console:

```js
localStorage.setItem('flapai_gemini_key', 'YOUR_GEMINI_API_KEY');
```

Obtain a free API key at [Google AI Studio](https://aistudio.google.com).

---

## Project Structure

```
FLAP.AI PROJECT FOR PROMPTWARS-VIRTUAL
├── index.html              Single-canvas entry point. No framework.
├── src/
│   ├── main.js             Canvas initialisation and application entry
│   ├── game.js             60 fps game loop with 4-state state machine
│   ├── renderer.js         Canvas drawing, parallax layers, and visual effects
│   ├── sprites.js          Pixel art data and programmatic sprite rendering
│   ├── physics.js          Physics constants and bird/pipe behaviour
│   ├── collision.js        Bitmap mask collision detection
│   ├── audio.js            Synthesised audio via Web Audio API
│   ├── input.js            Keyboard, touch, IoT, voice, and face input handling
│   ├── gemini.js           Gemini API client with rate limiter
│   ├── narrator.js         Voice narrator and event queue
│   ├── shadow.js           Shadow Faby ghost bird AI
│   ├── world.js            World themes and chapter definitions
│   ├── iot.js              WebSocket IoT client
│   ├── biometric.js        Heart rate and GSR signal processing
│   ├── environment.js      Ambient light, noise, and motion sensing
│   └── ui.js               HUD, toast notifications, and score persistence
├── firmware/
│   └── controller.ino      ESP32 Arduino firmware
├── bridge.py               Python serial-to-WebSocket bridge
├── .env.example            Environment variable template
└── README.md               This file
```

---

## Controls

| Input | Action |
|---|---|
| `Space` / `↑` | Flap |
| Mouse Click / Screen Tap | Flap |
| ESP32 Button — Single Press | Flap |
| ESP32 Button — Hold | Shield |
| ESP32 Button — Double Tap | Turbo |
| Head Nod (Face Mode) | Flap |
| Voice Command: `"flap"` | Flap |

---

## Gemini AI Integrations

| Integration | Description |
|---|---|
| **World Generator** | Produces a unique world theme — colour palette, bird lore, and chapter structure — before each run |
| **Live Narrator** | Monitors gameplay events and delivers contextual voice commentary in real time |
| **Shadow Faby** | Ghost bird that learns from cumulative play history and demonstrates an improved flight path |
| **Face-Flap Mode** | Head-nod gesture recognition via MediaPipe FaceMesh, executed locally in-browser with no server dependency |

All AI integrations degrade gracefully. Disabling or omitting an API key does not affect core gameplay.

---

## IoT Hardware Setup

### Required Components

| Component | GPIO Pin | Function |
|---|---|---|
| Push Button | GPIO 4 | Primary flap input |
| Joystick Module (KY-023) | GPIO 34 / 35 | Flap force modulation |
| MAX30102 Pulse Sensor | I2C — SDA 21, SCL 22 | Heart rate monitoring |
| BH1750 Light Sensor | I2C — SDA 21, SCL 22 | Ambient light sensing |
| Microphone Module | GPIO 34 | Noise level detection |
| PIR Motion Sensor (HC-SR501) | GPIO 5 | Motion detection |

### Wiring Reference

```
ESP32 DevKit V1
┌─────────────────┐
│             3V3 ├──── Sensors VCC
│             GND ├──── Sensors GND
│          GPIO 4 ├──── Button (10 kΩ pull-up to 3V3)
│         GPIO 34 ├──── Joystick VRx / Microphone OUT
│         GPIO 35 ├──── Joystick VRy
│         GPIO 32 ├──── Joystick SW
│         GPIO 21 ├──── I2C SDA (MAX30102 + BH1750)
│         GPIO 22 ├──── I2C SCL (MAX30102 + BH1750)
│          GPIO 5 ├──── PIR OUT
│             5V  ├──── PIR VCC
└─────────────────┘
```

> **Hardware Note:** The microphone module and joystick VRx both map to GPIO 34. Connect only one at a time, or route through a multiplexer if simultaneous use is required.

### Running the Serial Bridge

The Python bridge relays ESP32 serial data to the game client over WebSocket.

```bash
# Install dependencies
pip install websockets pyserial

# Auto-detect serial port
python bridge.py

# Specify port manually — Windows
python bridge.py --port COM3

# Specify port manually — Linux / macOS
python bridge.py --port /dev/ttyUSB0
```

---

## Game Physics

| Parameter | Value | Notes |
|---|---|---|
| Gravity | `0.25` | Tuned to match the feel of the original Flappy Bird |
| Flap Force | `-4.6` | Sharp upward impulse on input |
| Max Fall Speed | `8.0` | Terminal velocity cap |
| Pipe Speed | `2.4` (base) | Scales with score progression |
| Canvas Resolution | `288 × 512 px` | Native pixel-art resolution |

---

## Prerequisites

| Dependency | Required | Purpose |
|---|---|---|
| Chrome 90+ or Firefox 88+ | Yes | ES module support, Web Audio API, MediaPipe |
| Node.js | Optional | Local development server via `npx serve` |
| Python 3.8+ | Optional | IoT serial-to-WebSocket bridge |
| ESP32 DevKit V1 | Optional | Physical IoT input and sensor integration |
| Gemini API Key | Optional | AI world generation, live narration, shadow bird |

---

## License

Developed for the **GDG × Hack2Skill** Hackathon. Open for educational and non-commercial use.
