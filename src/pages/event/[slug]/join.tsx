import { useRouter } from 'next/router'; import { useEffect, useState } from 'react';
export default function Join(){ const { query, push } = useRouter(); const [err, setErr] = useState('');
  useEffect(()=>{ async function go(){ const r = await fetch(`/api/events/resolve?slug=${query.slug}&r=${query.r}&t=${query.t}`); const j = await r.json(); if(j.error) setErr(j.error); else push(j.dest); }
    if(query.slug && query.r && query.t) go(); }, [query.slug, query.r, query.t]); return <div className='container'><div className='card'>{err || 'Checking…'}</div></div> }
