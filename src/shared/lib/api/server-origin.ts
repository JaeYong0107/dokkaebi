import { headers } from "next/headers";

export async function getServerOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("host");
  const forwardedProto = headerStore.get("x-forwarded-proto");
  const protocol = forwardedProto ?? "http";

  if (!host) {
    return "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}
