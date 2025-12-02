const API_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
const STATIC_TOKEN = process.env.DIRECTUS_STATIC_TOKEN!;

export async function directusFetch(endpoint: string, params = {}) {
  const url = new URL(`${API_URL}/${endpoint}`);

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value as string)
  );

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${STATIC_TOKEN}`,
    },
    cache: "no-cache",
  });

  if (!res.ok) throw new Error(`Directus fetch failed: ${res.status}`);

  return res.json();
}

