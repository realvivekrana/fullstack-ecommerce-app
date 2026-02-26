'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getImageWithFallback, getPlaceholderImage } from '@/lib/image-utils'

interface ProductImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  category?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

export default function ProductImage({
  src,
  alt,
  width = 800,
  height = 800,
  className = '',
  priority = false,
  fill = false,
  sizes,
  category,
  objectFit = 'cover',
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(getImageWithFallback(src, category))
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      // Try fallback image
      const fallback = getImageWithFallback('', category)
      if (imgSrc !== fallback) {
        setImgSrc(fallback)
      } else {
        // Use placeholder as last resort
        setImgSrc(getPlaceholderImage(width, height, alt))
      }
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (fill) {
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{ objectFit }}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          sizes={sizes}
        />
      </>
    )
  }

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ objectFit }}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        sizes={sizes}
      />
    </div>
  )
}
