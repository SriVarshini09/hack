# ArgonDrive SF: Self-Healing Real2Sim City Architect & Multiplayer Race Director

> **"A single pass is only a first draft."** — Powered by **Gemini 4 Argon (`gemini-4-argon`)**, Headless Playwright Video Verification, OpenStreetMap 3D Real2Sim Extrusion, and 60Hz WebSocket Mobile QR Controllers.

---

## 1. The Core Thesis: Why Single-Pass World Generation Fails

When an AI generates a playable 3D simulation from real-world map data (OpenStreetMap Overpass API of San Francisco's Embarcadero & Ferry Building), **a single pass is only a first draft**. Static JSON coordinates cannot capture dynamic physics interactions, steering understeer, or unmarked architectural colonnades.

**ArgonDrive SF** closes the Real2Sim loop by combining **autonomous headless test-driving** with **Gemini 4 Argon multimodal video spatial reasoning**:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        ARGONDRIVE SF SELF-HEALING LOOP                           │
├──────────────────┬───────────────────┬───────────────────────┬───────────────────┤
│  PASS 1: DRAFT   │  PASS 2: CAPTURE  │  PASS 3: ARGON AUDIT  │  PASS 4: RACE!    │
│                  │                   │                       │                   │
│  OSM Overpass SF │  Playwright runs  │  gemini-4-argon       │  3-Viewport       │
│  Embarcadero 3D  │  /?bot=1 headless │  watches .webm video, │  Split-Screen:    │
│  -> Generates    │  Records 6s video │  flags crash @ 03.2s, │  P1 vs P2 (QR)    │
│  level_iter1.json│  iter1_crash.webm │  adds pillar collider │  vs Argon AI Ghost│
│  (WP#1 @ -12,35) │  Bot clips pillar │  & shifts WP#1 -14m W │  to SHACK15 Arch! │
└──────────────────┴───────────────────┴───────────────────────┴───────────────────┘
```

### The 4-Stage Autonomous Pipeline
1. **Pass 1 — First Draft (`level_iter1.json`):** Argon synthesizes a high-speed street circuit down San Francisco's Embarcadero toward the Ferry Building (`SHACK15`). However, Checkpoint #1 (`x: -12, z: 35`) routes the racing line directly through an unmodeled Ferry Plaza East colonnade pillar.
2. **Pass 2 — Headless Playwright Verification (`verify_loop.py` -> `public/iter1_crash.webm`):** Before humans ever touch the track, a headless Chromium instance spawns an autonomous telemetry bot (`http://localhost:3000/?bot=1`) and records a 6-second WebM video of the test lap. At `t = 00:03.2s`, the test vehicle violently clips the Ferry Building East colonnade at `(-12, 35)`.
3. **Pass 3 — Multimodal Video Critique & Self-Heal (`gemini-4-argon` -> `level_iter2.json`):** `verify_loop.py` uploads both `iter1_crash.webm` and `level_iter1.json` to **`gemini-4-argon`**. Watching the raw video frames and HUD telemetry, Argon pinpoints the exact timestamp (`00:03.2s`) and 3D coordinates of the collision, injects an explicit red wireframe collision proxy (`ferry_pillar_east`, `6m x 12m x 6m`), and shifts Waypoint #1 `-14m` West to `(-26, 35)`.
4. **Pass 4 — Verified Live Multiplayer Race (`level_iter2.json`):** Two players scan the on-screen QR codes with their phones (or use `WASD` + `Arrow Keys`) to race head-to-head against a 3rd car—the **Neon Green Argon AI Ghost Car**—all the way to the glowing **SHACK15 FINISH LINE** arch.

---

## 2. Key Technical Highlights

### Single-Canvas 3-Viewport Split-Screen Broadcast Engine
Built on Three.js using zero-copy `renderer.setViewport()` and `renderer.setScissor()` passes at 60 FPS:
- **Left Viewport (33%):** Player 1 (`Apex GT Red`) 3rd-person dynamic chase camera with drift physics, headlights, tire smoke/neon trails, digital speedometer, and distance-to-Shack15 telemetry.
- **Center Viewport (34%):** Top-Down Orthographic 3D Tactical Radar Map of San Francisco (extruded 3D OSM buildings, landmark Golden Ferry Building clock tower, glowing Embarcadero street grid, waypoint rings, and high-visibility P1/P2/Ghost beacons) + **Live QR Code Lobby**.
- **Right Viewport (33%):** Player 2 (`Cyber Drift Blue`) 3rd-person dynamic chase camera.

### Dual-Mode QR Mobile Touch Controllers (60Hz WebSockets)
- Opening `http://<LAN_IP>:3000/?player=1` or `/?player=2` transforms any smartphone into a low-latency tactile racing controller.
- Features live **Car Spec Selection** (`Apex GT Red`, `Cyber Drift Blue`, `SF Muscle Orange`), **SF Route Landmark Selection** (`Coit Tower -> Shack15 Ferry Bldg`, `Pier 39 -> Embarcadero Plaza`, `Bay Bridge -> Ferry Clocktower`), and multi-touch `LEFT` / `RIGHT` / `GAS` / `BRAKE` pedals streaming over WebSockets at 60Hz.

### Resilient Real2Sim SF Geometry Engine
- Fetches real San Francisco building footprints and highway splines from the OpenStreetMap Overpass API (`37.7910,-122.3995,37.7995,-122.3900`) and caches them in `sf_city_cache.json`.
- Includes a rich procedural San Francisco Embarcadero & Ferry Building fallback generator in `server.js` so the 3D city renders with 100% reliability even on restricted hackathon Wi-Fi.

---

## 3. Quickstart (Windows)

### Start the Broadcast & WebSocket Server
```powershell
node server.js
```
Open **`http://localhost:3000`** in Chrome/Edge.

### Run the Autonomous Playwright + Gemini 4 Argon Verification Loop
```powershell
.\.venv\Scripts\python.exe verify_loop.py
```
This launches headless Chromium at `http://localhost:3000/?bot=1`, captures `public/iter1_crash.webm`, audits the crash video with `gemini-4-argon`, and writes the self-healed `level_iter2.json`.

### Controls
- **Top HUD Stage Buttons:**
  - **`[1. Draft World (Iter 1 - Crash)]`**: Watch the autonomous bot clip the Embarcadero East colonnade at `00:03.2s`.
  - **`[2. Argon Video Audit]`**: Inspect the recorded `iter1_crash.webm` video, read Argon's timestamped spatial reasoning, toggle the red wireframe collision proxies, and trigger a live Argon patch.
  - **`[3. Verified Race (Iter 2 - Playable)]`**: Trigger the `3-2-1-GO!` countdown and race P1 vs P2 vs the Neon Green Argon AI Ghost Car to the Shack15 Finish Line!
- **Keyboard Controls:** Player 1 (`W/A/S/D`) | Player 2 (`Arrow Keys`)
- **Mobile Controls:** Scan the P1 or P2 QR codes in the center viewport.
