'use client'
import React from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import { FiEye } from 'react-icons/fi'

const AccidentList = ({ accident, index }) => {
  const getSeverityStyles = (classification) => {
    switch(classification) {
      case 'Fatal':
        return 'badge-danger'
      case 'Serious':
        return 'badge-warning'
      case 'Normal':
      default:
        return 'badge-primary'
    }
  }

  return (
    <tr className='bg-white border-b border-neutral-200 hover:bg-neutral-50 transition-colors'>
      <td className='px-6 py-4 font-medium text-neutral-900 text-center'>
        {index + 1}
      </td>
      <td className='px-6 py-4'>
        <div className='relative w-24 h-24 rounded-xl overflow-hidden shadow-sm border-2 border-neutral-200'>
          <Image
            src={`/../${accident.photos}`}
            alt={`Accident ${index + 1}`}
            fill
            className='object-cover hover:scale-110 transition-transform duration-300'
            sizes='96px'
          />
        </div>
      </td>
      <td className='px-6 py-4 text-neutral-700'>
        {dayjs(accident.createdAt).format('DD MMM YYYY')}
      </td>
      <td className='px-6 py-4 text-neutral-700 font-medium'>
        {dayjs(accident.createdAt).format('hh:mm:ss A')}
      </td>
      <td className='px-6 py-4'>
        <div className='flex items-center gap-2'>
          <span className='text-primary-600'>📍</span>
          <span className='text-neutral-900 font-medium'>{accident.cctv?.city || 'Unknown'}</span>
        </div>
      </td>
      <td className='px-6 py-4'>
        <span className={`${getSeverityStyles(accident.accidentClassification)} inline-flex items-center`}>
          {accident.accidentClassification || 'Normal'}
        </span>
      </td>
      <td className='px-6 py-4'>
        <Link
          href={`accidents/${accident._id}`}
          className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all hover:shadow-md font-medium'
        >
          <FiEye className='w-4 h-4' />
          View
        </Link>
      </td>
    </tr>
  )
}

export default AccidentList
