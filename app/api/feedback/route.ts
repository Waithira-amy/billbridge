import { prisma } from "@/lib/prisma";

type FeedbackInput = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  let input: FeedbackInput;
  try {
    input = await request.json() as FeedbackInput;
  } catch {
    return Response.json({ error: "Submit a valid feedback form." }, { status: 400 });
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const subject = typeof input.subject === "string" ? input.subject.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 1 || name.length > 100) {
    return Response.json({ error: "Enter your name (up to 100 characters)." }, { status: 400 });
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (subject.length > 150) {
    return Response.json({ error: "Keep the subject under 150 characters." }, { status: 400 });
  }
  if (message.length < 1 || message.length > 5000) {
    return Response.json({ error: "Enter a message (up to 5,000 characters)." }, { status: 400 });
  }

  try {
    const feedback = await prisma.feedback.create({
      data: { name, email, subject: subject || null, message },
      select: { id: true },
    });
    return Response.json({ ok: true, id: feedback.id }, { status: 201 });
  } catch (error) {
    console.error("Unable to save feedback:", error);
    return Response.json({ error: "We couldn't save your message. Please try again." }, { status: 500 });
  }
}
