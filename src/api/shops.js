import { request } from './client'

function buildPath(path, params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item))
      return
    }
    searchParams.append(key, value)
  })
  const query = searchParams.toString()
  return query ? `${path}?${query}` : path
}

export async function fetchShops(params = {}) {
  try {
    return await request(buildPath('/shops', params))
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu shops:', error)
    return null
  }
}

export async function fetchMapShops() {
  try {
    return await request('/shops/map')
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu bản đồ:', error)
    return []
  }
}

export async function fetchTopRatedShops(limit = 10) {
  try {
    return await request(buildPath('/shops/top-rated', { limit }))
  } catch (error) {
    console.error('Lỗi khi tải top quán được đánh giá:', error)
    return []
  }
}

export async function fetchShopBySlug(slug) {
  try {
    return await request(`/shops/slug/${encodeURIComponent(slug)}`)
  } catch (error) {
    console.error('Lỗi khi tải chi tiết shop:', error)
    return null
  }
}

export async function fetchFilters() {
  try {
    return await request('/filters')
  } catch (error) {
    console.error('Lỗi khi tải bộ lọc:', error)
    return null
  }
}

export async function submitReview(shopId, data) {
  return request(`/shops/${shopId}/reviews`, {
    method: 'POST',
    headers: { 'bypass-tunnel-reminder': 'true' },
    body: data,
  })
}
