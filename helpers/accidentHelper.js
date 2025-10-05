// get all accident data from api
async function getAllAccidents() {
  try {
    // For server-side rendering, use localhost directly
    const isServer = typeof window === 'undefined'
    const baseUrl = isServer 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    
    const response = await fetch(`${baseUrl}/api/accidents`, {
      cache: 'no-cache',
    })

    if (!response.ok) {
      console.error('Failed to fetch accidents:', response.status, response.statusText)
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching accident data:', error)
    return []
  }
}

export { getAllAccidents }
