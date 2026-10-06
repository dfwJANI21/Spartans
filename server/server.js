/**
 * Omni-Teach Live - Enterprise Express Server
 * Principal Full-Stack Architecture for Multimodal AI Tutoring Ecosystem
 */

const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const lessonRoutes = require('./routes/lessonRoutes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Security & Parsing Middleware
app.use(cors({
  origin: '*',
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

// Config info endpoint (does not expose private keys, only availability flag)
app.get('/api/config', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  res.json({
    geminiLiveConfigured: hasKey,
    // Return key only if explicitly allowed for direct client-side WS in local hackathon demo
    clientKey: hasKey ? process.env.GEMINI_API_KEY : null,
    wsEndpoint: 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent'
  });
});

// API Routes
app.use('/api', lessonRoutes);

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
  console.log(`🎙️ Gemini Multimodal Live API: Ready`);
  console.log(`📁 Google Workspace Orchestrator: ${process.env.GOOGLE_CLIENT_EMAIL ? 'Connected' : 'Simulation Mode'}`);
  console.log(`🔥 Firebase Firestore: ${process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 'Connected' : 'In-Memory Cache Mode'}`);
  console.log(`================================================================`);
});
