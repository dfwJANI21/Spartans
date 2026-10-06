/**
 * Lesson Routes for Omni-Teach Live
 * Handles multimodal ingestion, DAG orchestration, and Firestore retrieval.
 */

const express = require('express');
const multer = require('multer');
const router = express.Router();

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

    // DAG Step 3: Google Workspace Orchestrator (Drive, Doc, Form)
    console.log('[DAG] Step 3: Orchestrating Google Workspace (Drive, Docs, Forms)...');
    const workspaceResult = await orchestrateWorkspaceEcosystem({
      ...aiResult,
      topic,
      subject,
      grade
    });

    // DAG Step 4: Persist to Firestore
    console.log('[DAG] Step 4: Storing Lesson Ecosystem in Firestore...');
    const completeLessonRecord = {
      ...aiResult,
      workspace: workspaceResult,
      topic,
      subject,
      grade,
      rawPrompt
    };

    const lessonId = await saveLessonPlan(completeLessonRecord);
    completeLessonRecord.lessonId = lessonId;

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

module.exports = router;
