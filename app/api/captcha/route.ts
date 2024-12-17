import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = process.env.CLOUDFLARE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({
      success: false,
      error: 'CLOUDFLARE_SECRET_KEY is not set',
    });
  }
  try {
    const { token } = await req.json();

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, response: token }),
      },
    );

    const data = await response.json();
    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Captcha verification failed');
    }
  } catch (error) {
    console.error('Captcha verification failed', error);
    return NextResponse.json({
      success: false,
      error: 'Captcha verification failed',
    });
  }
}
