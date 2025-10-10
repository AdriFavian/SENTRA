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
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading accidents...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-10'>
        <h2 className='font-semibold text-3xl'>Accidents</h2>
        
        {/* Items per page selector */}
        <div className='flex items-center gap-3'>
          <label className='text-sm text-gray-600'>Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className='text-sm text-gray-600'>
            entries (Total: {accidents.length})
          </span>
        </div>
      </div>

      <div className='relative w-full overflow-x-auto bg-white shadow-md rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                S.N
              </th>
              <th scope='col' className='px-6 py-3'>
                Image
              </th>
              <th scope='col' className='px-6 py-3'>
                Date
              </th>
              <th scope='col' className='px-6 py-3'>
                Time
              </th>
              <th scope='col' className='px-6 py-3'>
                Location
              </th>
              <th scope='col' className='px-6 py-3'>
                Severity
              </th>
              <th scope='col' className='px-6 py-3'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAccidents.length === 0 ? (
              <tr>
                <td colSpan={7} className='px-6 py-12 text-center text-gray-500'>
                  <div className='text-center'>
                    <svg
                      className='mx-auto h-12 w-12 text-gray-400'
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
                    <h3 className='mt-2 text-sm font-medium text-gray-900'>No accidents found</h3>
                    <p className='mt-1 text-sm text-gray-500'>
                      No accident records available yet.
                    </p>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='mt-6 flex items-center justify-between bg-white px-4 py-3 shadow-md rounded-lg'>
          {/* Showing info */}
          <div className='text-sm text-gray-700'>
            Showing <span className='font-medium'>{indexOfFirstItem + 1}</span> to{' '}
            <span className='font-medium'>
              {Math.min(indexOfLastItem, accidents.length)}
            </span>{' '}
            of <span className='font-medium'>{accidents.length}</span> results
          </div>

          {/* Pagination buttons */}
          <div className='flex items-center gap-2'>
            {/* Previous button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg flex items-center gap-1 transition ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiChevronLeft className='w-4 h-4' />
              Previous
            </button>

            {/* First page */}
            {getPageNumbers()[0] > 1 && (
              <>
                <button
                  onClick={() => paginate(1)}
                  className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition'
                >
                  1
                </button>
                {getPageNumbers()[0] > 2 && (
                  <span className='px-2 text-gray-500'>...</span>
                )}
              </>
            )}

            {/* Page numbers */}
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === pageNumber
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Last page */}
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                  <span className='px-2 text-gray-500'>...</span>
                )}
                <button
                  onClick={() => paginate(totalPages)}
                  className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition'
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next button */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg flex items-center gap-1 transition ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
              <FiChevronRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccidentPage
