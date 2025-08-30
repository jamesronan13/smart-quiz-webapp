
/**
 * Upload quizzes.json to Firestore
 * Usage:
 * 1) Put this file (upload_quizzes.js) and quizzes.json in the same folder.
 * 2) Download your service account key as serviceAccountKey.json (from Firebase Console -> Project Settings -> Service accounts -> Generate new private key).
 * 3) Run:
 *    npm init -y
 *    npm install firebase-admin
 *    node upload_quizzes.js
 */
const fs = require('fs');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

(async () => {
  try {
    const raw = fs.readFileSync('./quizzes.json', 'utf8');
    const data = JSON.parse(raw);

    if (!data.quizzes) {
      throw new Error("Invalid JSON: missing top-level 'quizzes' key.");
    }

    const entries = Object.entries(data.quizzes);

    for (const [category, docData] of entries) {
      if (!docData.questions || !Array.isArray(docData.questions)) {
        console.warn(`Skipping ${category}: no questions array found.`);
        continue;
      }
      await db.collection('quizzes').doc(category).set(docData, { merge: true });
      console.log(`✅ Uploaded '${category}' with ${docData.questions.length} questions.`);
    }

    console.log('🎉 All done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Upload failed:', err);
    process.exit(1);
  }
})();
