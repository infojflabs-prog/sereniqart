import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 });

    const fullPrompt = prompt + (style ? `, ${style} style` : '') + ', high quality, detailed artwork';

    const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { prompt: fullPrompt, num_outputs: 1, aspect_ratio: "1:1" }
      }),
    });

    const prediction = await response.json();
    
    // Poll for result
    let result = prediction;
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(r => setTimeout(r, 1000));
      const poll = await fetch(result.urls.get, {
        headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
      });
      result = await poll.json();
    }

    if (result.status === 'failed') {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ images: result.output });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
