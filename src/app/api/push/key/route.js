/**
 * /api/push/key
 *
 * GET — Returns the VAPID public key dynamically from the server environment.
 * Exposing this via an API ensures the client can always retrieve the VAPID public
 * key at runtime, bypassing any Next.js build-time environment variable injection issues.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) {
    console.error("VAPID public key is not set on the server environment variables");
    return Response.json({ error: "VAPID key not configured" }, { status: 500 });
  }
  return Response.json({ publicKey });
}
