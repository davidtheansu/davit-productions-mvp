import { useState } from 'react';
export default function Dashboard(){
  const [name, setName] = useState('Court A');
  const [dateISO, setDate] = useState(new Date().toISOString().slice(0,16));
  const [org, setOrg] = useState('school-001');
  const [secret, setSecret] = useState('');
  async function create(){
    const res = await fetch('/api/events/create', { method:'POST', headers:{'Content-Type':'application/json','x-admin':secret}, body: JSON.stringify({name, dateISO: new Date(dateISO).toISOString(), orgId: org})});
    const j = await res.json(); if(j.slug) location.href = `/event/${j.slug}`; else alert(j.error||'failed');
  }
  return (<div className='container'><div className='card'><h1>Organizer Dashboard</h1><div className='grid grid-2'><div className='card'>
    <h2>Create Event</h2><label>Name<br/><input value={name} onChange={e=>setName(e.target.value)} /></label><br/>
    <label>Date/Time<br/><input type='datetime-local' value={dateISO} onChange={e=>setDate(e.target.value)} /></label><br/>
    <label>Org ID<br/><input value={org} onChange={e=>setOrg(e.target.value)} /></label><br/>
    <label>Admin Secret<br/><input value={secret} onChange={e=>setSecret(e.target.value)} placeholder='server secret' /></label><br/>
    <button className='btn primary' onClick={create}>Create</button></div>
    <div className='card'><h2>Notes</h2><ul><li>Producer = full control.</li><li>Ref = click-only via native app.</li><li>Ad slots in Producer page.</li></ul></div></div></div></div>)
}
