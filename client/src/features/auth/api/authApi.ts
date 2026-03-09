import type { LoginPayload, LoginResponse, MeResponse } from '../types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    const message =
      typeof (data as { message?: string }).message === 'string'
        ? (data as { message?: string }).message
        : 'Request failed';

    throw new Error(message);
  }

  return data;
}

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseJson<LoginResponse>(response);
}

export async function meRequest(accessToken: string): Promise<MeResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseJson<MeResponse>(response);
}