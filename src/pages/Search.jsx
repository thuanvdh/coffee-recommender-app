import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, SearchX } from 'lucide-react'
import ShopCard, { ShopCardSkeleton } from '../components/ShopCard'
import FilterSidebar from '../components/search/FilterSidebar'
import Pagination from '../components/search/Pagination'
import SearchResultsHeader from '../components/search/SearchResultsHeader'
import { useShopSearch } from '../hooks/useShopSearch'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768)
  const { filters, loading, shopsData } = useShopSearch(searchParams)

  const handleCheckboxChange = (type, value, checked) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', 1)
    if (checked) {
      if (type === 'status') {
        newParams.set(type, value)
      } else {
        newParams.append(type, value)
      }
    } else if (type === 'status') {
      newParams.delete(type)
    } else {
      const currentValues = newParams.getAll(type).filter((item) => item !== value)
      newParams.delete(type)
      currentValues.forEach((item) => newParams.append(type, item))
    }
    setSearchParams(newParams)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const query = event.target.search.value.trim()
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', 1)
    if (query) {
      newParams.set('search', query)
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams)
  }

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage)
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="search-page">
      <header className="search-hero">
        <h1 className="search-hero__title">Tìm ngay quán cà phê gần bạn</h1>
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            name="search"
            className="search-bar__input"
            placeholder="Nhập tên quán, tên đường bạn muốn tìm ..."
            defaultValue={searchParams.get('search') || ''}
          />
          <button type="submit" className="search-bar__btn">
            <SearchIcon size={20} />
          </button>
        </form>
      </header>

      <div className={`search-content ${!showSidebar ? 'is-sidebar-hidden' : ''}`}>
        {showSidebar && (
          <FilterSidebar
            filters={filters}
            searchParams={searchParams}
            onChange={handleCheckboxChange}
          />
        )}

        <section className="results">
          <SearchResultsHeader
            loading={loading}
            shopsData={shopsData}
            showSidebar={showSidebar}
            onToggleSidebar={() => setShowSidebar((value) => !value)}
          />

          {!loading && shopsData?.total === 0 ? (
            <div className="empty-state">
              <SearchX size={64} strokeWidth={1.5} className="empty-state__icon" />
              <p className="empty-state__title">Không tìm thấy quán nào phù hợp</p>
              <button
                className="btn-primary empty-state__btn"
                onClick={() => setSearchParams(new URLSearchParams())}
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="shop-grid">
                {loading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <ShopCardSkeleton key={index} />
                  ))
                ) : (
                  shopsData?.shops.map((shop) => (
                    <ShopCard key={shop.slug} shop={shop} />
                  ))
                )}
              </div>

              {!loading && (
                <Pagination
                  total={shopsData?.total || 0}
                  page={shopsData?.page || 1}
                  limit={shopsData?.limit || 25}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default Search
