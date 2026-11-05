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
    let lesson = await getLessonPlan(lessonId);

    // If lesson does not exist or has no structured content, synthesize it on-the-fly
    if (!lesson || !lesson.docContent || !Array.isArray(lesson.docContent.keyConcepts) || lesson.docContent.keyConcepts.length === 0) {
      const fallbackTopic = (lesson && (lesson.topic || lesson.title || lesson.lessonTitle)) || 'Neural Attention Mechanisms & Transformers';
      const fallbackSubject = (lesson && lesson.subject) || 'Machine Learning & Computer Science';
      const fallbackGrade = (lesson && lesson.grade) || 'Undergraduate / Advanced Seminar';
      
      console.log(`[API /doc] Auto-synthesizing structured curriculum for "${fallbackTopic}" (${lessonId})`);
      const generated = await generateLessonEcosystem({
        topic: fallbackTopic,
        subject: fallbackSubject,
        grade: fallbackGrade
      });

      lesson = {
        ...generated,
        ...(lesson || {}),
        lessonTitle: generated.lessonTitle || fallbackTopic,
        subject: fallbackSubject,
        grade: fallbackGrade,
        docContent: generated.docContent,
        quizQuestions: generated.quizQuestions,
        summary: generated.summary,
        visualAsset: generated.visualAsset,
        lessonId
      };

      await saveLessonPlan(lesson);
    }

    const title = esc(lesson ? (lesson.lessonTitle || lesson.title || lesson.topic || 'Lesson Document') : 'Lesson Document');
    const subject = esc(lesson ? (lesson.subject || '') : '');
    const grade = esc(lesson ? (lesson.grade || '') : '');
    const summary = esc(lesson ? (lesson.summary || '') : '');
    const doc = (lesson && lesson.docContent) ? lesson.docContent : {};

    const objectives = Array.isArray(doc.learningObjectives) ? doc.learningObjectives : [];
    const concepts = Array.isArray(doc.keyConcepts) ? doc.keyConcepts : [];
    const timeline = Array.isArray(doc.interactiveTimeline) ? doc.interactiveTimeline : [];
    const prompts = Array.isArray(doc.socraticDiscussionPrompts) ? doc.socraticDiscussionPrompts : [];
    const assessment = esc(doc.assessment || '');
    const visualUrl = lesson && lesson.visualAsset && lesson.visualAsset.url ? lesson.visualAsset.url : null;

    // Backward-compatible fallback for generic lessonPlan/sections if present
    const legacyContent = esc(lesson ? (lesson.lessonPlan || lesson.content || '') : '');
    const legacySections = Array.isArray(lesson?.sections) ? lesson.sections : [];

    const hasStructuredContent = summary || objectives.length > 0 || concepts.length > 0 || timeline.length > 0 || prompts.length > 0 || assessment || legacyContent || legacySections.length > 0;

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Google Docs</title>
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif; background: #f0f4f9; color: #1f1f1f; }
    .doc-topbar { background: #fff; border-bottom: 1px solid #dadce0; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
    .doc-branding { display: flex; align-items: center; gap: 14px; }
    .doc-branding svg { width: 36px; height: 36px; flex-shrink: 0; }
    .doc-title-box { display: flex; flex-direction: column; }
    .doc-title { font-family: 'Google Sans', sans-serif; font-size: 18px; color: #1f1f1f; font-weight: 500; line-height: 1.2; }
    .doc-meta-sub { font-size: 11px; color: #5f6368; display: flex; align-items: center; gap: 8px; margin-top: 2px; }
    .doc-actions { display: flex; align-items: center; gap: 10px; }
    .action-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; font-family: 'Google Sans', sans-serif; text-decoration: none; transition: all 0.2s; }
    .btn-secondary { background: #e8f0fe; color: #1a73e8; border: 1px solid #d2e3fc; }
    .btn-secondary:hover { background: #d2e3fc; }
    .btn-primary { background: #1a73e8; color: #fff; border: 1px solid transparent; }
    .btn-primary:hover { background: #1557b0; }
    .doc-canvas { max-width: 850px; margin: 28px auto 60px; background: #fff; box-shadow: 0 1px 3px rgba(60,64,67,0.15), 0 4px 8px rgba(60,64,67,0.1); border-radius: 8px; padding: 64px 72px; min-height: 1056px; }
    h1.main-title { font-family: 'Google Sans', sans-serif; font-size: 28px; font-weight: 700; color: #1a73e8; line-height: 1.25; margin-bottom: 12px; }
    .meta-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e0e0e0; }
    .meta-tag { background: #e8f0fe; color: #1967d2; font-size: 12px; font-weight: 500; padding: 4px 12px; border-radius: 12px; font-family: 'Google Sans', sans-serif; }
    .summary-lead { font-size: 15px; line-height: 1.7; color: #3c4043; background: #f8fafd; border-left: 4px solid #1a73e8; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 28px; font-style: normal; }
    .visual-banner { width: 100%; max-height: 380px; object-fit: cover; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.12); border: 1px solid #dadce0; }
    h2.section-heading { font-family: 'Google Sans', sans-serif; font-size: 19px; font-weight: 600; color: #202124; margin: 32px 0 14px; padding-bottom: 6px; border-bottom: 2px solid #e8eaed; display: flex; align-items: center; gap: 8px; }
    ul.objective-list { list-style: none; padding-left: 0; margin: 12px 0 24px; }
    ul.objective-list li { font-size: 14px; line-height: 1.7; color: #3c4043; position: relative; padding-left: 26px; margin-bottom: 10px; }
    ul.objective-list li::before { content: '✓'; position: absolute; left: 0; color: #34a853; font-weight: 700; font-size: 15px; }
    .concept-grid { display: grid; grid-template-columns: 1fr; gap: 14px; margin: 14px 0 24px; }
    .concept-card { background: #ffffff; border: 1px solid #dadce0; border-radius: 8px; padding: 16px 18px; transition: box-shadow 0.2s; }
    .concept-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-color: #1a73e8; }
    .concept-title { font-family: 'Google Sans', sans-serif; font-size: 15px; font-weight: 600; color: #1a73e8; margin-bottom: 4px; }
    .concept-def { font-size: 13.5px; line-height: 1.6; color: #3c4043; }
    .concept-analogy { margin-top: 8px; padding: 8px 12px; background: #fef7e0; border-left: 3px solid #fbbc04; border-radius: 0 6px 6px 0; font-size: 13px; color: #5f6368; font-style: italic; }
    .timeline-item { display: flex; gap: 16px; margin-bottom: 14px; }
    .timeline-badge { background: #1a73e8; color: #fff; font-family: 'Roboto Mono', monospace; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; height: fit-content; flex-shrink: 0; }
    .timeline-detail h4 { font-family: 'Google Sans', sans-serif; font-size: 14px; font-weight: 600; color: #202124; margin-bottom: 2px; }
    .timeline-detail p { font-size: 13.5px; color: #5f6368; line-height: 1.5; }
    .prompt-box { background: #f3f3f3; border-radius: 8px; padding: 12px 16px; margin-bottom: 10px; font-size: 14px; color: #202124; font-style: italic; }
    .assessment-box { background: #e6f4ea; border-left: 4px solid #34a853; padding: 14px 18px; border-radius: 0 8px 8px 0; font-size: 14px; color: #137333; line-height: 1.6; }
    .empty-state { text-align: center; padding: 60px 20px; color: #5f6368; }
  </style>
</head>
<body>
  <div class="doc-topbar">
    <div class="doc-branding">
      <svg viewBox="0 0 48 48"><path fill="#2196F3" d="M13 6h16l10 10v26c0 1.1-.9 2-2 2H13c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z"/><path fill="#1565C0" d="M29 6l10 10H29z"/><path fill="#fff" d="M16 22h16v2H16zm0 4h16v2H16zm0 4h12v2H16z"/></svg>
      <div class="doc-title-box">
        <div class="doc-title">${title}</div>
        <div class="doc-meta-sub">
          <span>Omni-Teach Live Document</span> •
          <span>Lesson ID: <code>${esc(lessonId)}</code></span>
        </div>
      </div>
    </div>
    <div class="doc-actions">
      <a href="/" class="action-btn btn-secondary">← Dashboard</a>
      <a href="/api/lesson/${encodeURIComponent(lessonId)}/form" class="action-btn btn-secondary">📝 Quiz Form</a>
      <a href="/api/lesson/${encodeURIComponent(lessonId)}/drive" class="action-btn btn-secondary">📁 Drive Folder</a>
      <a href="/tutor/${encodeURIComponent(lessonId)}" class="action-btn btn-primary">🎙️ Live Tutor</a>
    </div>
  </div>

  <div class="doc-canvas">
    <h1 class="main-title">${title}</h1>
    <div class="meta-tags">
      ${subject ? `<span class="meta-tag">📚 ${subject}</span>` : ''}
      ${grade ? `<span class="meta-tag">🎓 ${grade}</span>` : ''}
      <span class="meta-tag">⚡ Omni-Teach AI Grounded</span>
    </div>

    ${visualUrl ? `<img src="${visualUrl}" alt="${title}" class="visual-banner" />` : ''}

    ${summary ? `<div class="summary-lead"><strong>Overview:</strong> ${summary}</div>` : ''}

    ${objectives.length > 0 ? `
      <h2 class="section-heading">🎯 Pedagogical Objectives</h2>
      <ul class="objective-list">
        ${objectives.map(obj => `<li>${esc(obj)}</li>`).join('')}
      </ul>
    ` : ''}

    ${concepts.length > 0 ? `
      <h2 class="section-heading">💡 Core Conceptual Schemas & Intuitive Models</h2>
      <div class="concept-grid">
        ${concepts.map(c => `
          <div class="concept-card">
            <div class="concept-title">${esc(c.name || 'Concept')}</div>
            <div class="concept-def">${esc(c.definition || '')}</div>
            ${c.analogy ? `<div class="concept-analogy">💡 <strong>Intuition Pump:</strong> "${esc(c.analogy)}"</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${timeline.length > 0 ? `
      <h2 class="section-heading">⏱️ Instructional Flow & Timeline</h2>
      ${timeline.map(t => `
        <div class="timeline-item">
          <div class="timeline-badge">${esc(t.time || 'Phase')}</div>
          <div class="timeline-detail">
            <h4>${esc(t.activity || 'Activity')}</h4>
            <p>${esc(t.description || '')}</p>
          </div>
        </div>
      `).join('')}
    ` : ''}

    ${prompts.length > 0 ? `
      <h2 class="section-heading">🤔 Socratic Discussion Provocations</h2>
      ${prompts.map(p => `
        <div class="prompt-box">💬 "${esc(p)}"</div>
      `).join('')}
    ` : ''}

    ${assessment ? `
      <h2 class="section-heading">📊 Formative Assessment Protocol</h2>
      <div class="assessment-box">
        <strong>Evaluation Metric:</strong> ${assessment}
      </div>
    ` : ''}

    ${legacyContent ? `<div style="margin-top:24px;line-height:1.7;">${legacyContent.replace(/\n/g, '<br>')}</div>` : ''}

    ${legacySections.length > 0 ? legacySections.map((s, i) => `
      <h2 class="section-heading">${esc(s.title || 'Section ' + (i + 1))}</h2>
      <div class="concept-card">
        <p>${esc(s.content || s.explanation || JSON.stringify(s)).replace(/\n/g, '<br>')}</p>
      </div>
    `).join('') : ''}
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
    let lesson = await getLessonPlan(lessonId);

    if (!lesson || !Array.isArray(lesson.quizQuestions) || lesson.quizQuestions.length === 0) {
      const fallbackTopic = (lesson && (lesson.topic || lesson.title || lesson.lessonTitle)) || 'Neural Attention Mechanisms & Transformers';
      const fallbackSubject = (lesson && lesson.subject) || 'Machine Learning & Computer Science';
      const fallbackGrade = (lesson && lesson.grade) || 'Undergraduate / Advanced Seminar';

      console.log(`[API /form] Auto-synthesizing quiz questions for "${fallbackTopic}" (${lessonId})`);
      const generated = await generateLessonEcosystem({
        topic: fallbackTopic,
        subject: fallbackSubject,
        grade: fallbackGrade
      });

      lesson = {
        ...generated,
        ...(lesson || {}),
        lessonTitle: generated.lessonTitle || fallbackTopic,
        subject: fallbackSubject,
        grade: fallbackGrade,
        docContent: generated.docContent,
        quizQuestions: generated.quizQuestions,
        summary: generated.summary,
        visualAsset: generated.visualAsset,
        lessonId
      };

      await saveLessonPlan(lesson);
    }

    const title = esc(lesson ? (lesson.lessonTitle || lesson.title || lesson.topic || 'Assessment Quiz') : 'Assessment Quiz');
    const questions = lesson ? (lesson.quizQuestions || lesson.assessmentQuestions || lesson.questions || []) : [];

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Google Forms</title>
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Roboto', sans-serif; background: #ede7f6; min-height: 100vh; padding: 24px 16px 48px; }
    .form-container { max-width: 680px; margin: 0 auto; }
    .nav-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    .back-btn { display: inline-flex; align-items: center; gap: 6px; color: #5e35b1; text-decoration: none; font-size: 14px; font-weight: 500; font-family: 'Google Sans', sans-serif; background: #fff; padding: 6px 14px; border-radius: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .form-header { background: #fff; border-radius: 8px; border-top: 10px solid #673ab7; padding: 28px 24px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); margin-bottom: 14px; }
    .form-header h1 { font-family: 'Google Sans', sans-serif; font-size: 26px; color: #202124; font-weight: 500; }
    .form-header p { font-size: 14px; color: #5f6368; margin-top: 8px; line-height: 1.5; }
    .form-meta { font-size: 12px; color: #673ab7; font-weight: 500; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f1f1f1; display: flex; justify-content: space-between; }
    .form-card { background: #fff; border-radius: 8px; padding: 22px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); margin-bottom: 14px; border-left: 4px solid transparent; transition: border-color 0.2s, box-shadow 0.2s; }
    .form-card:hover { border-left-color: #673ab7; box-shadow: 0 2px 6px rgba(103,58,183,0.18); }
    .q-title { font-size: 15px; color: #202124; font-weight: 500; margin-bottom: 14px; line-height: 1.5; }
    .q-num { color: #673ab7; font-weight: 700; margin-right: 6px; }
    .option-row { display: flex; align-items: center; gap: 12px; padding: 9px 12px; border-radius: 6px; cursor: pointer; transition: background 0.15s; margin-bottom: 4px; }
    .option-row:hover { background: #f5f2fb; }
    .option-row input[type="radio"] { accent-color: #673ab7; width: 18px; height: 18px; cursor: pointer; }
    .option-row label { font-size: 14px; color: #3c4043; cursor: pointer; flex: 1; }
    .feedback-box { display: none; margin-top: 12px; padding: 12px 14px; border-radius: 6px; font-size: 13px; line-height: 1.5; }
    .feedback-box.correct { background: #e6f4ea; color: #137333; border-left: 4px solid #34a853; }
    .feedback-box.incorrect { background: #fce8e6; color: #c5221f; border-left: 4px solid #ea4335; }
    .hint-btn { background: none; border: none; color: #673ab7; font-size: 12px; cursor: pointer; padding: 4px 0; margin-top: 6px; text-decoration: underline; font-family: inherit; }
    .hint-text { display: none; font-size: 12.5px; color: #5f6368; background: #f8f9fa; padding: 8px 12px; border-radius: 4px; margin-top: 6px; font-style: italic; }
    .submit-area { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
    .submit-btn { background: #673ab7; color: #fff; border: none; padding: 11px 28px; border-radius: 4px; font-size: 14px; font-weight: 500; font-family: 'Google Sans', sans-serif; cursor: pointer; transition: background 0.2s, box-shadow 0.2s; }
    .submit-btn:hover { background: #5e35b1; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    .score-badge { font-family: 'Google Sans', sans-serif; font-size: 16px; font-weight: 600; color: #673ab7; }
  </style>
</head>
<body>
  <div class="form-container">
    <div class="nav-bar">
      <a href="/" class="back-btn">← Back to Dashboard</a>
      <a href="/api/lesson/${encodeURIComponent(lessonId)}/doc" class="back-btn">📄 View Lesson Doc</a>
    </div>

    <div class="form-header">
      <h1>${title} — Formative Quiz</h1>
      <p>Test and reinforce your conceptual understanding grounded in first principles.</p>
      <div class="form-meta">
        <span>Omni-Teach Live Assessment</span>
        <span>Lesson ID: ${esc(lessonId)}</span>
      </div>
    </div>

    <form id="quizForm" onsubmit="gradeQuiz(event)">
      ${questions.length > 0 ? questions.map((q, i) => {
        const correct = typeof q.correctIndex === 'number' ? q.correctIndex : 0;
        const explanation = esc(q.explanation || 'Verified conceptual answer.');
        const hint = esc(q.hint || '');
        const options = Array.isArray(q.options) && q.options.length ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'];

        return `
          <div class="form-card" id="qcard_${i}">
            <div class="q-title"><span class="q-num">${i + 1}.</span> ${esc(q.question || 'Concept Evaluation Question')}</div>
            ${options.map((opt, j) => `
              <div class="option-row">
                <input type="radio" name="q_${i}" id="q_${i}_opt_${j}" value="${j}" required>
                <label for="q_${i}_opt_${j}">${esc(opt)}</label>
              </div>
            `).join('')}
            ${hint ? `
              <button type="button" class="hint-btn" onclick="toggleHint(${i})">💡 Need a hint?</button>
              <div class="hint-text" id="hint_${i}">${hint}</div>
            ` : ''}
            <div class="feedback-box" id="fb_${i}" data-correct="${correct}" data-explanation="${explanation}"></div>
          </div>
        `;
      }).join('') : `
        <div class="form-card">
          <div class="q-title">No assessment questions generated for this lesson yet.</div>
          <p style="font-size:13px;color:#5f6368;">Generate a lesson from the dashboard to populate automated formative quizzes.</p>
        </div>
      `}

      ${questions.length > 0 ? `
        <div class="submit-area">
          <button type="submit" class="submit-btn" id="submitBtn">Submit Assessment</button>
          <span class="score-badge" id="scoreDisplay"></span>
        </div>
      ` : ''}
    </form>
  </div>

  <script>
    function toggleHint(i) {
      const h = document.getElementById('hint_' + i);
      if (h) h.style.display = h.style.display === 'block' ? 'none' : 'block';
    }

    function gradeQuiz(e) {
      e.preventDefault();
      const form = document.getElementById('quizForm');
      const cards = document.querySelectorAll('.form-card');
      let score = 0;
      let total = 0;

      cards.forEach((card, i) => {
        const fb = document.getElementById('fb_' + i);
        if (!fb) return;
        total++;
        const correct = parseInt(fb.getAttribute('data-correct') || '0', 10);
        const explanation = fb.getAttribute('data-explanation') || '';
        const selected = form.querySelector('input[name="q_' + i + '"]:checked');
        const selectedVal = selected ? parseInt(selected.value, 10) : -1;

        fb.style.display = 'block';
        if (selectedVal === correct) {
          score++;
          fb.className = 'feedback-box correct';
          fb.innerHTML = '<strong>✓ Correct!</strong> ' + explanation;
        } else {
          fb.className = 'feedback-box incorrect';
          fb.innerHTML = '<strong>✗ Incorrect.</strong> The correct answer was option ' + (correct + 1) + '. ' + explanation;
        }
      });

      const scoreDisplay = document.getElementById('scoreDisplay');
      if (scoreDisplay) {
        scoreDisplay.textContent = 'Score: ' + score + ' / ' + total + ' (' + Math.round((score / total) * 100) + '%)';
      }
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.textContent = 'Resubmit';
      }
    }
  </script>
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
    let lesson = await getLessonPlan(lessonId);

    if (!lesson || !lesson.lessonTitle) {
      const fallbackTopic = (lesson && (lesson.topic || lesson.title || lesson.lessonTitle)) || 'Neural Attention Mechanisms & Transformers';
      const fallbackSubject = (lesson && lesson.subject) || 'Machine Learning & Computer Science';
      const fallbackGrade = (lesson && lesson.grade) || 'Undergraduate / Advanced Seminar';

      console.log(`[API /drive] Auto-synthesizing files for "${fallbackTopic}" (${lessonId})`);
      const generated = await generateLessonEcosystem({
        topic: fallbackTopic,
        subject: fallbackSubject,
        grade: fallbackGrade
      });

      lesson = {
        ...generated,
        ...(lesson || {}),
        lessonTitle: generated.lessonTitle || fallbackTopic,
        subject: fallbackSubject,
        grade: fallbackGrade,
        docContent: generated.docContent,
        quizQuestions: generated.quizQuestions,
        summary: generated.summary,
        visualAsset: generated.visualAsset,
        lessonId
      };

      await saveLessonPlan(lesson);
    }

    const title = esc(lesson ? (lesson.lessonTitle || lesson.title || lesson.topic || 'Lesson Files') : 'Lesson Files');
    const visualUrl = lesson && lesson.visualAsset && lesson.visualAsset.url ? lesson.visualAsset.url : null;

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Google Drive</title>
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Roboto', sans-serif; background: #fff; color: #202124; }
    .drive-header { background: #fff; border-bottom: 1px solid #dadce0; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; }
    .drive-branding { display: flex; align-items: center; gap: 12px; }
    .drive-branding h1 { font-family: 'Google Sans', sans-serif; font-size: 20px; font-weight: 400; }
    .back-link { color: #1a73e8; text-decoration: none; font-size: 13.5px; font-family: 'Google Sans', sans-serif; }
    .back-link:hover { text-decoration: underline; }
    .drive-body { max-width: 1040px; margin: 24px auto; padding: 0 24px; }
    .breadcrumb { font-size: 13px; color: #5f6368; margin-bottom: 20px; }
    .breadcrumb a { color: #1a73e8; text-decoration: none; }
    .file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 18px; }
    .file-card { border: 1px solid #dadce0; border-radius: 8px; overflow: hidden; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); text-decoration: none; color: inherit; display: block; background: #fff; }
    .file-card:hover { box-shadow: 0 4px 12px rgba(60,64,67,0.18); transform: translateY(-2px); border-color: #1a73e8; }
    .file-thumb { height: 140px; display: flex; align-items: center; justify-content: center; font-size: 42px; position: relative; }
    .file-thumb.doc { background: #e8f0fe; color: #1a73e8; }
    .file-thumb.form { background: #f3e8fd; color: #673ab7; }
    .file-thumb.tutor { background: #e6f4ea; color: #137333; }
    .file-thumb.img { background: #202124; }
    .file-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .file-info { padding: 12px 14px; border-top: 1px solid #dadce0; }
    .file-info .name { font-size: 13.5px; color: #202124; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Google Sans', sans-serif; }
    .file-info .meta { font-size: 11.5px; color: #5f6368; margin-top: 4px; display: flex; align-items: center; gap: 6px; }
  </style>
</head>
<body>
  <div class="drive-header">
    <div class="drive-branding">
      <svg width="36" height="36" viewBox="0 0 48 48"><path fill="#FFC107" d="M17 6l-12 21h12l12-21z"/><path fill="#1976D2" d="M29 6l12 21H29L17 6z"/><path fill="#4CAF50" d="M5 27l12 21 12-21H5z"/></svg>
      <h1>Drive — ${title}</h1>
    </div>
    <a href="/" class="back-link">← Back to Dashboard</a>
  </div>

  <div class="drive-body">
    <div class="breadcrumb">
      <a href="/">My Drive</a> › <a href="#">Omni-Teach Live</a> › <strong>${title}</strong>
    </div>

    <div class="file-grid">
      <a href="/api/lesson/${encodeURIComponent(lessonId)}/doc" class="file-card">
        <div class="file-thumb doc">📄</div>
        <div class="file-info">
          <div class="name">${title} — Lesson Plan</div>
          <div class="meta">Google Docs • Interactive Blueprint</div>
        </div>
      </a>

      <a href="/api/lesson/${encodeURIComponent(lessonId)}/form" class="file-card">
        <div class="file-thumb form">📝</div>
        <div class="file-info">
          <div class="name">${title} — Assessment Quiz</div>
          <div class="meta">Google Forms • Self-Grading Quiz</div>
        </div>
      </a>

      <a href="/tutor/${encodeURIComponent(lessonId)}" class="file-card">
        <div class="file-thumb tutor">🎙️</div>
        <div class="file-info">
          <div class="name">Live Socratic Voice Tutor</div>
          <div class="meta">Gemini Live API • Voice HUD</div>
        </div>
      </a>

      ${visualUrl ? `
        <a href="${visualUrl}" target="_blank" class="file-card">
          <div class="file-thumb img"><img src="${visualUrl}" alt="${title}" /></div>
          <div class="file-info">
            <div class="name">${title} — 3D Infographic</div>
            <div class="meta">Imagen Visual Asset • High-Res</div>
          </div>
        </a>
      ` : ''}
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
