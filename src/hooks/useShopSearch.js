import { useEffect, useState } from 'react'
import { fetchFilters, fetchShops } from '../api'

export function useShopSearch(searchParams) {
  const [shopsData, setShopsData] = useState(null)
  const [filters, setFilters] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFilters().then(setFilters)
  }, [])

  useEffect(() => {
    let isActive = true
    setLoading(true)

    const params = {
      search: searchParams.get('search'),
      district: searchParams.getAll('district'),
      purpose: searchParams.getAll('purpose'),
      space: searchParams.getAll('space'),
      amenity: searchParams.getAll('amenity'),
      status: searchParams.get('status'),
      lat: searchParams.get('lat'),
      lon: searchParams.get('lon'),
      page: parseInt(searchParams.get('page')) || 1,
      limit: 25,
    }

    fetchShops(params).then((data) => {
      if (!isActive) return
      setShopsData(data)
      setLoading(false)
    })

    return () => {
      isActive = false
    }
  }, [searchParams])

  return { filters, loading, shopsData }
}
