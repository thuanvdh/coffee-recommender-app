import { API_BASE } from './client'

export async function submitSuggestion(data) {
  try {
    return await fetch(`${API_BASE}/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true',
      },
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error('Lỗi khi gửi đề xuất:', error)
    throw error
  }
}
