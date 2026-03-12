import { useAuthStore } from '../../../app/store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? 'Request failed');
  }

  return data;
}

function getAccessToken() {
  const token = useAuthStore.getState().accessToken;

  if (!token) {
    throw new Error('Missing access token');
  }

  return token;
}

export async function apiGet<T>(path: string): Promise<T> {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJson<T>(response);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseJson<T>(response);
}