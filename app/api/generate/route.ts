import Replicate from 'replicate';
import { NextRequest, NextResponse } from 'next/server';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    let p = prompt + (style ? `, ${style} style` : '') + ', high quality, detailed';
    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: { prompt: p, num_outputs: 1, aspect_ratio: "1:1", output_format: "webp" }
    });
    return NextResponse.json({ images: output });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
