import { useRouter } from "next/router";
import { useEffect } from "react";

const validRoles = new Set([
  "producer",
  "director",
  "clock",
  "viewer",
  "announcer",
]);

export default function JoinRedirect() {
  const router = useRouter();
  const { slug, r, t } = router.query as { slug?: string; r?: string; t?: string };

  useEffect(() => {
    if (!slug || !r) return;

    const role = String(r).toLowerCase();

    // Cameras like cam1, cam2, ..., cam8
    if (/^cam\d+$/i.test(role)) {
      router.replace(`/event/${slug}/camera/${role}`);
      return;
    }

    // Known control roles
    if (validRoles.has(role)) {
      const q = t ? `?t=${encodeURIComponent(t)}` : "";
      router.replace(`/event/${slug}/${role}${q}`);
      return;
    }

    // Fallback to event hub
    router.replace(`/event/${slug}`);
  }, [slug, r, t, router]);

  return (
    <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1>Joining…</h1>
      <p>If this page doesn’t change automatically, tap Reload.</p>
    </div>
  );
}
