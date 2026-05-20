import { request } from './client'

export async function fetchAdminSuggestions(status = 'pending') {
  return request(`/admin/suggestions?status=${encodeURIComponent(status)}`, {
    auth: true,
  })
}

export async function approveSuggestion(id) {
  return request(`/admin/suggestions/${id}/approve`, {
    method: 'POST',
    auth: true,
    headers: { 'bypass-tunnel-reminder': 'true' },
  })
}

export async function rejectSuggestion(id) {
  return request(`/admin/suggestions/${id}/reject`, {
    method: 'POST',
    auth: true,
    headers: { 'bypass-tunnel-reminder': 'true' },
  })
}
