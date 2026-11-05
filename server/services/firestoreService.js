/**
 * Firestore Service for Omni-Teach Live
 * Enterprise grade persistence layer with Firebase Admin SDK and resilient fallback.
 */

const admin = require('firebase-admin');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

let db = null;
let isFirestoreConnected = false;

// Initialize Firebase Admin if credentials are present
try {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_PROJECT_ID;

  if (serviceAccountKey) {
    let serviceAccount;
    if (serviceAccountKey.trim().startsWith('{')) {
      serviceAccount = JSON.parse(serviceAccountKey);
    } else {
      const resolvedPath = path.isAbsolute(serviceAccountKey)
        ? serviceAccountKey
        : path.resolve(process.cwd(), serviceAccountKey);
      serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
    }

    const credential = (admin.credential && typeof admin.credential.cert === 'function')
      ? admin.credential.cert(serviceAccount)
      : admin.cert(serviceAccount);

    const apps = typeof admin.getApps === 'function' ? admin.getApps() : (admin.apps || []);
    const app = apps.length === 0
      ? admin.initializeApp({
          credential,
          projectId: projectId || serviceAccount.project_id
        })
      : (typeof admin.getApp === 'function' ? admin.getApp() : admin.app());

    db = typeof admin.firestore === 'function'
      ? admin.firestore()
      : require('firebase-admin/firestore').getFirestore(app);
    isFirestoreConnected = true;
    console.log('[Firestore] Connected to Google Cloud Firestore via service account.');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credential = (admin.credential && typeof admin.credential.applicationDefault === 'function')
      ? admin.credential.applicationDefault()
      : admin.applicationDefault();

    const app = admin.getApps().length === 0
      ? admin.initializeApp({
          credential,
          projectId: projectId
        })
      : admin.getApp();

    db = typeof admin.firestore === 'function'
      ? admin.firestore()
      : require('firebase-admin/firestore').getFirestore(app);
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
const LOCAL_CACHE_FILE = path.resolve(process.cwd(), '.lessons-cache.json');

// Initialize memoryStore from local disk cache if available
try {
  if (fs.existsSync(LOCAL_CACHE_FILE)) {
    const cachedData = JSON.parse(fs.readFileSync(LOCAL_CACHE_FILE, 'utf8'));
    for (const [id, rec] of Object.entries(cachedData)) {
      memoryStore.set(id, rec);
    }
    console.log(`[MemoryStore] Restored ${memoryStore.size} cached lessons from disk.`);
  }
} catch (e) {
  console.warn('[MemoryStore] Could not load disk cache:', e.message);
}

function persistCacheToDisk() {
  try {
    const obj = {};
    for (const [k, v] of memoryStore.entries()) {
      obj[k] = v;
    }
    fs.writeFileSync(LOCAL_CACHE_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (e) {
    console.warn('[MemoryStore] Disk cache save warning:', e.message);
  }
}

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

  // Always save to memory cache and persist to disk for zero-latency lookups
  memoryStore.set(lessonId, record);
  persistCacheToDisk();

  if (isFirestoreConnected && db) {
    try {
      await db.collection('lessons').doc(lessonId).set(record);
      console.log(`[Firestore] Lesson stored in collection 'lessons': ${lessonId}`);
    } catch (err) {
      console.warn('[Firestore] Write warning (saved to memory and disk cache):', err.message);
    }
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

  // 1. Check local high-speed memory cache first
  if (memoryStore.has(lessonId)) {
    return memoryStore.get(lessonId);
  }

  // 2. Query Firestore if connected
  if (isFirestoreConnected && db) {
    try {
      const doc = await db.collection('lessons').doc(lessonId).get();
      if (doc.exists) {
        const data = doc.data();
        memoryStore.set(lessonId, data);
        persistCacheToDisk();
        return data;
      }
    } catch (err) {
      console.error(`[Firestore] Read error for ${lessonId}:`, err.message);
    }
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
