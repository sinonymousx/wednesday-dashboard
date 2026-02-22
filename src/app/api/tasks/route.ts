import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID || 'vast-art-329809',
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-l284l@vast-art-329809.iam.gserviceaccount.com',
} as any;

const app = getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : getApps()[0];
const db = getFirestore(app);

type TaskAction = 'complete' | 'cancel';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const taskId = String(body?.id || '').trim();
    const action = String(body?.action || '').trim() as TaskAction;

    if (!taskId || !['complete', 'cancel'].includes(action)) {
      return Response.json({ error: 'Invalid payload. Use { id, action: complete|cancel }' }, { status: 400 });
    }

    const tasksRef = db.collection('dashboard').doc('critical_tasks');
    const snap = await tasksRef.get();
    const data = snap.data() || { items: [] };
    const items = Array.isArray(data.items) ? data.items : [];

    let found = false;
    const updated = items.map((t: any) => {
      if (String(t?.id) !== taskId) return t;
      found = true;
      return {
        ...t,
        status: action === 'complete' ? 'done' : 'canceled',
        updatedAt: new Date().toISOString(),
      };
    });

    if (!found) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }

    const openCount = updated.filter((t: any) => !['done', 'canceled'].includes(String(t?.status))).length;

    await tasksRef.set(
      {
        items: updated,
        openCount,
        lastSync: new Date().toISOString(),
      },
      { merge: true }
    );

    await db.collection('dashboard').doc('activity').collection('items').add({
      type: 'task',
      title: action === 'complete' ? 'Task completed' : 'Task canceled',
      description: taskId,
      time: new Date().toLocaleTimeString(),
      timestamp: new Date().toISOString(),
      source: 'dashboard-ui',
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: 'Failed to update task', detail: String(error) }, { status: 500 });
  }
}
