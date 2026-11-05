/**
 * Omni-Teach Live - Enterprise Express Server
 * Principal Full-Stack Architecture for Multimodal AI Tutoring Ecosystem
 */

const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { WebSocketServer, WebSocket } = require('ws');
require('dotenv').config();

const lessonRoutes = require('./routes/lessonRoutes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Security & Parsing Middleware
// Comma-separated allowlist in ALLOWED_ORIGINS; if unset, only same-origin requests (no CORS headers)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request Logger
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Config info endpoint (does not expose private keys, only availability flag and proxy endpoint)
app.get('/api/config', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  res.json({
    geminiLiveConfigured: hasKey,
    // The key is NEVER exposed by default. Opt in with ALLOW_CLIENT_KEY=true for local demos only.
    // In production or when false, the client connects to the /ws/live proxy on the server.
    clientKey: (hasKey && process.env.ALLOW_CLIENT_KEY === 'true') ? process.env.GEMINI_API_KEY : null,
    wsEndpoint: '/ws/live'
  });
});

// API Routes
app.use('/api', lessonRoutes);

// WebSocket Proxy for Gemini Multimodal Live API
// Securely proxies bidirectional audio/JSON between client browser and Gemini Live API
// without leaking GEMINI_API_KEY to the client!
const wss = new WebSocketServer({ server, path: '/ws/live' });

wss.on('connection', (clientWs, req) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
    console.warn('[WS Proxy] Connection rejected: GEMINI_API_KEY is not configured on server.');
    clientWs.close(1008, 'GEMINI_API_KEY not configured on server');
    return;
  }

  const upstreamUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${geminiKey}`;
  console.log('[WS Proxy] Client connected, establishing upstream connection to Gemini Live API...');

  const upstreamWs = new WebSocket(upstreamUrl);
  const sendQueue = [];

  upstreamWs.on('open', () => {
    console.log('[WS Proxy] Upstream Gemini Live connection established.');
    while (sendQueue.length > 0 && upstreamWs.readyState === WebSocket.OPEN) {
      const { data, isBinary } = sendQueue.shift();
      upstreamWs.send(data, { binary: isBinary });
    }
  });

  clientWs.on('message', (data, isBinary) => {
    if (upstreamWs.readyState === WebSocket.OPEN) {
      upstreamWs.send(data, { binary: isBinary });
    } else if (upstreamWs.readyState === WebSocket.CONNECTING) {
      sendQueue.push({ data, isBinary });
    }
  });

  upstreamWs.on('message', (data, isBinary) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(data, { binary: isBinary });
    }
  });

  upstreamWs.on('error', (err) => {
    console.error('[WS Proxy] Upstream Gemini error:', err.message);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: err.message }));
    }
  });

  clientWs.on('error', (err) => {
    console.warn('[WS Proxy] Client WS error:', err.message);
  });

  clientWs.on('close', (code, reason) => {
    console.log(`[WS Proxy] Client disconnected (${code}). Closing upstream.`);
    if (upstreamWs.readyState === WebSocket.OPEN || upstreamWs.readyState === WebSocket.CONNECTING) {
      upstreamWs.close();
    }
  });

  upstreamWs.on('close', (code, reason) => {
    console.log(`[WS Proxy] Upstream disconnected (${code}). Closing client connection.`);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.close(code, reason);
    }
  });
});

// Static assets (serves built React Vite frontend if dist exists, else serves public)
const clientDistPath = path.join(__dirname, '../client/dist');
const fallbackPublicPath = path.join(__dirname, '../public');

app.use(express.static(clientDistPath));
app.use(express.static(fallbackPublicPath));

// SPA Fallback for client routes like /tutor/:lessonId
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API route not found' });
  }

  const clientIndex = path.join(clientDistPath, 'index.html');
  const fallbackIndex = path.join(fallbackPublicPath, 'index.html');

  const fs = require('fs');
  if (fs.existsSync(clientIndex)) {
    return res.sendFile(clientIndex);
  }
  return res.sendFile(fallbackIndex);
});

// Server Initialization
server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`⚡ Omni-Teach Live: Multimodal Socratic Ecosystem active!`);
  console.log(`🌐 Application URL: http://localhost:${PORT}`);
  console.log(`🎙️ Gemini Multimodal Live API: WebSocket Proxy enabled at /ws/live`);
  console.log(`📁 Google Workspace Orchestrator: ${process.env.GOOGLE_CLIENT_EMAIL ? 'Connected' : 'Simulation Mode'}`);
  console.log(`🔥 Firebase Firestore: ${process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 'Connected' : 'In-Memory Cache Mode'}`);
  console.log(`================================================================`);
});
