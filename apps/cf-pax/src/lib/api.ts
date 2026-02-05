const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

export async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = new URL(path, API_URL).toString();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `API error: ${res.status}`);
  }

  return res.json();
}

// Type-safe API endpoints
export const api = {
  // Health check
  health: () => fetchApi<{ ok: boolean; service: string }>("/health"),

  // Events
  events: {
    list: (params?: { fromDate?: string; toDate?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.fromDate) searchParams.set("fromDate", params.fromDate);
      if (params?.toDate) searchParams.set("toDate", params.toDate);
      const query = searchParams.toString();
      return fetchApi<{ ok: true; data: { events: any[] } }>(
        `/api/events${query ? `?${query}` : ""}`
      );
    },
  },

  // PAX
  pax: {
    list: () => fetchApi<{ ok: true; data: { pax: any[] } }>("/api/pax"),
    get: (id: string) => fetchApi<{ ok: true; data: { pax: any } }>(`/api/pax/${id}`),
  },
};
