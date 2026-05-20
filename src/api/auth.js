import { API_BASE, clearAdminSession, getStoredAdmin } from './client'

export async function loginAdmin(username, password) {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)

  return fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })
}

export function getAdminSession() {
  return getStoredAdmin()
}

export function logoutAdmin() {
  clearAdminSession()
}
