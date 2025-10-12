'use client'

import { getAllAccidents } from '@/helpers/accidentHelper'
import React, { useState, useEffect } from 'react'
import AccidentList from '../components/AccidentList'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const AccidentPage = () => {
  const [accidents, setAccidents] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)

  // Fetch accidents on component mount
  useEffect(() => {
    const fetchAccidents = async () => {
      setLoading(true)
      try {
        const data = await getAllAccidents()
        setAccidents(data || [])
      } catch (error) {
        console.error('Error fetching accidents:', error)
        setAccidents([])
      } finally {
        setLoading(false)
      }
    }
    fetchAccidents()
  }, [])

  // Calculate pagination
  const totalPages = Math.ceil(accidents.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAccidents = accidents.slice(indexOfFirstItem, indexOfLastItem)

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center animate-fade-in'>
          <div className='animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4'></div>
          <p className='text-neutral-600 font-medium'>Loading accidents data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in'>
        <div>
          <h1 className='text-4xl font-bold text-neutral-900 mb-2'>Accident Records</h1>
          <p className='text-neutral-600'>View and manage all detected accidents</p>
        </div>
        
        {/* Items per page selector */}
        <div className='card px-4 py-3 flex items-center gap-3'>
          <label className='text-sm font-medium text-neutral-700'>Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className='input-base py-2 px-3 min-w-[80px]'
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className='text-sm text-neutral-600'>
            of <span className='font-semibold text-neutral-900'>{accidents.length}</span> records
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className='card p-0 overflow-hidden animate-slide-in'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-gradient-to-r from-neutral-50 to-neutral-100 border-b-2 border-neutral-200'>
              <tr>
                <th className='px-6 py-4 text-center text-xs font-bold text-neutral-700 uppercase tracking-wider'>
                  No
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider'>
                  Preview
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider'>
                  Time
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider'>
                  Location
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider'>
                  Severity
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-neutral-200'>
              {currentAccidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className='px-6 py-16 text-center'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center'>
                        <svg
                          className='w-8 h-8 text-neutral-400'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-neutral-900 mb-1'>No accidents found</h3>
                        <p className='text-sm text-neutral-500'>
                          No accident records available yet.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentAccidents.map((accident, index) => (
                  <AccidentList
                    key={accident._id}
                    accident={accident}
                    index={indexOfFirstItem + index}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='card p-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
          {/* Showing info */}
          <div className='text-sm text-neutral-600'>
            Showing <span className='font-semibold text-neutral-900'>{indexOfFirstItem + 1}</span> to{' '}
            <span className='font-semibold text-neutral-900'>
              {Math.min(indexOfLastItem, accidents.length)}
            </span>{' '}
            of <span className='font-semibold text-neutral-900'>{accidents.length}</span> results
          </div>

          {/* Pagination buttons */}
          <div className='flex items-center gap-2 flex-wrap justify-center'>
            {/* Previous button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium ${
                currentPage === 1
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-white border-2 border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600'
              }`}
            >
              <FiChevronLeft className='w-4 h-4' />
              <span className='hidden sm:inline'>Previous</span>
            </button>

            {/* First page */}
            {getPageNumbers()[0] > 1 && (
              <>
                <button
                  onClick={() => paginate(1)}
                  className='px-4 py-2 rounded-lg border-2 border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600 transition-all font-medium'
                >
                  1
                </button>
                {getPageNumbers()[0] > 2 && (
                  <span className='px-2 text-neutral-400'>...</span>
                )}
              </>
            )}

            {/* Page numbers */}
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-4 py-2 rounded-lg transition-all font-semibold ${
                  currentPage === pageNumber
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : 'border-2 border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Last page */}
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                  <span className='px-2 text-neutral-400'>...</span>
                )}
                <button
                  onClick={() => paginate(totalPages)}
                  className='px-4 py-2 rounded-lg border-2 border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600 transition-all font-medium'
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next button */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium ${
                currentPage === totalPages
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-white border-2 border-neutral-300 text-neutral-700 hover:border-primary-500 hover:text-primary-600'
              }`}
            >
              <span className='hidden sm:inline'>Next</span>
              <FiChevronRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccidentPage
