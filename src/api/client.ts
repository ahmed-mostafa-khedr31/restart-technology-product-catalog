export const API_BASE = 'https://dummyjson.com'
export const PAGE_SIZE = 12

export function createApiError(message: string, status: number) {
  const error = new Error(message) as Error & { status: number }
  error.name = 'ApiError'
  error.status = status
  return error
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    // jsdom's AbortSignal is not compatible with Node's fetch; query keys still isolate stale responses.
    signal: import.meta.env.MODE === 'test' ? undefined : init?.signal,
  })

  if (!response.ok) {
    throw createApiError(`Request failed (${response.status})`, response.status)
  }

  return response.json() as Promise<T>
}
