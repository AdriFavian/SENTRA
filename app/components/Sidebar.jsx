'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BiHomeAlt, BiCctv } from 'react-icons/bi'
import { MdBusAlert } from 'react-icons/md'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname()

  const sidebarLinks = [
    {
      id: 0,
      name: 'Dashboard',
      icon: <BiHomeAlt className='w-5 h-5' />,
      path: '/',
      description: 'Overview & Analytics'
    },
    {
      id: 1,
      name: 'Camera Network',
      icon: <BiCctv className='w-5 h-5' />,
      path: '/cctvs',
      description: 'Manage CCTV Devices'
    },
    {
      id: 2,
      name: 'Incidents',
      icon: <MdBusAlert className='w-5 h-5' />,
      path: '/accidents',
      description: 'Accident Reports'
    },
  ]

  return (
    <aside className='w-72 border-r border-neutral-200 bg-white flex flex-col shadow-sm'>
      {/* Logo Section */}
      <div className='px-6 py-6 border-b border-neutral-200'>
        <Link href='/' className='flex gap-3 items-center group'>
          <div className='relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 p-2 shadow-lg group-hover:shadow-xl transition-shadow'>
            <Image 
              src='/images/logo.png' 
              alt='SENTRA Logo' 
              width={48} 
              height={48}
              className='object-contain'
            />
          </div>
          <div>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent'>
              SENTRA
            </h1>
            <p className='text-xs text-neutral-500 font-medium'>Smart Sensor-based Traffic Accident Alert</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className='flex-1 px-4 py-6 space-y-2'>
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.path
          return (
            <Link
              href={link.path}
              key={link.id}
              className={`
                group flex items-start gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/30' 
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                }
              `}
            >
              <div className={`mt-0.5 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}>
                {link.icon}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='font-semibold text-sm'>{link.name}</div>
                <div className={`text-xs mt-0.5 ${isActive ? 'text-primary-100' : 'text-neutral-500'}`}>
                  {link.description}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer Info */}
      <div className='px-6 py-4 border-t border-neutral-200 bg-neutral-50'>
        <div className='flex items-center gap-2 text-xs text-neutral-600'>
          <div className='w-2 h-2 bg-success-500 rounded-full animate-pulse'></div>
          <span className='font-medium'>System Active</span>
        </div>
        <p className='text-xs text-neutral-500 mt-2'>
          v2.0 © 2025 SENTRA
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
