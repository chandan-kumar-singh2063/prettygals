'use client'
import { useState } from 'react'
import { getPlaceholder, handleImageError } from '../utils/imageUtils'

const SafeImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSize = 'medium',
  fallbackText = 'No Image Available',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const onImageLoad = () => {
    setIsLoading(false)
  }

  const onImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  if (imageError || !src) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center border border-gray-200 ${className}`}
        {...props}
      >
        <span className="text-gray-500 text-center text-sm">
          {fallbackText}
        </span>
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div 
          className={`bg-gray-100 animate-pulse ${className}`}
          {...props}
        />
      )}
      <img
        src={src || getPlaceholder(fallbackSize)}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onLoad={onImageLoad}
        onError={onImageError}
        {...props}
      />
    </>
  )
}

export default SafeImage
