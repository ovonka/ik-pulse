import type {
  ConsumeSupportCodePayload,
  ConsumeSupportCodeResponse,
} from '../types/supportDebug.types';

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

export async function consumeSupportCodeRequest(
  accessToken: string,
  payload: ConsumeSupportCodePayload
): Promise<ConsumeSupportCodeResponse> {
  const response = await fetch(`${API_BASE_URL}/support-sessions/consume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return parseJson<ConsumeSupportCodeResponse>(response);
}