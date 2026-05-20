export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export function getStoredAdmin() {
  try {
    const raw = localStorage.getItem('admin_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getAdminToken() {
  return getStoredAdmin()?.access_token || null
}

export function clearAdminSession() {
  localStorage.removeItem('admin_user')
  window.dispatchEvent(new Event('authChange'))
}

export async function request(path, options = {}) {
  const {
    auth = false,
    headers = {},
    body,
    ...fetchOptions
  } = options

  const requestHeaders = { ...headers }
  if (body !== undefined && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getAdminToken()
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  let payload = null
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    payload = await response.json()
  }

  if (!response.ok) {
    if (auth && (response.status === 401 || response.status === 403)) {
      clearAdminSession()
    }
    throw new ApiError(payload?.detail || `HTTP ${response.status}`, {
      status: response.status,
      payload,
    })
  }

  return payload
}
