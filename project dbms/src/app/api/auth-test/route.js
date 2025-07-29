import { NextResponse } from 'next/server'
import { verifyToken } from '../../../lib/auth'

export async function GET(request) {
  try {
    console.log('Auth Test - Starting...')
    
    // Get token from header
    const authHeader = request.headers.get('authorization')
    console.log('Auth Test - Auth header:', authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    console.log('Auth Test - Token:', token)
    
    // Verify token
    const decoded = verifyToken(token)
    console.log('Auth Test - Decoded:', decoded)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    return NextResponse.json({ 
      success: true, 
      userId: decoded.userId,
      decoded: decoded
    })
    
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
