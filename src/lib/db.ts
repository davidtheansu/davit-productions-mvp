import { v4 as uuid } from 'uuid';
export type Role = 'producer'|'director'|'announcer'|'scorekeeper'|'refRemote'|'cam1'|'cam2'|'cam3'|'cam4'|'cam5'|'cam6'|'cam7'|'cam8'|'viewer';
export type Event = { id:string; slug:string; name:string; dateISO:string; orgId:string; createdAt:number;
  roles: Record<Role, { url:string; token:string }>; clock:{ running:boolean; ms:number; period:number };
  ads:{ slots:{ id:string; label:string; url?:string; kind?:'sponsor'|'commercial'; dur?:number }[] } };
const store:{ events:Record<string,Event> } = { events:{} };
export function createEvent({ name, dateISO, orgId }:{ name:string; dateISO:string; orgId:string }): Event {
  const slug = `${dateISO.split('T')[0]}-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${(Math.random()*1000|0)}`;
  const id = uuid(); const base = process.env.NEXT_PUBLIC_BASE_URL || ''; const roles:Role[]=['producer','director','announcer','scorekeeper','refRemote','cam1','cam2','cam3','cam4','cam5','cam6','cam7','cam8','viewer'];
  const roleMap:any={}; for(const r of roles){ const token = uuid(); roleMap[r] = { token, url: `${base}/event/${slug}/join?r=${r}&t=${token}` } }
  const evt:Event = { id, slug, name, dateISO, orgId, createdAt: Date.now(), roles: roleMap, clock: { running:false, ms:0, period:1 },
    ads:{ slots:[{id:'A',label:'Sponsor (15s)'},{id:'B',label:'Sponsor (30s)'},{id:'C',label:'Commercial (15s)'},{id:'D',label:'Commercial (30s)'}] } };
  store.events[slug]=evt; return evt;
}
export function getEvent(slug:string){ return store.events[slug] }
export function allEvents(){ return Object.values(store.events) }
export function updateClock(slug:string, patch:Partial<Event['clock']>){ const e=getEvent(slug); if(!e) return; e.clock={...e.clock,...patch}; return e.clock }
export function setAdSlot(slug:string, payload:{id:string;url?:string;kind?:'sponsor'|'commercial';dur?:number}){
  const e=getEvent(slug); if(!e) return; const slot=e.ads.slots.find(s=>s.id===payload.id); if(!slot) return; Object.assign(slot,payload); return e.ads.slots;
}
