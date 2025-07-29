import { NextResponse } from 'next/server'
import { getUserFromToken, verifyToken } from '../../../lib/auth'

export async function POST(request) {
  try {
    console.log('Test auth - Headers:', Object.fromEntries(request.headers.entries()))
    
    const authHeader = request.headers.get('authorization')
    console.log('Test auth - Auth header:', authHeader)
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      console.log('Test auth - Token:', token)
      
      const verified = verifyToken(token)
      console.log('Test auth - Verified:', verified)
      
      try {
        const user = await getUserFromToken(request)
        console.log('Test auth - User from token:', user)
        
        return NextResponse.json({
          success: true,
          authHeader,
          token,
          verified,
          user
        })
      } catch (userError) {
        console.error('Error getting user:', userError)
        return NextResponse.json({
          success: false,
          error: 'Failed to get user',
          authHeader,
          token,
          verified
        })
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'No token provided'
    })
    
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
