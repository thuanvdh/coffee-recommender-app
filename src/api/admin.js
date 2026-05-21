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

export async function deleteShop(id) {
  return request(`/shops/${id}`, {
    method: 'DELETE',
    auth: true,
    headers: { 'bypass-tunnel-reminder': 'true' },
  })
}

export async function fetchAdminShops(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value)
    }
  })
  const query = searchParams.toString()
  const path = query ? `/admin/shops?${query}` : '/admin/shops'
  
  return request(path, {
    auth: true,
  })
}
