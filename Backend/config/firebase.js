// Step 1: Import Firebase Admin
import admin from 'firebase-admin';

import serviceAccount from './react-firebase-project-c9c8e-firebase-adminsdk-fbsvc-5d35441736.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

export default db;