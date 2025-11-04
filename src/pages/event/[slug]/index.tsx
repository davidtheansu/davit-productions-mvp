import React, { useEffect, useMemo, useState } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import QRCode from "qrcode";

// ---- Server: read slug from URL so the page never "hangs" ----
export const getServerSideProps: GetServerSideProps<{
  slug: string;
  originEnv: string;
}> = async (ctx) => {
  const slug = String(ctx.params?.slug || "");
  if (!slug) return { notFound: true };

  // Use env origin if provided; client will fall back to window.origin
  const originEnv = process.env.NEXT_PUBLIC_BASE_URL || "";
  return { props: { slug, originEnv } };
};

// Build absolute https:// links
function abs(originEnv: string, path: string) {
  // Fallback to a dummy base; client will not use this value directly
  const base = originEnv || "http://localhost";
  return new URL(path, base).toString();
}

type LinkItem = { label: string; url: string };

export default function EventQRPage({
  slug,
  originEnv,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Build absolute links (server gives origin; if you later need window.origin, you can recompute on client)
  const links: LinkItem[] = useMemo(() => {
    const mk = (label: string, path: string) => ({
      label,
      url: abs(originEnv, path),
    });
    return [
      mk("Producer", `/event/${slug}/join?r=producer`),
      mk("Director", `/event/${slug}/join?r=director`),
      mk("Clock", `/event/${slug}/join?r=clock`),
      mk("Cam 1", `/event/${slug}/join?r=cam1`),
      mk("Cam 2", `/event/${slug}/join?r=cam2`),
      mk("Cam 3", `/event/${slug}/join?r=cam3`),
      mk("Cam 4", `/event/${slug}/join?r=cam4`),
      mk("Viewer (public)", `/event/${slug}/viewer`),
    ];
  }, [slug, originEnv]);

  const [qrs, setQrs] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const out: Record<string, string> = {};
      for (const l of links) {
        out[l.label] = await QRCode.toDataURL(l.url, { margin: 1 });
      }
      setQrs(out);
    })();
  }, [links]);

  return (
    <div className="container">
      <div className="card">
        <h1>Event: {slug}</h1>
        <p>
          Scan a QR on each device. Cameras use <b>Cam 1–4</b>. Share{" "}
          <b>Viewer (public)</b> with fans.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {links.map((l) => (
          <div className="card" key={l.label} style={{ textAlign: "center" }}>
            <h3>{l.label}</h3>
            {qrs[l.label] ? (
              <img
                src={qrs[l.label]}
                alt={l.label}
                style={{ width: 200, height: 200 }}
              />
            ) : (
              <div
                style={{
                  width: 200,
                  height: 200,
                  background: "#eee",
                  display: "inline-block",
                }}
              />
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
