import { useRouter } from 'next/router'; import useSWR from 'swr'; import { useEffect, useState } from 'react';
function useClock(slug:string){ const { data, mutate } = useSWR(`/api/clock/get?slug=${slug}`, r=>fetch(r).then(d=>d.json()), { refreshInterval: 1000 });
  async function toggle(){ await fetch('/api/clock/toggle', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slug })}); mutate(); } return { clock: data?.clock, toggle }; }
export default function Director(){ const { query } = useRouter(); const { clock, toggle } = useClock(String(query.slug||'')); const [ads, setAds] = useState<any[]>([]);
  useEffect(()=>{ async function load(){ const r = await fetch(`/api/events/get?slug=${query.slug}`); const j = await r.json(); setAds(j.event?.ads?.slots||[]); } if(query.slug) load(); }, [query.slug]);
  return (<div className='container'><div className='card'><h1>Director – {query.slug}</h1><div className='grid grid-3'>
    <div className='card'><h2>Program / Preview</h2><div className='qr' style={{width:'100%',height:'220px'}}>Video Canvas</div>
      <div style={{display:'flex',gap:8,marginTop:8}}><button className='btn primary'>Cut</button><button className='btn'>Auto</button><button className='btn'>Replay (−8s)</button></div></div>
    <div className='card'><h2>Overlays</h2><label><input type='checkbox' defaultChecked/> Scorebug</label><br/><label><input type='checkbox'/> Lower Third</label><br/>
      <label><input type='checkbox'/> Player Tag</label><br/><label><input type='checkbox'/> Sponsor Slate</label><br/><div className='small'>HTML Overlay layer.</div>
      <h2 style={{marginTop:12}}>Clock</h2><div className='badge'>{clock?.running?'RUNNING':'PAUSED'}</div><div className='small'>{Math.floor((clock?.ms||0)/1000)}s • Period {clock?.period}</div>
      <div style={{display:'flex',gap:8,marginTop:8}}><button className='btn' onClick={toggle}>Start/Stop</button><button className='btn'>Timeout</button></div></div>
    <div className='card'><h2>Commercial Playlist</h2>{ads.map((s:any)=>(<div key={s.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #eee'}}>
      <div>{s.id} – {s.label} {s.url?'✅':''}</div><button className='btn'>Preview</button></div>))}<div style={{display:'flex',gap:8,marginTop:8}}><button className='btn'>Run Next</button><button className='btn'>Ad Break</button></div></div>
  </div></div></div>) }
