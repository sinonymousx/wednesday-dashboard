import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID || 'vast-art-329809',
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-l284l@vast-art-329809.iam.gserviceaccount.com',
} as any;

const app = getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : getApps()[0];
const db = getFirestore(app);

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const docRef = db.collection('dashboard').doc('antigravity');

    if (body.action === 'submit_objective') {
      await docRef.set({ objective: body.objective, specStatus: 'pending_spec' }, { merge: true });
    } else if (body.action === 'approve_spec') {
      await docRef.set({ specStatus: 'approved' }, { merge: true });
    } else if (body.action === 'reject_spec') {
      await docRef.set({ specStatus: 'idle', proposedSpec: null, objective: null }, { merge: true });
    } else if (body.action === 'reset_goal') {
      await docRef.set({ specStatus: 'idle', proposedSpec: null, objective: null, currentSprint: null, ticket: null, status: 'idle' }, { merge: true });
    }

    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
