import { useRouter } from 'next/router'; import useSWR from 'swr'; import { useState } from 'react';
export default function Producer(){ const { query } = useRouter(); const { data, mutate } = useSWR(query.slug?`/api/events/get?slug=${query.slug}`:null, r=>fetch(r).then(d=>d.json()));
  const [url,setUrl]=useState(''); const [slot,setSlot]=useState('A'); const [kind,setKind]=useState('sponsor'); const [dur,setDur]=useState(15);
  async function save(){ const r = await fetch('/api/ads/slot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:query.slug,id:slot,url,kind,dur})}); if(r.ok){ setUrl(''); mutate(); } }
  if(!data) return <div className='container'><div className='card'>Loading…</div></div>; const e=data.event;
  return (<div className='container'><div className='card'><h1>Producer – {e.name}</h1><div className='grid grid-2'>
    <div className='card'><h2>Ad Slots (A–D)</h2>{e.ads.slots.map((s:any)=>(<div key={s.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #eee'}}>
      <div><b>{s.id}</b> – {s.label} {s.url?'✅':''}</div><div className='small mono'>{s.url||''}</div></div>))}</div>
    <div className='card'><h2>Upload / Set Slot</h2><label>Slot <select value={slot} onChange={e=>setSlot(e.target.value)}><option>A</option><option>B</option><option>C</option><option>D</option></select></label><br/>
      <label>Kind <select value={kind} onChange={e=>setKind(e.target.value)}><option value='sponsor'>Sponsor</option><option value='commercial'>Commercial</option></select></label><br/>
      <label>Duration (s) <input type='number' value={dur} onChange={e=>setDur(parseInt(e.target.value||'0'))} /></label><br/>
      <label>Video URL (MP4 or cloud link)<br/><input value={url} onChange={e=>setUrl(e.target.value)} placeholder='https://...'/></label><br/>
      <button className='btn primary' onClick={save}>Save Slot</button><p className='small'>Store URL only in MVP.</p></div></div></div></div>) }
