import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_OPTIONS = [
  { label: 'Mới mở', value: 'new' },
  { label: 'Đang mở', value: 'open' },
  { label: 'Tạm đóng', value: 'closed_temp' },
  { label: 'Đã đóng', value: 'closed_permanent' },
]

function FilterSidebar({ filters, searchParams, onChange }) {
  const [showMoreGroups, setShowMoreGroups] = useState({})
  const [collapsedGroups, setCollapsedGroups] = useState({})

  const toggleShowMore = (group) => {
    setShowMoreGroups((prev) => ({ ...prev, [group]: !prev[group] }))
  }

  const toggleCollapse = (group) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }))
  }

  const renderFilterGroup = (title, type, items) => {
    if (!items) return null
    const displayItems = showMoreGroups[type] ? items : items.slice(0, 10)
    const isCollapsed = collapsedGroups[type]

    return (
      <div className="filter-group">
        <h3 className="filter-group__title" onClick={() => toggleCollapse(type)}>
          {title}
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </h3>
        {!isCollapsed && (
          <div className="filter-group__items">
            {displayItems.map((item) => (
              <label key={item} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={searchParams.getAll(type).includes(item)}
                  onChange={(e) => onChange(type, item, e.target.checked)}
                />
                {item}
              </label>
            ))}
            {items.length > 10 && (
              <button className="filter-expand" onClick={() => toggleShowMore(type)}>
                {showMoreGroups[type] ? (
                  <>
                    <ChevronUp size={14} /> Thu gọn
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} /> Xem thêm
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="sidebar">
      <div className="filter-group">
        <h3 className="filter-group__title" onClick={() => toggleCollapse('status')}>
          Trạng thái
          {collapsedGroups.status ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </h3>
        {!collapsedGroups.status && (
          <div className="filter-group__items">
            {STATUS_OPTIONS.map((status) => (
              <label key={status.value} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={searchParams.get('status') === status.value}
                  onChange={(e) => onChange('status', status.value, e.target.checked)}
                />
                {status.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {filters && (
        <>
          {renderFilterGroup('Phường (Xã)', 'district', filters.districts)}
          {renderFilterGroup('Loại hình', 'purpose', filters.purposes)}
          {renderFilterGroup('Không gian', 'space', filters.spaces)}
          {renderFilterGroup('Tiện ích', 'amenity', filters.amenities)}
        </>
      )}
    </aside>
  )
}

export default FilterSidebar
