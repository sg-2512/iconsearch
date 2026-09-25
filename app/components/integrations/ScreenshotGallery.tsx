'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import styles from './screenshot-gallery.module.css'

export type ScreenshotItem = {
  src: string
  alt: string
  title?: string
  description?: string
}

type ScreenshotGalleryProps = {
  screenshots: ScreenshotItem[]
  platform: string
}

export default function ScreenshotGallery({ screenshots, platform }: ScreenshotGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!screenshots || screenshots.length === 0) return null

  const current = screenshots[currentIndex]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={styles.galleryContainer} aria-label={`${platform} extension screenshot gallery`}>
      {/* Top Window Bar */}
      <div className={styles.galleryHeader}>
        <div className={styles.windowDots} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.headerTitle}>
          <strong>IconSearch for {platform}</strong>
          <span className={styles.badge}>Official Store Listing</span>
        </div>
        <div className={styles.counter}>
          <span>{currentIndex + 1}</span> / {screenshots.length}
        </div>
      </div>

      {/* Main Active Screenshot */}
      <div className={styles.viewport}>
        <div className={styles.imageWrapper}>
          <NextImage
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={2000}
            height={1250}
            priority={currentIndex === 0}
            className={styles.mainImage}
            unoptimized
          />
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className={`${styles.navButton} ${styles.prevButton}`}
          aria-label="Previous screenshot"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className={`${styles.navButton} ${styles.nextButton}`}
          aria-label="Next screenshot"
        >
          <ChevronRight size={22} />
        </button>

        {/* Caption Overlay */}
        {current.title && (
          <div className={styles.captionOverlay}>
            <div className={styles.captionText}>
              <strong>{current.title}</strong>
              {current.description && <p>{current.description}</p>}
            </div>
            <a
              href="https://raycast.com/iconsearch/iconsearch"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.storeLink}
            >
              <Eye size={14} /> View on Store
            </a>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      <div className={styles.thumbnailsList} role="tablist" aria-label="Screenshot thumbnails">
        {screenshots.map((item, index) => {
          const isActive = index === currentIndex
          return (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.thumbnailCard} ${isActive ? styles.activeThumbnail : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className={styles.thumbImageWrapper}>
                <NextImage
                  src={item.src}
                  alt={item.alt}
                  width={320}
                  height={200}
                  className={styles.thumbImage}
                  unoptimized
                />
              </div>
              <div className={styles.thumbMeta}>
                <span className={styles.thumbIndex}>{index + 1}</span>
                <span className={styles.thumbTitle}>{item.title || `Screenshot ${index + 1}`}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
