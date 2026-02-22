const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Load env vars from .env.local if present, but since we are running this manually,
// we might need to rely on the environment variables already set in the shell or OpenClaw config.
// For now, we'll try to use the ones from process.env

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID || 'vast-art-329809',
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-l284l@vast-art-329809.iam.gserviceaccount.com',
};

if (!serviceAccount.private_key) {
  console.error("Error: FIREBASE_PRIVATE_KEY is missing.");
  process.exit(1);
}

const app = getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : getApps()[0];
const db = getFirestore(app);

async function seed() {
  console.log("💀 Seeding dashboard with lethal data...");

  // 1. Status
  await db.collection('dashboard').doc('status').set({
    isRunning: true,
    currentTask: "Analyzing competitor weakness vectors...",
    lastUpdated: new Date().toISOString()
  });
  console.log("✓ Status updated");

  // 2. Stats
  await db.collection('dashboard').doc('stats').set({
    heartbeatsToday: 42,
    pipeline: 13,
    filesProcessed: 156,
    threatsNeutralized: 7
  });
  console.log("✓ Stats updated");

  // 3. Activity Feed
  const activities = [
    {
      type: 'heartbeat',
      title: 'System Optimization',
      description: 'Purged 245mb of redundant cache data.',
      timestamp: new Date().toISOString()
    },
    {
      type: 'research',
      title: 'Competitor Analysis',
      description: 'Detected new pricing model from target entity.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
    },
    {
      type: 'task',
      title: 'Newsletter Generation',
      description: 'Drafting weekly update. Tone: Ominous.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
    },
    {
      type: 'error',
      title: 'API Rate Limit',
      description: 'Exceeded quota on external probe. Retrying...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
    }
  ];

  const batch = db.batch();
  for (const act of activities) {
    const ref = db.collection('dashboard').doc('activity').collection('items').doc();
    batch.set(ref, act);
  }
  await batch.commit();
  console.log("✓ Activity feed seeded");

  // 4. Memory Files
  await db.collection('dashboard').doc('memory').set({
    files: [
      "strategy/q1-dominance.md",
      "competitors/dossier-alpha.json",
      "logs/error-trace-2026.log",
      "plans/contingency-protocols.txt"
    ]
  });
  console.log("✓ Memory files seeded");

  console.log("💀 Dashboard is now alive.");
  process.exit(0);
}

seed().catch(console.error);
