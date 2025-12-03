// lib/directus.ts
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const STATIC_TOKEN = process.env.NEXT_PUBLIC_DIRECTUS_STATIC_TOKEN;

export async function directusFetch(
  endpoint: string,
  params: Record<string, any> = {}
) {
  const url = new URL(`${DIRECTUS_URL}/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(STATIC_TOKEN ? { Authorization: `Bearer ${STATIC_TOKEN}` } : {}),
  };

  const res = await fetch(url.toString(), {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Directus fetch failed: ${res.status}`);
  }

  return res.json();
}
