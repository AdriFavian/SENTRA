// get all cctv data from api
async function getAllCctv() {
  try {
    // For server-side rendering, use localhost directly
    const isServer = typeof window === 'undefined'
    const baseUrl = isServer 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    
    const response = await fetch(`${baseUrl}/api/cctvs`, {
      cache: 'no-cache',
    })

    if (!response.ok) {
      console.error('Failed to fetch CCTVs:', response.status, response.statusText)
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching CCTV data:', error)
    return []
  }
}

// create new cctv data
async function createCctv({ ipAddress, latitude, longitude, status, city }) {
  const response = await fetch(`/api/cctvs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ipAddress,
      location: {
        latitude,
        longitude,
      },
      status,
      city,
    }),
  })

  const data = await response.json()
  return data
}

// edit cctv data
async function editCctv({ id, ipAddress, latitude, longitude, status, city }) {
  const response = await fetch(`/api/cctvs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ipAddress,
      location: {
        latitude,
        longitude,
      },
      status,
      city,
    }),
  })

  const data = await response.json()
  return data
}

// delete cctv data
async function deleteCctv(id) {
  const response = await fetch(`/api/cctvs/${id}`, {
    method: 'DELETE',
  })

  const data = await response.json()
  return data
}

export { getAllCctv, createCctv, editCctv, deleteCctv }
