import connectDB from '../utils/connectDB.js'

class CctvModel {
  static async findAll() {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        'SELECT * FROM cctvs ORDER BY created_at DESC'
      )
      
      // Get WhatsApp contacts for each CCTV
      const cctvs = await Promise.all(result.rows.map(async (row) => {
        const contactsResult = await client.query(
          'SELECT * FROM whatsapp_contacts WHERE cctv_id = $1 AND is_active = true',
          [row.id]
        )
        
        return {
          _id: row.id,
          ipAddress: row.ip_address,
          location: {
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude)
          },
          status: row.status,
          city: row.city,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          whatsappContacts: contactsResult.rows.map(c => ({
            id: c.id,
            phoneNumber: c.phone_number,
            name: c.name
          }))
        }
      }))
      
      return cctvs
    } finally {
      client.release()
    }
  }

  static async findById(id) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      const result = await client.query('SELECT * FROM cctvs WHERE id = $1', [id])
      if (result.rows.length === 0) return null
      
      const row = result.rows[0]
      
      // Get WhatsApp contacts
      const contactsResult = await client.query(
        'SELECT * FROM whatsapp_contacts WHERE cctv_id = $1 AND is_active = true',
        [id]
      )
      
      return {
        _id: row.id,
        ipAddress: row.ip_address,
        location: {
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude)
        },
        status: row.status,
        city: row.city,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        whatsappContacts: contactsResult.rows.map(c => ({
          id: c.id,
          phoneNumber: c.phone_number,
          name: c.name
        }))
      }
    } finally {
      client.release()
    }
  }

  static async findOne(query) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      let sqlQuery = 'SELECT * FROM cctvs WHERE '
      const values = []
      const conditions = []
      
      if (query.ipAddress) {
        conditions.push('ip_address = $' + (values.length + 1))
        values.push(query.ipAddress)
      }
      
      sqlQuery += conditions.join(' AND ')
      
      const result = await client.query(sqlQuery, values)
      if (result.rows.length === 0) return null
      
      const row = result.rows[0]
      return {
        _id: row.id,
        ipAddress: row.ip_address,
        location: {
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude)
        },
        status: row.status,
        city: row.city,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    } finally {
      client.release()
    }
  }

  static async create(data) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `INSERT INTO cctvs (ip_address, latitude, longitude, status, city) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [
          data.ipAddress,
          data.location.latitude,
          data.location.longitude,
          data.status !== undefined ? data.status : true,
          data.city
        ]
      )
      
      const row = result.rows[0]
      return {
        _id: row.id,
        ipAddress: row.ip_address,
        location: {
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude)
        },
        status: row.status,
        city: row.city,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    } finally {
      client.release()
    }
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      // Build the SET clause dynamically
      const setFields = []
      const values = []
      let paramCounter = 1

      if (updateData.ipAddress !== undefined) {
        setFields.push(`ip_address = $${paramCounter++}`)
        values.push(updateData.ipAddress)
      }
      
      if (updateData.location?.latitude !== undefined) {
        setFields.push(`latitude = $${paramCounter++}`)
        values.push(updateData.location.latitude)
      }
      
      if (updateData.location?.longitude !== undefined) {
        setFields.push(`longitude = $${paramCounter++}`)
        values.push(updateData.location.longitude)
      }
      
      if (updateData.status !== undefined) {
        setFields.push(`status = $${paramCounter++}`)
        values.push(updateData.status)
      }
      
      if (updateData.city !== undefined) {
        setFields.push(`city = $${paramCounter++}`)
        values.push(updateData.city)
      }
      
      values.push(id) // Add id as the last parameter
      
      const result = await client.query(
        `UPDATE cctvs 
         SET ${setFields.join(', ')} 
         WHERE id = $${paramCounter}
         RETURNING *`,
        values
      )
      
      if (result.rows.length === 0) return null
      
      const row = result.rows[0]
      return {
        _id: row.id,
        ipAddress: row.ip_address,
        location: {
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude)
        },
        status: row.status,
        city: row.city,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    } finally {
      client.release()
    }
  }

  static async findByIdAndDelete(id) {
    const pool = await connectDB()
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        'DELETE FROM cctvs WHERE id = $1 RETURNING *',
        [id]
      )
      
      if (result.rows.length === 0) return null
      
      const row = result.rows[0]
      return {
        _id: row.id,
        ipAddress: row.ip_address,
        location: {
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude)
        },
        status: row.status,
        city: row.city,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    } finally {
      client.release()
    }
  }
}

export default CctvModel
