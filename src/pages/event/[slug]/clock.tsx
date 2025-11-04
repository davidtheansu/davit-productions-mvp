import { useRouter } from 'next/router'; import { useEffect, useState } from 'react';
export default function Clock(){ const { query } = useRouter(); const [running,setRunning]=useState(false); const [seconds,setSeconds]=useState(0);
  useEffect(()=>{ let int:any; if(running) int=setInterval(()=>setSeconds(s=>s+1),1000); return ()=>clearInterval(int); },[running]);
  async function toggle(){ await fetch('/api/clock/toggle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:query.slug})}); setRunning(r=>!r); }
  useEffect(()=>{ function poll(){ const pads = navigator.getGamepads?.()||[]; const p = pads.find(Boolean) as any; if(p&&p.buttons&&p.buttons[0]?.pressed){ toggle(); } requestAnimationFrame(poll); } poll(); },[query.slug]);
  return (<div className='container'><div className='card' style={{textAlign:'center'}}><h1>Clock – {query.slug}</h1>
    <div style={{fontSize:64,margin:'20px 0'}}>{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</div>
    <div style={{display:'flex',gap:8,justifyContent:'center'}}><button className='btn primary' onClick={toggle}>{running?'Stop':'Start'}</button><button className='btn'>Timeout</button><button className='btn'>Mark Replay (−8s)</button></div>
    <p className='small'>Selfie clickers bridged by native Ref app.</p></div></div>) }
