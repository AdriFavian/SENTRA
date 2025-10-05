import connectDB from '@/utils/connectDB'

class AccidentModel {
  static async findAll() {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          a.*,
          c.id as cctv_id,
          c.ip_address as cctv_ip_address,
          c.latitude as cctv_latitude,
          c.longitude as cctv_longitude,
          c.status as cctv_status,
          c.city as cctv_city,
          c.created_at as cctv_created_at,
          c.updated_at as cctv_updated_at
        FROM accidents a
        LEFT JOIN cctvs c ON a.cctv_id = c.id
        ORDER BY a.created_at DESC
      `)
      
      return result.rows.map(row => ({
        _id: row.id,
        accidentClassification: row.accident_classification,
        photos: row.photos,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        cctv: row.cctv_id ? {
          _id: row.cctv_id,
          ipAddress: row.cctv_ip_address,
          location: {
            latitude: parseFloat(row.cctv_latitude),
            longitude: parseFloat(row.cctv_longitude)
          },
          status: row.cctv_status,
          city: row.cctv_city,
          createdAt: row.cctv_created_at,
          updatedAt: row.cctv_updated_at
        } : null
      }))
    } finally {
      client.release()
    }
  }

  static async findById(id) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          a.*,
          c.id as cctv_id,
          c.ip_address as cctv_ip_address,
          c.latitude as cctv_latitude,
          c.longitude as cctv_longitude,
          c.status as cctv_status,
          c.city as cctv_city,
          c.created_at as cctv_created_at,
          c.updated_at as cctv_updated_at
        FROM accidents a
        LEFT JOIN cctvs c ON a.cctv_id = c.id
        WHERE a.id = $1
      `, [id])
      
      if (result.rows.length === 0) return null
      
      const row = result.rows[0]
      return {
        _id: row.id,
        accidentClassification: row.accident_classification,
        photos: row.photos,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        cctv: row.cctv_id ? {
          _id: row.cctv_id,
          ipAddress: row.cctv_ip_address,
          location: {
            latitude: parseFloat(row.cctv_latitude),
            longitude: parseFloat(row.cctv_longitude)
          },
          status: row.cctv_status,
          city: row.cctv_city,
          createdAt: row.cctv_created_at,
          updatedAt: row.cctv_updated_at
        } : null
      }
    } finally {
      client.release()
    }
  }

  static async create(data) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      // Ensure severity is never null or empty - validate and set default
      const allowedSeverities = ['Fatal', 'Serious', 'Normal']
      let severity = data.accidentClassification || 'Normal'
      
      // Validate severity is in allowed values, default to 'Normal' if not
      if (!allowedSeverities.includes(severity)) {
        console.warn(`Invalid severity "${severity}" provided, defaulting to "Normal"`)
        severity = 'Normal'
      }

      const result = await client.query(
        `INSERT INTO accidents (accident_classification, photos, cctv_id) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [
          severity,
          data.photos,
          data.cctv ? data.cctv._id || data.cctv : null
        ]
      )
      
      const row = result.rows[0]
      return {
        _id: row.id,
        accidentClassification: row.accident_classification,
        photos: row.photos,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        cctv: data.cctv
      }
    } finally {
      client.release()
    }
  }

  static async save(data) {
    return this.create(data)
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      // Build the SET clause dynamically
      const setFields = []
      const values = []
      let paramCounter = 1

      if (updateData.accidentClassification !== undefined) {
        setFields.push(`accident_classification = $${paramCounter++}`)
        values.push(updateData.accidentClassification)
      }
      
      if (updateData.photos !== undefined) {
        setFields.push(`photos = $${paramCounter++}`)
        values.push(updateData.photos)
      }
      
      if (updateData.cctv !== undefined) {
        setFields.push(`cctv_id = $${paramCounter++}`)
        values.push(updateData.cctv)
      }
      
      values.push(id) // Add id as the last parameter
      
      const result = await client.query(
        `UPDATE accidents 
         SET ${setFields.join(', ')} 
         WHERE id = $${paramCounter}
         RETURNING *`,
        values
      )
      
      if (result.rows.length === 0) return null
      
      const row = result.rows[0]
      return {
        _id: row.id,
        accidentClassification: row.accident_classification,
        photos: row.photos,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    } finally {
      client.release()
    }
  }
}

export default AccidentModel
