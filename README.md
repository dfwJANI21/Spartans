# ⚡ Omni-Teach Live: Multimodal Educational Ecosystem & Emotionally Intelligent AI Tutors

> **High-Stakes Hackathon Edition**  
> Powered by **Gemini Multimodal Live API (WebSockets)**, **`@google/genai` with Google Search Grounding**, **Gemini 3 Pro / Imagen Visual Synthesis**, and **Google Workspace APIs**.

---

## 🌟 Executive Overview
**Omni-Teach Live** transforms raw teaching inputs (syllabi, lecture notes, textbook PDFs, images, and audio) into a synchronized, production-ready educational ecosystem and instantly deploys an emotionally intelligent Socratic AI tutor.

Traditional AI tutors rely on asynchronous text prompting with generic chatbots. **Omni-Teach Live** redefines educational interactions:
1. **Autonomous Ecosystem Synthesis:** Deploys a dedicated Google Drive folder containing a formatted, illustrated Google Doc lesson guide and an automatically graded Google Form quiz.
2. **Fact-Checked Pedagogical Grounding:** Every formula, historical date, and discovery is fact-verified against Google Search Grounding via `@google/genai`.
3. **Gemini Multimodal Live API (Bidirectional 16kHz PCM Audio):** Delivers zero-latency, human-paced verbal tutoring directly over WebSockets.
4. **Frustration-Reactive Emotion Engine:** Acoustically monitors the student's vocal cadence. When frustration, confusion, or hesitation is detected, the interface seamlessly transitions from a high-contrast, fast-paced **Rigorous Mode** into a warm, soothing **Calm Adaptive Mode** with decelerated speech and intuitive analogies.

---

## 🏗 System Architecture

```
                                  [TEACHER COMMAND CENTER]
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │  Multimodal Dropzone (PDF, Image, Audio, Doc) │
                      └───────────────────────┬───────────────────────┘
                                              │ POST /api/generate
                                              ▼
                             ┌────────────────────────────────┐
                             │    EXECUTION DAG PIPELINE      │
                             └────────────────┬───────────────┘
                                              │
             ┌────────────────────────────────┼────────────────────────────────┐
             ▼                                ▼                                ▼
   [@google/genai Engine]           [Gemini 3 Pro / Imagen]           [Google Workspace]
  • Search Grounding Verification  • Studio 3D Concept Visuals       • Drive Folder Creation
  • Strict Schema Synthesis        • 16:9 Educational Assets         • Formatted Doc + Visual
  • Socratic Persona Tuning                                          • Graded Form Assessment
             │                                │                                │
             └────────────────────────────────┼────────────────────────────────┘
                                              ▼
                                 [FIREBASE FIRESTORE]
                                • Stored as lessonId
                                              │
                                              ▼
                             [STUDENT LIVE VOICE HUD]
                                • Route: /tutor/:lessonId
                                              │
                     ═════════════════════════╧═════════════════════════
                     Gemini Multimodal Live WebSocket (16kHz PCM Mono)
                     ═════════════════════════╤═════════════════════════
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │    EMOTION ENGINE & THEME TRANSITION          │
                      │   • Sentiment Flag Detection                  │
                      │   • Rigorous Mode ➔ Calm Mode Stitches Swap   │
                      │   • Concentric Concentric Orb Audio Canvas    │
                      └───────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend
- **React 18** with **TypeScript** & **Vite**
- **Stitches CSS-in-JS:** Bespoke Cyber-Noir design system with dynamic theme switching (`rigorousTheme` ➔ `calmTheme`).
- **Framer Motion:** Physics-based 3D parallax carousel using `useMotionValue` and `useTransform`.
- **HTML5 Canvas:** 60fps concentric expanding orbs reacting to student PCM mic input and AI tutor audio streams.
- **Lucide React:** Minimalist technical iconography.

### Backend & Cloud Stack
- **Node.js & Express:** Enterprise modular micro-service architecture.
- **`@google/genai` (Google Gen AI SDK):** Fact-checked model routing with `gemini-2.5-flash` and `tools: [{ googleSearch: {} }]`.
- **Gemini Multimodal Live API:** Native `wss://generativelanguage.googleapis.com/...` bidirectional 16kHz PCM audio stream.
- **Imagen 3 / Gemini Image Generation:** Studio-quality concept renders.
- **`googleapis` (Drive, Docs, Forms):** Automated folder creation, document formatting with embedded images, and graded form creation.
- **Firebase Firestore (`firebase-admin`):** Cloud persistence with high-speed in-memory fallback.

---

## 🚀 Quickstart Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/patelvatsalx/Spartans.git
cd Spartans

# Install backend dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```env
# Google AI Studio API Key (Required for Live Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port
PORT=3000

# Optional: Google Workspace Integration (Service Account)
GOOGLE_PROJECT_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional: Firebase Firestore Integration
FIREBASE_PROJECT_ID=
FIREBASE_SERVICE_ACCOUNT_KEY=
```
*(Note: If Workspace or Firebase credentials are not provided, Omni-Teach Live runs seamlessly in resilient demonstration mode with preview links and in-memory persistence).*

### 3. Build & Run
```bash
# Build the client
npm run build

# Start the unified production server
npm start
```
Open **http://localhost:3000** in your browser!

---

## 🎨 Walkthrough: Key Experiences

### 1. Teacher Command Center (`/`)
- **Magnetic Dropzone:** Hover over the dropzone to experience magnetic cursor glow tracking. Upload syllabi, PDFs, or select instant presets (e.g., *Quantum Superposition & Decoherence*, *CRISPR-Cas9*, *Transformer Attention*).
- **Execution DAG:** Watch the live 5-node pipeline pulse during processing: `[Input Upload]` ➔ `[Image Generation]` ➔ `[Google Search Grounding]` ➔ `[Workspace API]` ➔ `[Live Agent Ready]`.
- **3D Artifact Studio:** Interact with the generated assets in a 3D parallax carousel. Move your mouse to trigger dynamic depth tilt. Directly open the Google Doc, test the Google Form quiz, or jump into the Voice HUD.

### 2. Live Student Voice HUD (`/tutor/:lessonId`)
- **Native 16kHz PCM Audio:** Click **Start Call** to stream microphone audio at 16kHz PCM mono directly to Gemini Multimodal Live API.
- **Concentric Audio Canvas:** Watch the multi-layer concentric orbs expand and react to your voice and the tutor's vocal responses.
- **Emotion Engine (Frustration-Reactive UI):**
  - If the AI detects vocal hesitation, confusion, or the sentiment cue `[SENTIMENT: FRUSTRATED]`, the UI smoothly transitions from **Rigorous Mode** (obsidian & cyan cyber-noir) into **Calm Adaptive Mode** (warm amber/rose glow, rounded card geometry, relaxed pacing).
  - Click **Trigger Emotion Engine Test** at any moment to demonstrate this theme transition instantly to judges!
- **Socratic Action Pills:** Tap `💡 Give Me a Hint`, `🧠 Explain Simply`, `⚔️ Spawn Debate Mode`, or `🌍 Real-World Analogy` for instant real-time pedagogical pivots.

---

## 🏆 Hackathon Highlights
- **100% Zero-Crash Guarantee:** Resilient fallback mocks ensure that even in network-constrained presentation halls or unauthenticated environments, the entire UI and Socratic audio loop remains responsive.
- **Deeply Commented Architecture:** All services are cleanly separated with type signatures and architectural commentary.
