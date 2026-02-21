/**
 * Dashboard Firebase Sync
 * Writes activity, status, and stats to Firestore for real-time dashboard updates
 * 
 * Collections structure:
 * - dashboard/activity/items/{docId} - Activity log entries
 * - dashboard/status - Current status (isRunning, currentTask)
 * - dashboard/stats - Statistics (heartbeatsToday, pipeline)
 * - dashboard/memory - Memory files list
 */

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const firestore = require('firebase-admin/firestore');

function getDb() {
  const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID || 'vast-art-329809',
    private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-l284l@vast-art-329809.iam.gserviceaccount.com',
  };

  const app = getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : getApps()[0];
  return firestore.getFirestore(app);
}

// Write activity to dashboard/activity/items
async function writeActivity(title, description, type = 'heartbeat') {
  try {
    const db = getDb();
    const docRef = await db.collection('dashboard').doc('activity').collection('items').add({
      title,
      description,
      type,
      timestamp: new Date().toISOString(),
    });
    console.log(`✅ Activity logged: ${title}`);
    return docRef.id;
  } catch (e) {
    console.error('Failed to write activity:', e.message);
    return null;
  }
}

// Update status in dashboard/status
async function updateStatus(isRunning, currentTask = null) {
  try {
    const db = getDb();
    await db.collection('dashboard').doc('status').set({
      isRunning,
      currentTask,
      lastUpdate: new Date().toISOString(),
    });
    console.log(`✅ Status updated: ${isRunning ? 'Running' : 'Idle'}`);
  } catch (e) {
    console.error('Failed to update status:', e.message);
  }
}

// Update stats in dashboard/stats
async function updateStats(heartbeatsToday, pipeline = 0) {
  try {
    const db = getDb();
    await db.collection('dashboard').doc('stats').set({
      heartbeatsToday,
      pipeline,
      lastUpdate: new Date().toISOString(),
    });
    console.log(`✅ Stats updated: ${heartbeatsToday} heartbeats, ${pipeline} pipeline`);
  } catch (e) {
    console.error('Failed to update stats:', e.message);
  }
}

// CLI handler
const args = process.argv.slice(2);
const command = args[0];

if (command === 'activity') {
  const title = args[1] || 'Heartbeat';
  const description = args[2] || '';
  const type = args[3] || 'heartbeat';
  writeActivity(title, description, type).then(() => process.exit(0));
} else if (command === 'status') {
  const running = args[1] === 'true';
  const task = args[2] || null;
  updateStatus(running, task).then(() => process.exit(0));
} else if (command === 'stats') {
  const heartbeats = parseInt(args[1] || '0');
  const pipeline = parseInt(args[2] || '0');
  updateStats(heartbeats, pipeline).then(() => process.exit(0));
} else {
  console.log('Usage: node dashboard-firebase.js <command> [args]');
  console.log('Commands:');
  console.log('  activity "title" "description" [type]');
  console.log('  status true|false [task]');
  console.log('  stats <heartbeats> <pipeline>');
}
