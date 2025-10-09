import { getAllCctv } from '@/helpers/cctvHelper'
import AddCctvForm from './components/AddCctvForm'
import CctvLists from './components/CctvLists'
import { getAllAccidents } from '@/helpers/accidentHelper'

export default async function Home() {
  const cctvLists = await getAllCctv()
  const accidents = await getAllAccidents()

  const analyticsData = [
    {
      id: 1,
      name: 'Cities covered',
      number: '1',
      color: 'text-yellow-500',
    },
    {
      id: 3,
      name: 'Total Cctvs',
      number: cctvLists?.length || 0,
      color: 'text-blue-500',
    },
    {
      id: 4,
      name: 'Total Accidents',
      number: accidents?.length || 0,
      color: 'text-red-500',
    },
  ]

  return (
    <section className='flex gap-10 flex-col 2xl:flex-row'>
      <div>
        <div className='mb-16'>
          <h1 className='mb-3 text-2xl font-semibold'>Analywtics</h1>
          <div className='flex gap-5'>
            {analyticsData.map(({ id, name, number, color }) => (
              <div key={id} className='bg-slate-100 shadow rounded h-32 w-40'>
                <div className='flex items-center px-2 py-3 text-gray-500'>
                  <span className='text-sm'>{name}</span>
                </div>
                <div className={`pb-2 mt-3 ml-2 text-5xl w-14 ${color}`}>
                  {number}
                </div>
              </div>
            ))}
          </div>
        </div>

        <AddCctvForm />

        {/* Cctv Lists */}
        <CctvLists cctvLists={cctvLists} />
      </div>
      <div className='2xl:h-auto h-[500px] w-full'>
        <div className='bg-slate-100 shadow rounded h-full w-full flex items-center justify-center'>
          <div className='text-center text-gray-500'>
            <p className='text-lg font-semibold mb-2'>System Overview</p>
            <p className='text-sm'>Monitoring {cctvLists?.length || 0} CCTVs across {accidents?.length || 0} incidents</p>
          </div>
        </div>
      </div>
    </section>
  )
}
