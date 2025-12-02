'use client';
import { useState } from 'react';
const styles = ['Impressionism','Cyberpunk','Surrealism','Pop Art','Vaporwave','Synthwave','Minimalism','Art Deco'];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string|null>(null);

  const generate = async () => {
    if (!prompt) return;
    setLoading(true);
    const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, style }) });
    const data = await res.json();
    if (data.images?.[0]) setImage(data.images[0]);
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">🎨 SereniqArtStudio</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Describe your artwork..." className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 h-28"/>
          <div className="flex flex-wrap gap-2">{styles.map(s=><button key={s} onClick={()=>setStyle(style===s?'':s)} className={`px-3 py-1 rounded-full text-sm ${style===s?'bg-purple-500':'bg-gray-800'}`}>{s}</button>)}</div>
          <button onClick={generate} disabled={!prompt||loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 disabled:from-gray-700 disabled:to-gray-700 rounded-xl font-bold">{loading?'⏳ Generating...':'✨ Generate'}</button>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 min-h-[400px] flex items-center justify-center">
          {image ? <img src={image} className="rounded-lg max-w-full"/> : <span className="text-gray-500">🖼️ Your art here</span>}
        </div>
      </div>
    </main>
  );
}
