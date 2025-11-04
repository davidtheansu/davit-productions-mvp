import { useRouter } from 'next/router';
import useSWR from 'swr';
export default function EventHome(){
  const { query } = useRouter();
  const { data } = useSWR(query.slug ? `/api/events/get?slug=${query.slug}` : null, r=>fetch(r).then(d=>d.json()));
  if(!data) return <div className="container"><div className="card">Loading…</div></div>;
  const e = data.event;
  return (<div className='container'><div className='card'><h1>{e.name}</h1><div className='small'>slug: <span className='badge'>{e.slug}</span></div>
    <div className='grid grid-3'>{Object.entries(e.roles).map(([role, obj]:any)=>(<div className='card' key={role}><h2>{role}</h2>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <img alt='qr' className='qr' src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(obj.url)}`} />
        <div className='small' style={{wordBreak:'break-all'}}>{obj.url}</div></div></div>))}</div></div></div>)
}
