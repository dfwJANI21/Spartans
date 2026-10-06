/**
 * Firestore Service for Omni-Teach Live
 * Enterprise grade persistence layer with Firebase Admin SDK and resilient fallback.
 */

const admin = require('firebase-admin');
const crypto = require('crypto');

let db = null;
let isFirestoreConnected = false;

// Initialize Firebase Admin if credentials are present
try {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_PROJECT_ID;

  if (serviceAccountKey) {
    let serviceAccount;
    if (serviceAccountKey.startsWith('{')) {
      serviceAccount = JSON.parse(serviceAccountKey);
    } else {
      serviceAccount = require(serviceAccountKey);
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId || serviceAccount.project_id
    });
    db = admin.firestore();
    isFirestoreConnected = true;
    console.log('[Firestore] Connected to Google Cloud Firestore via service account.');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: projectId
    });
    db = admin.firestore();
    isFirestoreConnected = true;
    console.log('[Firestore] Connected via Application Default Credentials.');
  } else {
    console.warn('[Firestore] No Firebase credentials detected. Operating in high-speed Memory/Local Cache mode.');
  }
} catch (error) {
  console.warn('[Firestore] Initialization warning (fallback active):', error.message);
}

// Resilient in-memory storage fallback for demo and hackathon zero-config runs
const memoryStore = new Map();

/**
 * Save a generated lesson ecosystem to Firestore
 * @param {Object} lessonData
 * @returns {Promise<string>} lessonId
 */
async function saveLessonPlan(lessonData) {
  const lessonId = lessonData.lessonId || `omni_${crypto.randomBytes(6).toString('hex')}`;
  const timestamp = new Date().toISOString();

  const record = {
    ...lessonData,
    lessonId,
    createdAt: timestamp,
    updatedAt: timestamp,
    status: 'ACTIVE'
  };

  if (isFirestoreConnected && db) {
    try {
      await db.collection('lessons').doc(lessonId).set(record);
      console.log(`[Firestore] Lesson stored in collection 'lessons': ${lessonId}`);
    } catch (err) {
      console.error('[Firestore] Write error, saving to memory fallback:', err.message);
      memoryStore.set(lessonId, record);
    }
  } else {
    memoryStore.set(lessonId, record);
    console.log(`[MemoryStore] Stored lesson ${lessonId} (total cached: ${memoryStore.size})`);
  }

  return lessonId;
}

/**
 * Retrieve a lesson plan by ID
 * @param {string} lessonId
 * @returns {Promise<Object|null>}
 */
async function getLessonPlan(lessonId) {
  if (!lessonId) return null;

  if (isFirestoreConnected && db) {
    try {
      const doc = await db.collection('lessons').doc(lessonId).get();
      if (doc.exists) {
        return doc.data();
      }
    } catch (err) {
      console.error(`[Firestore] Read error for ${lessonId}:`, err.message);
    }
  }

  // Check fallback memory cache
  if (memoryStore.has(lessonId)) {
    return memoryStore.get(lessonId);
  }

  return null;
}

/**
 * Record a live tutor telemetry event (sentiment switches, questions answered, duration)
 * @param {string} lessonId
 * @param {Object} sessionMetrics
 */
async function logTutorSession(lessonId, sessionMetrics) {
  const sessionId = `session_${crypto.randomBytes(4).toString('hex')}`;
  const record = {
    sessionId,
    lessonId,
    timestamp: new Date().toISOString(),
    ...sessionMetrics
  };

  if (isFirestoreConnected && db) {
    try {
      await db.collection('tutor_sessions').doc(sessionId).set(record);
    } catch (err) {
      console.error('[Firestore] Session log error:', err.message);
    }
  }

  return record;
}

module.exports = {
  isFirestoreConnected: () => isFirestoreConnected,
  saveLessonPlan,
  getLessonPlan,
  logTutorSession
};
