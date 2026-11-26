import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import ArrowRightIcon from '../../../assets/icons/ArrowRightIcon'
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder'

function CardGridSection({
  eyebrow,
  title,
  action,
  actionTo,
  imageLabel,
  items,
  className = '',
}) {
  const { t } = useTranslation()
  const scrollRef = useRef(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)
  const cardWidthClass = items.length === 3
    ? 'xl:w-[calc(33.333%_-_0.833rem)]'
    : 'xl:w-[calc(25%_-_0.9375rem)]'

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current

    if (!element) return

    setCanScrollBack(element.scrollLeft > 1)
    setCanScrollForward(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 1
    )
  }, [])

  useEffect(() => {
    const element = scrollRef.current

    if (!element) return undefined

    updateScrollState()
    element.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      element.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [items.length, updateScrollState])

  const scroll = (direction) => {
    const element = scrollRef.current

    if (!element) return

    element.scrollBy({
      left: direction * element.clientWidth * 0.85,
      behavior: 'smooth',
    })
  }

  const renderCard = (item) => (
    <Link
      to={item.to}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {item.image ? (
        <div className="h-52 w-full shrink-0 overflow-hidden bg-gray-50">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </div>
      ) : (
        <ImagePlaceholder label={imageLabel} className="min-h-52" />
      )}

      <div className="flex flex-1 items-center justify-between gap-4 p-5">
        <span className="font-semibold text-dark">{item.title}</span>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <ArrowRightIcon className="h-5 w-5" />
        </span>
      </div>
    </Link>
  )

  return (
    <section className={`section-spacing ${className}`}>
      <div className="site-container">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              {eyebrow}
            </p>

            <h2 className="section-title">{title}</h2>
          </div>

          <Link
            to={actionTo}
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            {action} →
          </Link>
        </div>

        <div className="mt-10 flex items-center gap-2 sm:gap-3">
          {canScrollBack && (
            <button
              type="button"
              aria-label={t('home.previous')}
              onClick={() => scroll(-1)}
              className="flex h-10 w-8 shrink-0 items-center justify-center bg-transparent text-2xl text-brand-700 transition-colors hover:bg-transparent hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              ←
            </button>
          )}

          <div
            ref={scrollRef}
            className="min-w-0 flex flex-1 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-4"
          >
            {items.map((item) => (
              <div
                key={item.key}
                className={`w-[85%] shrink-0 snap-start sm:w-[calc(50%_-_0.625rem)] lg:w-[calc(33.333%_-_0.833rem)] ${cardWidthClass}`}
              >
                {renderCard(item)}
              </div>
            ))}
          </div>

          {canScrollForward && (
            <button
              type="button"
              aria-label={t('home.next')}
              onClick={() => scroll(1)}
              className="flex h-10 w-8 shrink-0 items-center justify-center bg-transparent text-2xl text-brand-700 transition-colors hover:bg-transparent hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              →
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default CardGridSection
