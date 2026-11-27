import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ArrowUpIcon from '../../../assets/icons/ArrowUpIcon'
import EmailIcon from '../../../assets/icons/EmailIcon'
import PhoneIcon from '../../../assets/icons/PhoneIcon'
import CloseIcon from '../../../assets/icons/CloseIcon'
import ZaloIcon from '../../../assets/icons/ZaloIcon'

function ContactBubble() {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'vi'
  const footerData = i18n.getResource(locale, 'common', 'footer') ?? {}
  const contactInfo = footerData.contactInfo ?? {}
  const social = footerData.social ?? {}
  const bubbleLabels = footerData.contactBubble ?? {}

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 240)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {showBackToTop && (
        <button
          type="button"
          aria-label={bubbleLabels.backToTop}
          onClick={() => {
            setIsOpen(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="fixed bottom-44 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-500/40 transition-colors hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:bottom-48 sm:right-8"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      )}

      <div className="fixed bottom-24 right-5 z-40 sm:bottom-28 sm:right-8">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[min(calc(100vw-2.5rem),22rem)] overflow-hidden rounded-2xl bg-white text-dark shadow-2xl ring-1 ring-black/5">
          {contactInfo.phone && (
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-4 border-b border-gray-100 px-5 py-4 transition-colors hover:bg-gray-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500">
                <PhoneIcon className="h-5 w-5 text-white" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">
                  {bubbleLabels.hotline ?? t('footer.contact')}
                </span>
                <span className="block truncate text-sm text-gray-500">
                  {contactInfo.phone}
                </span>
              </span>
            </a>
          )}

          <div className="border-b border-gray-100">
            {social.zaloUrl ? (
              <a
                href={social.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0068FF]">
                  <ZaloIcon className="h-8 w-8" />
                </span>
                <span className="font-semibold text-[#0068FF]">
                  {bubbleLabels.zalo ?? 'Zalo'}
                </span>
              </a>
            ) : (
              <span className="flex cursor-not-allowed items-center gap-4 px-5 py-4 opacity-40">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0068FF]">
                  <ZaloIcon className="h-8 w-8" />
                </span>
                <span className="font-semibold text-[#0068FF]">
                  {bubbleLabels.zalo ?? 'Zalo'}
                </span>
              </span>
            )}
          </div>

          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500">
                <EmailIcon className="h-5 w-5 text-white" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-red-500">
                  {bubbleLabels.email ?? 'Email'}
                </span>
                <span className="block truncate text-sm text-gray-500">
                  {contactInfo.email}
                </span>
              </span>
            </a>
          )}
        </div>
      )}

      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? bubbleLabels.close : bubbleLabels.open}
        onClick={() => setIsOpen((open) => !open)}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full text-3xl leading-none text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
          isOpen
            ? 'bg-brand-700 shadow-brand-700/30'
            : 'bg-brand-600 shadow-brand-500/40'
        }`}
      >
        {!isOpen && (
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/30" />
        )}
        {isOpen
          ? <CloseIcon className="relative z-10 h-5 w-5 text-white" />
          : <PhoneIcon className="relative z-10 h-6 w-6 text-white" />}
      </button>
      </div>
    </>
  )
}

export default ContactBubble
