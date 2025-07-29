import { NextResponse } from 'next/server'
import { verifyToken, authenticateUser } from '../../../lib/auth'
import connectToDatabase from '../../../lib/mongodb'
import User from '../../../models/User'

export async function GET(request) {
  try {
    console.log('DB Auth Test - Starting...')
    
    // Get token from header
    const authHeader = request.headers.get('authorization')
    console.log('DB Auth Test - Auth header:', authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    console.log('DB Auth Test - Token:', token)
    
    // Test basic token verification first
    const decoded = verifyToken(token)
    console.log('DB Auth Test - Decoded:', decoded)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Test database connection
    console.log('DB Auth Test - Testing database connection...')
    const dbConnection = await connectToDatabase()
    console.log('DB Auth Test - DB connection result:', dbConnection ? 'Connected' : 'Failed')
    
    if (!dbConnection) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
    
    // Test user lookup
    console.log('DB Auth Test - Looking up user with ID:', decoded.userId)
    const user = await User.findById(decoded.userId).select('-password')
    console.log('DB Auth Test - User found:', user ? user.email : 'null')
    
    // Test full authenticateUser function
    console.log('DB Auth Test - Testing authenticateUser function...')
    const authResult = await authenticateUser(request)
    console.log('DB Auth Test - AuthenticateUser result:', authResult ? authResult.email : 'null')
    
    return NextResponse.json({ 
      success: true, 
      userId: decoded.userId,
      decoded: decoded,
      userFromDB: user ? { id: user._id, email: user.email } : null,
      authUserResult: authResult ? { id: authResult._id, email: authResult.email } : null
    })
    
  } catch (error) {
    console.error('DB Auth test error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
