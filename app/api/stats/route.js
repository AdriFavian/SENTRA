import connectDB from '@/utils/connectDB'
import { NextResponse } from 'next/server'

//  @route  GET api/stats
//  @desc   Get accident statistics for dashboard
//  @access Public
export async function GET(request) {
  try {
    await connectDB()
    const pool = await connectDB()
    const client = await pool.connect()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'daily' // daily, weekly, monthly

    try {
      // Total accidents
      const totalResult = await client.query('SELECT COUNT(*) as total FROM accidents')
      const total = parseInt(totalResult.rows[0].total)

      // Accidents by severity
      const severityResult = await client.query(`
        SELECT 
          accident_classification as severity,
          COUNT(*) as count
        FROM accidents
        GROUP BY accident_classification
        ORDER BY 
          CASE accident_classification
            WHEN 'Fatal' THEN 1
            WHEN 'Serious' THEN 2
            WHEN 'Normal' THEN 3
            ELSE 4
          END
      `)

      // Accidents by location (CCTV)
      const locationResult = await client.query(`
        SELECT 
          c.city,
          c.ip_address,
          COUNT(a.id) as accident_count,
          c.latitude,
          c.longitude
        FROM accidents a
        JOIN cctvs c ON a.cctv_id = c.id
        GROUP BY c.id, c.city, c.ip_address, c.latitude, c.longitude
        ORDER BY accident_count DESC
        LIMIT 10
      `)

      // Time distribution based on period
      let timeDistributionQuery = ''
      
      if (period === 'daily') {
        timeDistributionQuery = `
          SELECT 
            TO_CHAR(created_at, 'HH24:00') as time_label,
            COUNT(*) as count
          FROM accidents
          WHERE created_at >= NOW() - INTERVAL '24 hours'
          GROUP BY TO_CHAR(created_at, 'HH24:00')
          ORDER BY time_label
        `
      } else if (period === 'weekly') {
        timeDistributionQuery = `
          SELECT 
            TO_CHAR(created_at, 'Day') as time_label,
            COUNT(*) as count
          FROM accidents
          WHERE created_at >= NOW() - INTERVAL '7 days'
          GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
          ORDER BY EXTRACT(DOW FROM created_at)
        `
      } else if (period === 'monthly') {
        timeDistributionQuery = `
          SELECT 
            TO_CHAR(created_at, 'YYYY-MM-DD') as time_label,
            COUNT(*) as count
          FROM accidents
          WHERE created_at >= NOW() - INTERVAL '30 days'
          GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
          ORDER BY time_label
        `
      }

      const timeDistributionResult = await client.query(timeDistributionQuery)

      // Recent accidents trend
      const trendResult = await client.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM accidents
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `)

      // Active CCTVs
      const cctvResult = await client.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = true) as active,
          COUNT(*) FILTER (WHERE status = false) as inactive,
          COUNT(*) as total
        FROM cctvs
      `)

      return NextResponse.json({
        total,
        severity: severityResult.rows,
        topLocations: locationResult.rows.map(row => ({
          city: row.city,
          ipAddress: row.ip_address,
          count: parseInt(row.accident_count),
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude)
        })),
        timeDistribution: timeDistributionResult.rows.map(row => ({
          label: row.time_label.trim(),
          count: parseInt(row.count)
        })),
        trend: trendResult.rows.map(row => ({
          date: row.date,
          count: parseInt(row.count)
        })),
        cctvs: {
          active: parseInt(cctvResult.rows[0].active),
          inactive: parseInt(cctvResult.rows[0].inactive),
          total: parseInt(cctvResult.rows[0].total)
        },
        period
      }, { status: 200 })
    } finally {
      client.release()
    }
  } catch (e) {
    console.error('Stats API Error:', e)
    return NextResponse.json({ error: 'Internal server error', details: e.message }, { status: 500 })
  }
}
