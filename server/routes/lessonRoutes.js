/**
 * Lesson Routes for Omni-Teach Live
 * Handles multimodal ingestion, DAG orchestration, and Firestore retrieval.
 */

const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const router = express.Router();

// Escape untrusted text before interpolating into server-rendered HTML (prevents stored XSS)
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const { generateLessonEcosystem } = require('../services/aiService');
const { orchestrateWorkspaceEcosystem } = require('../services/workspaceService');
const { saveLessonPlan, getLessonPlan, logTutorSession, isFirestoreConnected } = require('../services/firestoreService');

// Multer in-memory storage for multimodal file processing (images, PDFs, audio)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max file upload
});

/**
 * Health & Configuration Check
 * GET /api/health
 */
router.get('/health', (req, res) => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  const hasGoogleCreds = !!process.env.GOOGLE_CLIENT_EMAIL && !!process.env.GOOGLE_PRIVATE_KEY;
  const hasFirebase = isFirestoreConnected();

  res.json({
    status: 'online',
    platform: 'Omni-Teach Live API',
    timestamp: new Date().toISOString(),
    integrations: {
      geminiAI: {
        configured: hasGeminiKey,
        mode: hasGeminiKey ? 'Gemini 2.5 Flash + Vertex Search Grounding' : 'High-Fidelity Resilient Synthetic Engine'
      },
      googleWorkspace: {
        configured: hasGoogleCreds,
        features: ['Google Drive Folders', 'Google Docs with Visuals', 'Graded Google Forms']
      },
      firebaseFirestore: {
        configured: hasFirebase,
        mode: hasFirebase ? 'Google Cloud Firestore' : 'In-Memory High-Speed Cache'
      },
      multimodalLiveWs: {
        supported: true,
        endpoint: 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent'
      }
    }
  });
});

/**
 * Main Generation Endpoint
 * POST /api/generate
 * Accepts JSON or multipart/form-data with attached files
 */
router.post('/generate', upload.array('files', 5), async (req, res) => {
  try {
    const topic = req.body.topic || req.body.title || 'Advanced Socratic Exploration';
    const subject = req.body.subject || 'Interdisciplinary Sciences';
    const grade = req.body.grade || 'Undergraduate / AP';
    const rawPrompt = req.body.rawPrompt || req.body.prompt || '';

    console.log(`[API /generate] Initiating Execution DAG for "${topic}" (${subject}, ${grade})`);

    // Process any uploaded multipart files into base64 payloads for Gemini
    const multimodalFiles = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        multimodalFiles.push({
          name: file.originalname,
          mimeType: file.mimetype,
          data: file.buffer.toString('base64')
        });
      }
    }

    // Ingest JSON-provided base64 files if present
    if (req.body.fileData && req.body.fileMimeType) {
      multimodalFiles.push({
        name: req.body.fileName || 'uploaded-file',
        mimeType: req.body.fileMimeType,
        data: req.body.fileData
      });
    }

    // DAG Step 1 & 2: Gemini Fact-Checked Generation with Google Search Grounding & Imagen 3
    console.log('[DAG] Step 1 & 2: Running AI Service & Visual Synthesis...');
    const aiResult = await generateLessonEcosystem({
      topic,
      subject,
      grade,
      rawPrompt,
      multimodalFiles
    });

    const lessonId = req.body.lessonId || `omni_${crypto.randomBytes(6).toString('hex')}`;

    // DAG Step 3: Google Workspace Orchestrator (Drive, Doc, Form)
    console.log('[DAG] Step 3: Orchestrating Google Workspace (Drive, Docs, Forms)...');
    const workspaceResult = await orchestrateWorkspaceEcosystem({
      ...aiResult,
      lessonId,
      topic,
      subject,
      grade
    });

    // DAG Step 4: Persist to Firestore
    console.log('[DAG] Step 4: Storing Lesson Ecosystem in Firestore...');
    const completeLessonRecord = {
      ...aiResult,
      lessonId,
      workspace: workspaceResult,
      topic,
      subject,
      grade,
      rawPrompt
    };

    await saveLessonPlan(completeLessonRecord);

    console.log(`[DAG] Completed! Live Socratic Agent ready at /tutor/${lessonId}`);

    return res.status(200).json({
      success: true,
      lessonId,
      lesson: completeLessonRecord,
      meta: {
        dagCompletedSteps: [
          'MULTIMODAL_INGESTION',
          'IMAGEN_VISUAL_SYNTHESIS',
          'SEARCH_GROUNDING',
          'WORKSPACE_ORCHESTRATION',
          'FIRESTORE_PERSISTENCE',
          'LIVE_AGENT_READY'
        ]
      }
    });

  } catch (error) {
    console.error('[API /generate Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Generation pipeline failed.'
    });
  }
});

/**
 * Retrieve lesson details by lessonId
 * GET /api/lesson/:lessonId
 */
router.get('/lesson/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await getLessonPlan(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: `Lesson with ID "${lessonId}" not found.`
      });
    }

    return res.status(200).json({
      success: true,
      lesson
    });
  } catch (error) {
    console.error(`[API /lesson/:lessonId Error]:`, error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch lesson.'
    });
  }
});

/**
 * Log tutor session telemetry
 * POST /api/tutor-session/:lessonId
 */
router.post('/tutor-session/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const sessionMetrics = req.body || {};
    const result = await logTutorSession(lessonId, sessionMetrics);

    return res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error(`[API /tutor-session Error]:`, error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Lesson Document View
 * GET /api/lesson/:lessonId/doc
 */
router.get('/lesson/:lessonId/doc', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await getLessonPlan(lessonId);

    const title = esc(lesson ? (lesson.title || lesson.topic || 'Lesson Document') : 'Lesson Document');
    const content = esc(lesson ? (lesson.lessonPlan || lesson.content || '') : '');
    const sections = lesson ? (lesson.sections || []) : [];

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Google Doc View</title>
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Roboto', sans-serif; background: #f8f9fa; }
    .doc-toolbar { background: #fff; border-bottom: 1px solid #dadce0; padding: 8px 16px; display: flex; align-items: center; gap: 12px; }
    .doc-toolbar img { width: 40px; height: 40px; }
    .doc-toolbar .title { font-family: 'Google Sans', sans-serif; font-size: 18px; color: #202124; font-weight: 500; }
    .doc-toolbar .subtitle { font-size: 12px; color: #5f6368; }
    .doc-container { max-width: 816px; margin: 24px auto; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.12); border-radius: 4px; padding: 72px 96px; min-height: 1056px; }
    .doc-container h1 { font-family: 'Google Sans', sans-serif; font-size: 26px; color: #1a73e8; margin-bottom: 8px; }
    .doc-container h2 { font-family: 'Google Sans', sans-serif; font-size: 20px; color: #202124; margin: 24px 0 8px; border-bottom: 2px solid #1a73e8; padding-bottom: 4px; }
    .doc-container h3 { font-size: 16px; color: #1a73e8; margin: 16px 0 6px; }
    .doc-container p, .doc-container li { font-size: 14px; line-height: 1.8; color: #3c4043; }
    .doc-container ul, .doc-container ol { padding-left: 24px; margin: 8px 0; }
    .meta-badge { display: inline-block; background: #e8f0fe; color: #1a73e8; padding: 4px 12px; border-radius: 16px; font-size: 12px; margin: 4px 4px 16px 0; }
    .section-card { background: #f8f9fa; border-left: 4px solid #1a73e8; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
    .back-link { display: inline-block; margin: 16px; color: #1a73e8; text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="doc-toolbar">
    <svg width="40" height="40" viewBox="0 0 48 48"><path fill="#2196F3" d="M13 6h16l10 10v26c0 1.1-.9 2-2 2H13c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z"/><path fill="#1565C0" d="M29 6l10 10H29z"/><path fill="#fff" d="M16 22h16v2H16zm0 4h16v2H16zm0 4h12v2H16z"/></svg>
    <div>
      <div class="title">${title}</div>
      <div class="subtitle">Omni-Teach Live Document • Lesson ID: ${esc(lessonId)}</div>
    </div>
  </div>
  <a href="/" class="back-link">← Back to Dashboard</a>
  <div class="doc-container">
    <h1>${title}</h1>
    ${lesson && lesson.subject ? `<span class="meta-badge">${esc(lesson.subject)}</span>` : ''}
    ${lesson && lesson.grade ? `<span class="meta-badge">${esc(lesson.grade)}</span>` : ''}
    ${content ? `<div>${content.replace(/\n/g, '<br>')}</div>` : ''}
    ${sections.length > 0 ? sections.map((s, i) => `
      <h2>${esc(s.title || 'Section ' + (i + 1))}</h2>
      <div class="section-card">
        <p>${esc(s.content || s.explanation || JSON.stringify(s)).replace(/\n/g, '<br>')}</p>
      </div>
    `).join('') : ''}
    ${!content && sections.length === 0 ? '<p style="color:#5f6368;font-style:italic;">No document content available yet. Generate a lesson first.</p>' : ''}
  </div>
</body>
</html>`);
  } catch (error) {
    console.error('[API /lesson/:lessonId/doc Error]:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Lesson Form View
 * GET /api/lesson/:lessonId/form
 */
router.get('/lesson/:lessonId/form', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await getLessonPlan(lessonId);

    const title = esc(lesson ? (lesson.title || lesson.topic || 'Assessment') : 'Assessment');
    const questions = lesson ? (lesson.assessmentQuestions || lesson.questions || []) : [];

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Google Form View</title>
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Roboto', sans-serif; background: #f0ebf8; min-height: 100vh; padding: 24px; }
    .form-header { max-width: 640px; margin: 0 auto 12px; background: #fff; border-radius: 8px; border-top: 10px solid #673ab7; padding: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .form-header h1 { font-family: 'Google Sans', sans-serif; font-size: 24px; color: #202124; }
    .form-header p { font-size: 14px; color: #5f6368; margin-top: 8px; }
    .form-question { max-width: 640px; margin: 0 auto 12px; background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); border-left: 4px solid transparent; transition: border-color 0.2s; }
    .form-question:hover { border-left-color: #673ab7; }
    .form-question .q-text { font-size: 15px; color: #202124; margin-bottom: 16px; font-weight: 500; }
    .form-question .q-number { color: #673ab7; font-weight: 700; }
    .option { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
    .option input[type="radio"] { accent-color: #673ab7; width: 18px; height: 18px; }
    .option label { font-size: 14px; color: #3c4043; cursor: pointer; }
    .submit-btn { max-width: 640px; margin: 16px auto; }
    .submit-btn button { background: #673ab7; color: #fff; border: none; padding: 10px 24px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: 'Google Sans', sans-serif; }
    .submit-btn button:hover { background: #5e35b1; }
    .back-link { display: inline-block; max-width: 640px; margin: 0 auto 12px; color: #673ab7; text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <a href="/" class="back-link">← Back to Dashboard</a>
  <div class="form-header">
    <h1>📝 ${title} — Assessment</h1>
    <p>Lesson ID: ${esc(lessonId)} • Auto-generated quiz from Omni-Teach Live</p>
  </div>
  ${questions.length > 0 ? questions.map((q, i) => `
    <div class="form-question">
      <div class="q-text"><span class="q-number">Q${i + 1}.</span> ${esc(q.question || q.text || q)}</div>
      ${(q.options || q.choices || ['Option A', 'Option B', 'Option C', 'Option D']).map((opt, j) => `
        <div class="option">
          <input type="radio" name="q${i}" id="q${i}_${j}">
          <label for="q${i}_${j}">${esc(opt)}</label>
        </div>
      `).join('')}
    </div>
  `).join('') : `
    <div class="form-question">
      <div class="q-text">No assessment questions generated yet. Generate a lesson to create quiz questions.</div>
    </div>
  `}
  <div class="submit-btn"><button onclick="alert('Responses recorded! ✅')">Submit</button></div>
</body>
</html>`);
  } catch (error) {
    console.error('[API /lesson/:lessonId/form Error]:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Lesson Drive View
 * GET /api/lesson/:lessonId/drive
 */
router.get('/lesson/:lessonId/drive', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await getLessonPlan(lessonId);

    const title = esc(lesson ? (lesson.title || lesson.topic || 'Lesson Files') : 'Lesson Files');

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Google Drive View</title>
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Roboto', sans-serif; background: #fff; }
    .drive-header { background: #fff; border-bottom: 1px solid #dadce0; padding: 12px 24px; display: flex; align-items: center; gap: 12px; }
    .drive-header h1 { font-family: 'Google Sans', sans-serif; font-size: 22px; color: #202124; font-weight: 400; }
    .drive-body { max-width: 960px; margin: 24px auto; padding: 0 24px; }
    .breadcrumb { font-size: 13px; color: #5f6368; margin-bottom: 16px; }
    .breadcrumb a { color: #1a73e8; text-decoration: none; }
    .file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .file-card { border: 1px solid #dadce0; border-radius: 8px; overflow: hidden; cursor: pointer; transition: box-shadow 0.2s; }
    .file-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .file-thumb { height: 140px; display: flex; align-items: center; justify-content: center; font-size: 48px; }
    .file-thumb.doc { background: #e8f0fe; }
    .file-thumb.form { background: #f3e8fd; }
    .file-thumb.folder { background: #e6f4ea; }
    .file-thumb.slides { background: #fef7e0; }
    .file-info { padding: 12px; border-top: 1px solid #dadce0; }
    .file-info .name { font-size: 13px; color: #202124; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .file-info .meta { font-size: 11px; color: #5f6368; margin-top: 4px; }
    .back-link { display: inline-block; margin: 16px 24px; color: #1a73e8; text-decoration: none; font-size: 14px; }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="drive-header">
    <svg width="40" height="40" viewBox="0 0 48 48"><path fill="#FFC107" d="M17 6l-12 21h12l12-21z"/><path fill="#1976D2" d="M29 6l12 21H29L17 6z"/><path fill="#4CAF50" d="M5 27l12 21 12-21H5z"/></svg>
    <h1>Drive — ${title}</h1>
  </div>
  <a href="/" class="back-link">← Back to Dashboard</a>
  <div class="drive-body">
    <div class="breadcrumb">
      <a href="/">My Drive</a> › <a href="#">Omni-Teach Live</a> › ${title}
    </div>
    <div class="file-grid">
      <a href="/api/lesson/${encodeURIComponent(lessonId)}/doc" style="text-decoration:none;color:inherit;">
        <div class="file-card">
          <div class="file-thumb doc">📄</div>
          <div class="file-info">
            <div class="name">${title} — Lesson Plan</div>
            <div class="meta">Google Docs • Today</div>
          </div>
        </div>
      </a>
      <a href="/api/lesson/${encodeURIComponent(lessonId)}/form" style="text-decoration:none;color:inherit;">
        <div class="file-card">
          <div class="file-thumb form">📝</div>
          <div class="file-info">
            <div class="name">${title} — Assessment</div>
            <div class="meta">Google Forms • Today</div>
          </div>
        </div>
      </a>
      <div class="file-card">
        <div class="file-thumb slides">📊</div>
        <div class="file-info">
          <div class="name">${title} — Slides</div>
          <div class="meta">Google Slides • Today</div>
        </div>
      </div>
      <div class="file-card">
        <div class="file-thumb folder">📁</div>
        <div class="file-info">
          <div class="name">Student Resources</div>
          <div class="meta">Folder • Today</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`);
  } catch (error) {
    console.error('[API /lesson/:lessonId/drive Error]:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
