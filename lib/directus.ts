// lib/directus.ts
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const STATIC_TOKEN = process.env.NEXT_PUBLIC_DIRECTUS_STATIC_TOKEN;
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID; // e.g. "1"

type Params = Record<string, any>;

interface DirectusFetchOptions {
  tenant?: boolean; // default true
}

function paramsAlreadyHaveTenantFilter(params: Params): boolean {
  return Object.keys(params).some(
    (k) => k === "filter[tenant_id][_eq]" || k.startsWith("filter[tenant_id]")
  );
}

export async function directusFetch(
  endpoint: string,
  params: Params = {},
  options: DirectusFetchOptions = {}
) {
  if (!DIRECTUS_URL) {
    throw new Error("NEXT_PUBLIC_DIRECTUS_URL is not set");
  }

  const useTenant = options.tenant !== false;

  // Inject tenant filter by default (unless disabled or already present)
  if (useTenant && TENANT_ID && !paramsAlreadyHaveTenantFilter(params)) {
    params = { ...params, "filter[tenant_id][_eq]": TENANT_ID };
  }

  const url = new URL(`${DIRECTUS_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // Allow array values (handy for some Directus params), otherwise stringify
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, String(v)));
    } else {
      url.searchParams.append(key, String(value));
    }
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
    // Helpful debugging without dumping too much
    const body = await res.text().catch(() => "");
    throw new Error(
      `Directus fetch failed: ${res.status}${body ? ` - ${body.slice(0, 300)}` : ""}`
    );
  }

  return res.json();
}
