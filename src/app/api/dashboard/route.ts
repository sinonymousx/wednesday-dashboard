import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID || 'vast-art-329809',
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-l284l@vast-art-329809.iam.gserviceaccount.com',
} as any;

const app = getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : getApps()[0];
const db = getFirestore(app);

export async function GET() {
  try {
    // Get recent activities from Firestore
    const activitySnap = await db.collection('dashboard').doc('activity').collection('items')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const activity = activitySnap.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        time: data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : ''
      };
    });

    // Get memory files list
    const filesDoc = await db.collection('dashboard').doc('memory').get();
    const filesData = filesDoc.data() || { files: [] };

    // Get current status
    const statusDoc = await db.collection('dashboard').doc('status').get();
    const status = statusDoc.data() || { isRunning: false, currentTask: null };

    // Get stats
    const statsDoc = await db.collection('dashboard').doc('stats').get();
    const stats = statsDoc.data() || { heartbeatsToday: 0, pipeline: 0 };

    // Get critical tasks
    const tasksDoc = await db.collection('dashboard').doc('critical_tasks').get();
    const tasksData = tasksDoc.data() || { items: [] };

    // Get onboarding tracker
    const onboardingDoc = await db.collection('dashboard').doc('onboarding').get();
    const onboarding = onboardingDoc.data() || { items: [], totalOpen: 0 };

    return Response.json({
      activity,
      memoryFiles: filesData.files || [],
      isRunningTask: status.isRunning || false,
      currentTask: status.currentTask || null,
      telemetry: status.telemetry || null,
      stats,
      criticalTasks: tasksData.items || [],
      onboarding
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return fallback data if Firebase fails
    return Response.json({
      activity: [{
        type: 'error',
        title: 'Firebase Error',
        description: 'Could not connect to Firestore',
        time: new Date().toLocaleTimeString()
      }],
      memoryFiles: [],
      isRunningTask: false,
      currentTask: null,
      telemetry: null,
      stats: { heartbeatsToday: 0, pipeline: 0 },
      criticalTasks: [],
      onboarding: { items: [], totalOpen: 0 }
    });
  }
}
