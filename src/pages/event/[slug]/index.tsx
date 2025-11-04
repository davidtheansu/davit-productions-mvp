import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

// Helper: always produce absolute https:// links
const ORIGIN =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

function abs(path: string) {
  return new URL(path, ORIGIN).toString();
}

type LinkItem = { label: string; url: string };

export default function EventQRPage() {
  const router = useRouter();
  const { slug } = router.query as { slug?: string };

  // (Optional) if you already fetch tokens per role, plug them in here.
  // For now tokens are omitted or mocked. Replace as needed.
  const prodToken = ""; // e.g. from your API
  const dirToken = "";
  const clkToken = "";
  const cam1Token = "";
  const cam2Token = "";
  const cam3Token = "";
  const cam4Token = "";

  const links: LinkItem[] = useMemo(() => {
    if (!slug) return [];
    return [
      { label: "Producer", url: abs(`/event/${slug}/join?r=producer&t=${prodToken}`) },
      { label: "Director", url: abs(`/event/${slug}/join?r=director&t=${dirToken}`) },
      { label: "Clock",    url: abs(`/event/${slug}/join?r=clock&t=${clkToken}`) },
      { label: "Cam 1",    url: abs(`/event/${slug}/join?r=cam1&t=${cam1Token}`) },
      { label: "Cam 2",    url: abs(`/event/${slug}/join?r=cam2&t=${cam2Token}`) },
      { label: "Cam 3",    url: abs(`/event/${slug}/join?r=cam3&t=${cam3Token}`) },
      { label: "Cam 4",    url: abs(`/event/${slug}/join?r=cam4&t=${cam4Token}`) },
      // Viewers usually get a plain link (no QR needed), but we include it for convenience:
      { label: "Viewer (public)", url: abs(`/event/${slug}/viewer`) },
    ];
  }, [slug]);

  const [qrs, setQrs] = useState<Record<string, string>>({}); // label -> dataURL

  useEffect(() => {
    (async () => {
      const out: Record<string, string> = {};
      for (const l of links) {
        out[l.label] = await QRCode.toDataURL(l.url, { margin: 1 });
      }
      setQrs(out);
    })();
  }, [links]);

  if (!slug) {
    return <div className="container"><div className="card"><h1>Loading event…</h1></div></div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Event: {slug}</h1>
        <p style={{marginTop:8}}>
          Scan a QR on each device. Camera phones use <b>Cam 1–4</b>. Producer/Director use their links.
          Viewers should use the <b>Viewer (public)</b> link (share this one).
        </p>
      </div>

      <div className="grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16
      }}>
        {links.map((l) => (
          <div className="card" key={l.label} style={{ textAlign: "center" }}>
            <h3>{l.label}</h3>
            {qrs[l.label] ? (
              <img src={qrs[l.label]} alt={l.label} style={{ width: 200, height: 200 }} />
            ) : (
              <div style={{ width: 200, height: 200, display: "inline-block", background: "#eee" }} />
            )}
            <div style={{ fontSize: 12, marginTop: 8, wordBreak: "break-all" }}>
              {l.url}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
