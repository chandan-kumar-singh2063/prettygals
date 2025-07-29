'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  cartTotal: 0,
  cartItemCount: 0,
  products: [],
  categories: [],
  loading: false,
  error: null
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false 
      }
    
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        cart: [],
        cartTotal: 0,
        cartItemCount: 0
      }
    
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload.cart || [],
        cartTotal: action.payload.total || 0,
        cartItemCount: action.payload.itemCount || 0
      }
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false }
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload, loading: false }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Authentication functions
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        dispatch({ type: 'SET_LOADING', payload: false })
        return { success: false, message: errorData.error || 'Login failed' }
      }
      
      const data = await response.json()
      
      const userData = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone
      }
      
      dispatch({ type: 'SET_USER', payload: userData })
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', data.token)
      
      await loadCart(userData.id)
      dispatch({ type: 'SET_LOADING', payload: false })
      return { success: true, message: data.message }
      
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, message: error.message }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      const data = await response.json()
      dispatch({ type: 'SET_LOADING', payload: false })
      
      if (response.ok) {
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.error || 'Registration failed' }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, message: error.message }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      })
      
      dispatch({ type: 'LOGOUT' })
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Logout error:', error)
      dispatch({ type: 'LOGOUT' })
      localStorage.removeItem('user')
    }
  }

  // Cart functions
  const loadCart = async (userId) => {
    try {
      if (!userId) {
        console.log('No userId provided, skipping cart load')
        return
      }
      
      console.log('Loading cart for user:', userId)
      
      const response = await fetch(`/api/cart-simple?userId=${userId}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded cart:', data)
        if (data.success) {
          dispatch({ type: 'SET_CART', payload: data })
        }
      } else {
        console.error('Cart load failed:', response.status, response.statusText)
        if (response.status === 401) {
          // Token is invalid, clear user session
          dispatch({ type: 'LOGOUT' })
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      console.error('Load cart error:', error)
    }
  }

  const addToCart = async (product, quantity = 1) => {
    try {
      if (!state.user) {
        dispatch({ type: 'SET_ERROR', payload: 'Please login to add items to cart' })
        return { success: false, message: 'Please login to add items to cart' }
      }

      console.log('Adding to cart:', product, 'User:', state.user)

      const response = await fetch('/api/cart-simple', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'add',
          userId: state.user.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Cart API error:', errorData)
        dispatch({ type: 'SET_ERROR', payload: errorData.message })
        return { success: false, message: errorData.message }
      }
      
      const data = await response.json()
      console.log('Cart API response:', data)
      
      if (data.success) {
        dispatch({ type: 'SET_CART', payload: data })
        return { success: true, message: data.message }
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message })
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, message: error.message }
    }
  }

  const updateCartQuantity = async (productId, quantity) => {
    try {
      const response = await fetch('/api/cart-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          userId: state.user.id,
          productId,
          quantity
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        dispatch({ type: 'SET_CART', payload: data })
        return { success: true, message: data.message }
      } else {
        console.error('Update cart failed:', data)
        return { success: false, message: data.message || 'Update failed' }
      }
    } catch (error) {
      console.error('Update cart error:', error)
      return { success: false, message: error.message }
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch('/api/cart-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          userId: state.user.id,
          productId
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        dispatch({ type: 'SET_CART', payload: data })
        return { success: true, message: data.message }
      } else {
        console.error('Remove from cart failed:', data)
        return { success: false, message: data.message || 'Remove failed' }
      }
    } catch (error) {
      console.error('Remove from cart error:', error)
      return { success: false, message: error.message }
    }
  }

  const clearCart = async () => {
    try {
      // Check if user is logged in
      if (!state.user || !state.user.id) {
        console.warn('Cannot clear cart: user not logged in');
        return { success: false, message: 'User not logged in' };
      }

      const response = await fetch('/api/cart-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'clear',
          userId: state.user.id
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        dispatch({ type: 'SET_CART', payload: data })
        return { success: true, message: data.message }
      } else {
        console.error('Clear cart failed:', data)
        return { success: false, message: data.message || 'Clear failed' }
      }
    } catch (error) {
      console.error('Clear cart error:', error)
      return { success: false, message: error.message }
    }
  }

  // Product functions
  const loadProducts = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const params = new URLSearchParams(filters)
      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'SET_PRODUCTS', payload: data.products })
        return data
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/products?categories=true')
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'SET_CATEGORIES', payload: data.categories })
      }
    } catch (error) {
      console.error('Load categories error:', error)
    }
  }

  // Payment function
  const processPayment = async (paymentData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process_payment',
          ...paymentData
        })
      })
      
      const data = await response.json()
      dispatch({ type: 'SET_LOADING', payload: false })
      
      if (data.success) {
        // Clear cart after successful payment
        await clearCart()
      }
      
      return data
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, message: error.message }
    }
  }

  // Initialize user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: 'SET_USER', payload: user })
        loadCart(user.id)
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
    
    loadCategories()
  }, [])

  const value = {
    ...state,
    login,
    register,
    logout,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    loadProducts,
    loadCategories,
    processPayment
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
