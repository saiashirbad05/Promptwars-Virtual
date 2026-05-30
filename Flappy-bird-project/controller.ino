/*
 * ──────────────────────────────────────────────────────────────────────
 * controller.ino — FLAP.AI × IoT Arduino Firmware
 * ESP32 DevKit V1
 *
 * Reads:
 *   - Push button (GPIO 4) → flap / shield / turbo
 *   - Joystick (GPIO 34/35) → directional force
 *   - Pulse sensor MAX30102 (I2C 0x57) → BPM, HRV
 *   - Ambient light BH1750 (I2C 0x23) → lux
 *   - Microphone (GPIO 34 ADC) → noise dB
 *   - PIR motion (GPIO 5) → room occupancy
 *
 * Sends JSON over Serial at 115200 baud.
 * ──────────────────────────────────────────────────────────────────────
 */

#include <Wire.h>

// ── Pin Definitions ────────────────────────────────────────────────────
#define BUTTON_PIN    4
#define JOYSTICK_X    34
#define JOYSTICK_Y    35
#define JOY_BTN       32
#define MIC_PIN       34
#define PIR_PIN       5

// ── I2C Addresses ────────────────────────────────────────────────────
#define MAX30102_ADDR 0x57
#define BH1750_ADDR   0x23

// ── Timing ───────────────────────────────────────────────────────────
unsigned long lastButtonTime = 0;
unsigned long lastBioTime = 0;
unsigned long lastEnvTime = 0;
int buttonPressCount = 0;
unsigned long buttonHoldStart = 0;
bool buttonWasPressed = false;

// ── Sensor Data ──────────────────────────────────────────────────────
int bpm = 72;
float gsr = 0.3;
int hrv = 50;
float lux = 300;
int noiseDB = 40;
bool motion = false;

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);  // SDA=21, SCL=22

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(PIR_PIN, INPUT);
  pinMode(JOY_BTN, INPUT_PULLUP);

  // Initialize BH1750 in continuous high-res mode
  Wire.beginTransmission(BH1750_ADDR);
  Wire.write(0x10);
  Wire.endTransmission();

  Serial.println("{\"type\":\"status\",\"msg\":\"FLAP.AI IoT Ready\"}");
}

void loop() {
  unsigned long now = millis();

  // ── Button Handling ────────────────────────────────────────────────
  bool pressed = (digitalRead(BUTTON_PIN) == LOW);

  if (pressed && !buttonWasPressed) {
    // Button just pressed
    buttonHoldStart = now;
    buttonPressCount++;

    // Double-press detection (within 300ms)
    if (buttonPressCount >= 2 && (now - lastButtonTime) < 300) {
      Serial.println("{\"type\":\"button\",\"action\":\"turbo\"}");
      buttonPressCount = 0;
    }

    lastButtonTime = now;
  }

  if (!pressed && buttonWasPressed) {
    // Button released
    unsigned long holdDuration = now - buttonHoldStart;

    if (holdDuration >= 500) {
      // Long hold → shield
      Serial.println("{\"type\":\"button\",\"action\":\"shield\"}");
    } else if (buttonPressCount == 1) {
      // Check if this single press will become a double-press
      // Wait a short time before sending single flap
      delay(50);
      if (buttonPressCount == 1) {
        Serial.println("{\"type\":\"button\",\"action\":\"flap\"}");
      }
    }
    buttonPressCount = 0;
  }

  buttonWasPressed = pressed;

  // ── Joystick ───────────────────────────────────────────────────────
  // Read every 50ms
  static unsigned long lastJoyTime = 0;
  if (now - lastJoyTime > 50) {
    int rawX = analogRead(JOYSTICK_X);
    int rawY = analogRead(JOYSTICK_Y);

    // Map 0–4095 to -1.0 to +1.0
    float jx = (rawX / 2047.5) - 1.0;
    float jy = (rawY / 2047.5) - 1.0;

    // Dead zone
    if (abs(jx) < 0.1) jx = 0;
    if (abs(jy) < 0.1) jy = 0;

    if (jx != 0 || jy != 0) {
      Serial.print("{\"type\":\"joystick\",\"x\":");
      Serial.print(jx, 2);
      Serial.print(",\"y\":");
      Serial.print(jy, 2);
      Serial.println("}");
    }

    lastJoyTime = now;
  }

  // ── Biometric Sensors (every 500ms) ────────────────────────────────
  if (now - lastBioTime > 500) {
    readPulseSensor();
    readGSR();

    Serial.print("{\"type\":\"biometric\",\"bpm\":");
    Serial.print(bpm);
    Serial.print(",\"gsr\":");
    Serial.print(gsr, 2);
    Serial.print(",\"hrv\":");
    Serial.print(hrv);
    Serial.println("}");

    lastBioTime = now;
  }

  // ── Environment Sensors (every 2000ms) ────────────────────────────
  if (now - lastEnvTime > 2000) {
    readLightSensor();
    readMicrophone();
    motion = digitalRead(PIR_PIN) == HIGH;

    // Determine time of day from system millis (simplified)
    String tod = "afternoon";
    // In a real deployment, use NTP or RTC for actual time

    Serial.print("{\"type\":\"environment\",\"lux\":");
    Serial.print((int)lux);
    Serial.print(",\"noise_db\":");
    Serial.print(noiseDB);
    Serial.print(",\"motion\":");
    Serial.print(motion ? "true" : "false");
    Serial.print(",\"time_of_day\":\"");
    Serial.print(tod);
    Serial.println("\"}");

    lastEnvTime = now;
  }

  delay(10);  // Small delay to prevent watchdog issues
}

// ── Sensor Reading Functions ─────────────────────────────────────────

void readPulseSensor() {
  // Simplified MAX30102 reading
  // In production, use a library like SparkFun MAX3010x
  Wire.beginTransmission(MAX30102_ADDR);
  Wire.write(0x09);  // FIFO data register
  Wire.endTransmission(false);
  Wire.requestFrom(MAX30102_ADDR, 6);

  if (Wire.available() >= 6) {
    uint32_t irValue = 0;
    irValue |= ((uint32_t)Wire.read()) << 16;
    irValue |= ((uint32_t)Wire.read()) << 8;
    irValue |= Wire.read();

    // Very simplified BPM estimation from IR signal changes
    // A real implementation would use peak detection
    static uint32_t lastIR = 0;
    static unsigned long lastBeat = 0;

    if (irValue < lastIR - 1000 && now() - lastBeat > 300) {
      unsigned long beatInterval = millis() - lastBeat;
      lastBeat = millis();
      if (beatInterval > 300 && beatInterval < 1500) {
        bpm = 60000 / beatInterval;
        // Rolling average
        static int bpmBuffer[8] = {72,72,72,72,72,72,72,72};
        static int bpmIdx = 0;
        bpmBuffer[bpmIdx++ % 8] = bpm;
        int sum = 0;
        for (int i = 0; i < 8; i++) sum += bpmBuffer[i];
        bpm = sum / 8;

        // Reject noise
        if (bpm < 40 || bpm > 200) bpm = 72;
      }
    }
    lastIR = irValue;
  }
}

void readGSR() {
  // Simplified GSR reading via ADC
  // GSR sensor would be on a separate analog pin in real hardware
  // Here we simulate with a stable value
  int raw = analogRead(36);  // GPIO 36 for GSR
  gsr = raw / 4095.0;
}

void readLightSensor() {
  // BH1750 continuous high-res mode reading
  Wire.requestFrom(BH1750_ADDR, 2);
  if (Wire.available() >= 2) {
    uint16_t raw = Wire.read() << 8;
    raw |= Wire.read();
    lux = raw / 1.2;  // Convert to lux
  }
}

void readMicrophone() {
  // Sample microphone for ~50ms and calculate RMS → dB
  long sum = 0;
  int samples = 0;
  unsigned long start = millis();

  while (millis() - start < 50) {
    int val = analogRead(MIC_PIN);
    int centered = val - 2048;  // Center around 0
    sum += (long)centered * centered;
    samples++;
  }

  if (samples > 0) {
    float rms = sqrt((float)sum / samples);
    // Map RMS to approximate dB (calibration needed for real hardware)
    noiseDB = (int)(20 * log10(rms + 1));
    if (noiseDB < 0) noiseDB = 0;
    if (noiseDB > 120) noiseDB = 120;
  }
}

unsigned long now() {
  return millis();
}
