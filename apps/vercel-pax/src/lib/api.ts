const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getHealth() {
  const res = await fetch(`${API_URL}/api/health`);
  return res.json();
}

export async function getPax(orgId: string) {
  const res = await fetch(`${API_URL}/api/pax?orgId=${orgId}`);
  return res.json();
}

export async function getEvents(orgId: string, fromDate?: string, toDate?: string) {
  const params = new URLSearchParams({ orgId });
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  const res = await fetch(`${API_URL}/api/event-instances?${params}`);
  return res.json();
}
