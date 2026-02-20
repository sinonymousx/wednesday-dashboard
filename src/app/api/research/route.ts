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
    const researchSnap = await db.collection('dashboard').doc('research').collection('items')
      .orderBy('updatedAt', 'desc')
      .get();

    const items = researchSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    return Response.json({ items });
  } catch (error) {
    console.error("Error fetching research data:", error);
    return Response.json({ items: [], error: error.message });
  }
}
