import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID || 'vast-art-329809',
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-l284l@vast-art-329809.iam.gserviceaccount.com',
} as any;

const app = getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : getApps()[0];
const db = getFirestore(app);

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const pageId = String(body?.pageId || '').trim();
    const task = String(body?.task || '').trim();
    const done = Boolean(body?.done);

    if (!pageId || !task) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const key = `${pageId}::${task}`;
    const ref = db.collection('dashboard').doc('onboarding_overrides');
    const snap = await ref.get();
    const data = snap.data() || { doneItems: [] };
    const current = Array.isArray(data.doneItems) ? data.doneItems : [];

    const next = done
      ? Array.from(new Set([...current, key]))
      : current.filter((x: string) => x !== key);

    await ref.set({ doneItems: next, lastUpdated: new Date().toISOString() }, { merge: true });

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: 'Failed to update onboarding override', detail: String(e) }, { status: 500 });
  }
}
