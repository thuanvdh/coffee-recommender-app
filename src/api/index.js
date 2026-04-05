const API_BASE = 'http://localhost:8000/api';

export async function fetchShops(params = {}) {
  const url = new URL(`${API_BASE}/shops`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else {
        url.searchParams.append(key, value);
      }
    }
  });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu shops:', error);
    return null;
  }
}

export async function fetchShopBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE}/shops/slug/${slug}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải chi tiết shop:', error);
    return null;
  }
}

export async function fetchFilters() {
  try {
    const response = await fetch(`${API_BASE}/filters`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải bộ lọc:', error);
    return null;
  }
}

export async function submitSuggestion(data) {
  try {
    const response = await fetch(`${API_BASE}/suggestions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true'
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi gửi đề xuất:', error);
    throw error;
  }
}
export async function fetchAdminSuggestions(status = 'pending') {
  try {
    const response = await fetch(`${API_BASE}/admin/suggestions?status=${status}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tải đề xuất admin:', error);
    return [];
  }
}

export const loginAdmin = async (username, password) => {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)

  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })
  return response
}

export async function approveSuggestion(id) {
  try {
    const response = await fetch(`${API_BASE}/admin/suggestions/${id}/approve`, {
      method: 'POST',
      headers: { 'bypass-tunnel-reminder': 'true' }
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi duyệt đề xuất:', error);
    throw error;
  }
}

export async function rejectSuggestion(id) {
  try {
    const response = await fetch(`${API_BASE}/admin/suggestions/${id}/reject`, {
      method: 'POST',
      headers: { 'bypass-tunnel-reminder': 'true' }
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi từ chối đề xuất:', error);
    throw error;
  }
}

export async function submitReview(shopId, data) {
  try {
    const response = await fetch(`${API_BASE}/shops/${shopId}/reviews`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true'
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi gửi nhận xét:', error);
    throw error;
  }
}

