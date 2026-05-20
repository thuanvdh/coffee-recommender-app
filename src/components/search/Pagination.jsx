import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function Pagination({ total, page, limit, onPageChange }) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  const pages = []
  let startPage = Math.max(1, page - 2)
  let endPage = Math.min(totalPages, page + 2)

  if (page <= 3) endPage = Math.min(5, totalPages)
  if (page > totalPages - 2) startPage = Math.max(1, totalPages - 4)

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={18} />
      </button>

      {startPage > 1 && (
        <>
          <button className="pagination__item" onClick={() => onPageChange(1)}>1</button>
          {startPage > 2 && <span className="pagination__dots">...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={`pagination__item ${p === page ? 'is-active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="pagination__dots">...</span>}
          <button className="pagination__item" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="pagination__btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

export default Pagination
