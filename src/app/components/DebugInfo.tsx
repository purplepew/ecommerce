'use client'

import { useEffect, useState } from 'react'

export default function DebugInfo() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const info = {
      environment: process.env.NODE_ENV,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    }
    
    setDebugInfo(info)
    console.log('Debug Info:', info)
  }, [])

  const testApiCall = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
      console.log('Testing API call to:', `${baseUrl}/api/graphql`)
      
      const response = await fetch(`${baseUrl}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              products(page: 1, pageSize: 5) {
                id
                name
                price
              }
            }
          `
        })
      })
      
      const data = await response.json()
      console.log('API Test Response:', data)
      alert(`API Test Result: ${response.ok ? 'Success' : 'Failed'}\nStatus: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      console.error('API Test Error:', error)
      alert(`API Test Error: ${error}`)
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', margin: '20px', borderRadius: '8px' }}>
        <h3>Production Debug Info</h3>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        <button 
          onClick={testApiCall}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test API Call
        </button>
      </div>
    )
  }

  return null
} 