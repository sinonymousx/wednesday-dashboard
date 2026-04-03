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

    const notifyDiscord = async (msg: string) => {
      const url = process.env.DISCORD_WEBHOOK_URL;
      if (!url) return;
      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: `🕷️ **Wednesday Dashboard:** ${msg}` })
        });
      } catch (e) {
        console.error("Webhook failed", e);
      }
    };

    if (body.action === 'submit_objective') {
      await docRef.set({ objective: body.objective, specStatus: 'pending_narrative', narrative: null, feedback: null, prompts: [] }, { merge: true });
      await notifyDiscord(`New overarching objective submitted: *"${body.objective}"*`);
    } else if (body.action === 'submit_feedback') {
      await docRef.set({ feedback: body.feedback, specStatus: 'pending_narrative' }, { merge: true });
      await notifyDiscord(`Narrative adjustment submitted: *"${body.feedback}"*`);
    } else if (body.action === 'approve_narrative') {
      await docRef.set({ specStatus: 'pending_spec' }, { merge: true });
      await notifyDiscord(`Narrative approved. Awaiting tactical prompts.`);
    } else if (body.action === 'approve_spec') {
      await docRef.set({ specStatus: 'active' }, { merge: true });
      await notifyDiscord(`Prompts approved. Arsenal unlocked.`);
    } else if (body.action === 'mark_prompt_active') {
      const docData = (await docRef.get()).data();
      const prompts = docData?.prompts || [];
      const updatedPrompts = prompts.map((p: any) => 
        p.id === body.promptId ? { ...p, status: 'active' } : p
      );
      await docRef.set({ prompts: updatedPrompts, status: 'running', ticket: body.promptId }, { merge: true });
      await notifyDiscord(`Prompt [${body.promptId}] activated by operator.`);
    } else if (body.action === 'mark_prompt_complete') {
      const docData = (await docRef.get()).data();
      const prompts = docData?.prompts || [];
      const updatedPrompts = prompts.map((p: any) => 
        p.id === body.promptId ? { ...p, status: 'completed' } : p
      );
      await docRef.set({ prompts: updatedPrompts, status: 'idle', ticket: null }, { merge: true });
      await notifyDiscord(`Prompt [${body.promptId}] marked complete. Standing by for next execution.`);
    } else if (body.action === 'reject_spec') {
      await docRef.set({ specStatus: 'idle', proposedSpec: null, objective: null, narrative: null, feedback: null, prompts: [] }, { merge: true });
      await notifyDiscord(`Objective rejected and reset.`);
    } else if (body.action === 'reset_goal') {
      await docRef.set({ specStatus: 'idle', proposedSpec: null, objective: null, narrative: null, feedback: null, currentSprint: null, ticket: null, status: 'idle', prompts: [] }, { merge: true });
      await notifyDiscord(`Pipeline halted and reset by operator.`);
    }

    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
