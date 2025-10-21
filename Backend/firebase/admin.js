import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get current directory path for relative file loading
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ⚠️ SECURITY NOTE: The path MUST be correct. Adjust the path below if needed.
const serviceAccountPath = resolve(__dirname, './react-firebase-project-c9c8e-firebase-adminsdk-fbsvc-5d35441736.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

try {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin SDK initialized successfully.");
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

const auth = admin.auth();
const db = admin.firestore();

// Export both auth and db instances
export { auth, db };