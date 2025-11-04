import QRCode from "qrcode";
import type { GetServerSideProps } from "next";

const ORIGIN =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

function abs(path: string) {
  return new URL(path, ORIGIN).toString();
}

type Props = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const slug = String(ctx.params?.slug || "");
  if (!slug) {
    // No slug in URL → show 404
    return { notFound: true };
  }
  return { props: { slug } };
};

export default function EventQRPage({ slug }: Props) {
  // If you later need tokens, fetch them client-side or server-side and insert here.
  const links = [
    { label: "Producer", url: abs(`/event/${slug}/join?r=producer`) },
    { label: "Director", url: abs(`/event/${slug}/join?r=director`) },
    { label: "Clock",    url: abs(`/event/${slug}/join?r=clock`) },
    { label: "Cam 1",    url: abs(`/event/${slug}/join?r=cam1`) },
    { label: "Cam 2",    url: abs(`/event/${slug}/join?r=cam2`) },
    { label: "Cam 3",    url: abs(`/event/${slug}/join?r=cam3`) },
    { label: "Cam 4",    url: abs(`/event/${slug}/join?r=cam4`) },
    { label: "Viewer (public)", url: abs(`/event/${slug}/viewer`) },
  ];

  return (
    <div className="container">
      <div className="card">
        <h1>Event: {slug}</h1>
        <p>Scan a QR on each device. Cameras use Cam 1–4. Share “Viewer (public)” with fans.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
        {links.map((l) => (
          <QRCard key={l.label} label={l.label} url={l.url} />
        ))}
      </div>
    </div>
  );
}

function QRCard({ label, url }: { label: string; url: string }) {
  const [dataUrl, setDataUrl] = (global as any).React?.useState<string>("");

  (global as any).React?.useEffect(() => {
    QRCode.toDataURL(url, { margin: 1 }).then(setDataUrl);
  }, [url]);

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h3>{label}</h3>
      {dataUrl
        ? <img src={dataUrl} alt={label} style={{ width: 200, height: 200 }} />
        : <div style={{ width: 200, height: 200, background: "#eee", display: "inline-block" }} />
      }
      <div style={{ fontSize: 12, marginTop: 8, wordBreak: "break-all" }}>{url}</div>
    </div>
  );
}
