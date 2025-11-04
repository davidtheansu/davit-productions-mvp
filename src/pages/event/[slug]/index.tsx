import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

// Always emit absolute https:// links
const ORIGIN =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

function abs(path: string) {
  return new URL(path, ORIGIN).toString();
}

type LinkItem = { label: string; url: string };

export default function EventQRPage() {
  const router = useRouter();
  const ready = router.isReady; // <-- key fix
  const slug = ready ? String(router.query.slug || "") : "";

  // (If you have real tokens, insert them here.)
  const prodToken = "";
  const dirToken = "";
  const clkToken = "";
  const cam1Token = "";
  const cam2Token = "";
  const cam3Token = "";
  const cam4Token = "";

  const links: LinkItem[] = useMemo(() => {
    if (!ready || !slug) return [];
    return [
      { label: "Producer", url: abs(`/event/${slug}/join?r=producer&t=${prodToken}`) },
      { label: "Director", url: abs(`/event/${slug}/join?r=director&t=${dirToken}`) },
      { label: "Clock",    url: abs(`/event/${slug}/join?r=clock&t=${clkToken}`) },
      { label: "Cam 1",    url: abs(`/event/${slug}/join?r=cam1&t=${cam1Token}`) },
      { label: "Cam 2",    url: abs(`/event/${slug}/join?r=cam2&t=${cam2Token}`) },
      { label: "Cam 3",    url: abs(`/event/${slug}/join?r=cam3&t=${cam3Token}`) },
      { label: "Cam 4",    url: abs(`/event/${slug}/join?r=cam4&t=${cam4Token}`) },
      { label: "Viewer (public)", url: abs(`/event/${slug}/viewer`) },
    ];
  }, [ready, slug]);

  const [qrs, setQrs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!links.length) return;
    (async () => {
      const out: Record<string, string> = {};
      for (const l of links) {
        out[l.label] = await QRCode.toDataURL(l.url, { margin: 1 });
      }
      setQrs(out);
    })();
  }, [links]);

  if (!ready) {
    return (
      <div className="container"><div className="card"><h1>Loading event…</h1></div></div>
    );
  }

  if (!slug) {
    return (
      <div className="container"><div className="card">
        <h1>Event not found</h1>
        <p>Open this page from the Dashboard after creating an event.</p>
      </div></div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Event: {slug}</h1>
        <p style={{marginTop:8}}>
          Scan a QR on each device. Cameras use <b>Cam 1–4</b>. Share the
          <b> Viewer (public)</b> link with fans.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16
      }}>
        {links.map((l) => (
          <div className="card" key={l.label} style={{ textAlign: "center" }}>
            <h3>{l.label}</h3>
            {qrs[l.label]
              ? <img src={qrs[l.label]} alt={l.label} style={{ width: 200, height: 200 }} />
              : <div style={{ width: 200, height: 200, background: "#eee", display: "inline-block" }} />
            }
            <div style={{ fontSize: 12, marginTop: 8, wordBreak: "break-all" }}>{l.url}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
