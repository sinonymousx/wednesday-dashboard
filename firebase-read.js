require('dotenv').config();
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const firestore = require('firebase-admin/firestore');

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

const app = getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : getApps()[0];
const db = firestore.getFirestore(app);

async function check() {
  const doc = await db.collection('dashboard').doc('antigravity').get();
  console.log(JSON.stringify(doc.data(), null, 2));
  process.exit(0);
}

check();