import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In production on Render: use Resend, Sendgrid, or Nodemailer to deliver to chavanrohan4333@gmail.com
    console.log(`[Contact Form - Target: chavanrohan4333@gmail.com] from ${name} (${email}): ${message}`);

    return NextResponse.json({ success: true, message: "Email routed successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to dispatch message" }, { status: 500 });
  }
}