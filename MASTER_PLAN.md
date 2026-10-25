# ArgonDrive SF: The Self-Healing Real2Sim City Architect & Multiplayer Race Director

## 1. CORE HACKATHON THESIS
Our project proves Gemini 4 Argon's core thesis: "A single pass is only a first draft."
When two judges scan a QR code on their phones, pick their cars, and choose a Start and Finish landmark in San Francisco (e.g., Coit Tower -> Shack15 Ferry Building), Gemini 4 Argon acts as the autonomous World Architect & Visual Critic:
1. **Pass 1 (First Draft):** Argon generates a playable 3D street circuit (`level_iter1.json`) over real San Francisco 3D buildings and roads.
2. **Pass 2 (Headless Playwright Verification):** A headless bot attempts to drive the route. Playwright records a 6-second video (`iter1_crash.webm`). In Iteration 1, Waypoint #1 is misaligned, causing the test car to clip/crash into an Embarcadero median pillar at timestamp `00:03.2s`.
3. **Pass 3 (Multimodal Video Critique & Self-Heal):** Gemini 4 Argon (`gemini-4-argon`) watches `iter1_crash.webm`, diagnoses the exact timestamp and spatial failure, shifts the waypoint, adds a red wireframe collision proxy, and outputs `level_iter2.json`.
4. **Pass 4 (Verified Live Multiplayer Race):** Two human judges race head-to-head using their phones (via QR code) or keyboard (`WASD` + `Arrows`) against a 3rd car—the **Neon Green "Argon AI Ghost Car"**—on a 3-View Split-Screen Broadcast display right up to the glowing **SHACK15 FINISH LINE**.

## 2. REQUIRED FILES TO BUILD (ZERO PLACEHOLDERS)
We are running on Windows in `C:\Users\ptula\Desktop\argondrive-sf`. Build these exact 5 files and verify they run cleanly on `http://localhost:3000`:

### File 1: `level_iter1.json` (First Draft - Buggy)
- `iteration: 1`, `argon_critique: "Pass 1 First Draft: Generated from raw SF Embarcadero OSM corridor."`, `spawn: { x: -35, y: 0, z: 120, rotationY: 2.9 }`, `carStats: { maxSpeed: 0.9, acceleration: 0.03, turnSpeed: 0.045 }`, `colliders` (missing the Ferry Plaza East pillar collider), and `checkpoints` where Checkpoint #1 (`{ id: 1, x: -12, y: 0, z: 35, radius: 8 }`) forces the bot trajectory straight into the Ferry Building median pillar at `t = 3.2s`.

### File 2: `level_iter2.json` (Argon Patched - Verified)
- `iteration: 2`, `argon_critique: "AUDIT COMPLETE [00:03.2s]: Detected vehicle clipping Ferry Plaza East colonnade at (-12, 35). Added collision proxy 'ferry_pillar_east' (w:6, h:12, d:6) and shifted Waypoint #1 -14m West to (-26, 35). Route 100% verified."`, updated `colliders` (with `{ id: "ferry_pillar_east", x: -12, y: 6, z: 35, w: 6, h: 12, d: 6 }`), and corrected `checkpoints` leading cleanly to `{ id: 3, x: 5, y: 0, z: -30, radius: 10, isFinish: true }`.

### File 3: `server.js` (Express + WebSockets + Local SF OSM Cache)
- Serves `public/` and root JSON/video files on port 3000.
- `GET /api/sf-map`: Checks if `sf_city_cache.json` exists locally; if not, fetches OpenStreetMap Overpass API bbox `37.7910,-122.3995,37.7995,-122.3900` (Ferry Building / Shack15 / Embarcadero), saves to `sf_city_cache.json`, and returns it (with a built-in procedural SF Embarcadero building/road fallback if Overpass times out).
- Runs a `ws` WebSocket server on the same HTTP server broadcasting mobile controller messages (`{ player, left, right, gas, brake, color, startLoc, endLoc }`) at 60Hz.
- `POST /api/argon-audit`: Executes `.venv\Scripts\python.exe verify_loop.py` (or falls back to returning `level_iter2.json` immediately in demo-safe mode).

### File 4: `public/index.html` (Dual-Mode: 3-View Broadcast Display + Mobile QR Touch Controller)
- **If opened with `?player=1` or `?player=2`:** Full-screen mobile touch controller with Car Selector (`Apex GT Red`, `Cyber Drift Blue`, `SF Muscle Orange`), Landmark Selector, and multi-touch buttons (`LEFT`, `RIGHT`, `GAS`, `BRAKE`) over WebSockets.
- **If opened normally (`/`):**
  - Top HUD Bar with Start/Finish Landmark selector and **3 Instant Demo Stage Buttons**:
    1. `[1. Draft World (Iter 1 - Crash)]` -> Loads `level_iter1.json`, spawns bot, crashes into Embarcadero pillar at `00:03.2s`.
    2. `[2. Argon Video Audit]` -> Shows Argon Visual Critique overlay with `iter1_crash.webm` video playback, timestamped spatial reasoning log, red wireframe collision box toggle, and `"Run Live Gemini 4 Argon Patch"` button.
    3. `[3. Verified Race (Iter 2 - Playable)]` -> Loads `level_iter2.json`, 3-2-1 Countdown, Player 1 (Red, WASD/Phone 1) vs Player 2 (Blue, Arrows/Phone 2) vs **Neon Green Argon AI Ghost Car** racing to the glowing **SHACK15 FINISH LINE** arch with a Winner celebration banner.
  - **Single-Canvas 3-Viewport Split Screen (`renderer.setViewport` & `renderer.setScissor`):**
    - Left 33%: Player 1 3rd-Person Chase Camera + Speedometer + Distance.
    - Center 34%: Top-Down Orthographic 3D Radar Map of SF (extruded 3D buildings, golden Ferry Building, glowing streets, checkpoints, giant Red/Blue/Green markers for P1, P2, Argon Ghost) + floating **QR Code Lobby** (`https://api.qrserver.com/v1/create-qr-code/` pointing to `window.location.origin + '/?player=1'` and `'/?player=2'`).
    - Right 33%: Player 2 3rd-Person Chase Camera + Speedometer + Distance.
  - **Headless Bot Mode (`?bot=1`):** Automatically runs the bot lap for Playwright video capture.

### File 5: `verify_loop.py` (Playwright Video Recorder + Gemini 4 Argon Multimodal Critic)
- Launches headless Chromium via `playwright` at `http://localhost:3000/?bot=1`, records a 6-second video to `public/iter1_crash.webm`.
- Uploads `public/iter1_crash.webm` + `level_iter1.json` to `google-genai` (`model="gemini-4-argon"`), prompts Argon to identify the exact collision timestamp and coordinates, and writes the fixed configuration to `level_iter2.json`.
