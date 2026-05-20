import React from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

function SearchResultsHeader({ loading, shopsData, showSidebar, onToggleSidebar }) {
  const countText = loading
    ? 'Đang tìm kiếm...'
    : !shopsData
      ? 'Không tìm thấy kết quả'
      : shopsData.total === 0
        ? '0 kết quả'
        : `Hiển thị ${(shopsData.page - 1) * shopsData.limit + 1} - ${Math.min(
          shopsData.page * shopsData.limit,
          shopsData.total,
        )} trong tổng số ${shopsData.total} quán`

  return (
    <div className="results-header">
      <button className="filter-toggle" onClick={onToggleSidebar}>
        {showSidebar ? (
          <>
            <X size={18} /> Ẩn bộ lọc
          </>
        ) : (
          <>
            <SlidersHorizontal size={18} /> Hiện bộ lọc
          </>
        )}
      </button>
      <div className="search-count">{countText}</div>
    </div>
  )
}

export default SearchResultsHeader
