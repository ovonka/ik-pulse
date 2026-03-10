import type {
  CreateSupportAccessPayload,
  SupportAccessSession,
  SupportAccessNullableSessionResponse,
  SupportAccessRequiredSessionResponse,
} from '../types/supportAcces.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    const message =
      typeof data.message === 'string' ? data.message : 'Request failed';

    throw new Error(message);
  }

  return data;
}

export async function getCurrentSupportSessionRequest(
  accessToken: string
): Promise<SupportAccessSession | null> {
  const response = await fetch(`${API_BASE_URL}/support-sessions/current`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await parseJson<SupportAccessNullableSessionResponse>(response);
  return data.session;
}

export async function createSupportSessionRequest(
  accessToken: string,
  payload: CreateSupportAccessPayload
): Promise<SupportAccessSession> {
  const response = await fetch(`${API_BASE_URL}/support-sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<SupportAccessRequiredSessionResponse>(response);
  return data.session;
}

export async function revokeSupportSessionRequest(
  accessToken: string
): Promise<SupportAccessSession | null> {
  const response = await fetch(`${API_BASE_URL}/support-sessions/revoke`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await parseJson<SupportAccessNullableSessionResponse>(response);
  return data.session;
}