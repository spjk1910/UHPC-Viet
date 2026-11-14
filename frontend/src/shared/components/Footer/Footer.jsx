import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import logo from '../../../assets/images/logo/uhpc-viet_logo.png'
import { getProductNavigation } from '../../../features/products/services/productService'
import AddressIcon from '../../../assets/icons/AddressIcon'
import EmailIcon from '../../../assets/icons/EmailIcon'
import FacebookIcon from '../../../assets/icons/FacebookIcon'
import PhoneIcon from '../../../assets/icons/PhoneIcon'
import ZaloIcon from '../../../assets/icons/ZaloIcon'

function Footer() {
  const { t, i18n } = useTranslation()

  const locale = i18n.resolvedLanguage?.startsWith('en')
    ? 'en'
    : 'vi'

  const fallbackCategories = useMemo(
    () => {
      const localizedCategories = i18n.getResource(locale, 'common', 'categories') ?? {}

      return Object.entries(localizedCategories).map(
        ([slug, name]) => ({ id: slug, slug, name })
      )
    },
    [i18n, locale]
  )

  const [categories, setCategories] = useState(fallbackCategories)

  useEffect(() => {
    const controller = new AbortController()

    getProductNavigation(locale, controller.signal)
      .then((data) => {
        const apiCategories = data.categories ?? []
        setCategories(apiCategories.length > 0 ? apiCategories : fallbackCategories)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Failed to load footer categories:', error)
          setCategories(fallbackCategories)
        }
      })

    return () => controller.abort()
  }, [locale, fallbackCategories])

  const footerData = i18n.getResource(locale, 'common', 'footer') ?? {}

  return (
    <footer className="bg-[rgb(41,43,45)] text-white">

      {/* Main footer */}
      <div className="site-container grid grid-cols-1 gap-x-8 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-y-12">

        {/* Company */}
        <div className="flex w-full flex-col items-center justify-self-center text-center sm:col-span-2 lg:col-span-3">
          <Link to="/" className="mx-auto inline-block">
            <img
              src={logo}
              alt="UHPCViet"
              className="mx-auto h-14 w-auto object-contain"
            />
          </Link>

          <p className="mx-auto mt-3 max-w-xs text-base leading-7 text-gray-300">
            {t('footer.tagline')}
          </p>
        </div>

        {/* Products */}
        <div className="lg:col-span-2">
          <h3 className="mb-5 text-sm font-bold tracking-wide">
            {t('footer.products')}
          </h3>

          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/products?category=${category.slug}`}
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div className="lg:col-span-2">
          <h3 className="mb-5 text-sm font-bold tracking-wide">
            {t('footer.quickLinks')}
          </h3>

          <ul className="space-y-3">
            <li>
              <Link to="/about" className="text-sm text-gray-300 hover:text-white">
                {t('navigation.about')}
              </Link>
            </li>
            <li>
              <Link to="/projects" className="text-sm text-gray-300 hover:text-white">
                {t('navigation.project')}
              </Link>
            </li>
            <li>
              <Link to="/catalogue" className="text-sm text-gray-300 hover:text-white">
                {t('navigation.catalogue')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="sm:col-span-2 lg:col-span-5">
          <h3 className="mb-5 text-sm font-bold tracking-wide">
            {t('footer.contact')}
          </h3>

          <ul className="space-y-3 text-sm text-gray-300">
            {footerData.contactInfo?.phone && (
              <li className="flex items-start gap-3">
                <PhoneIcon />
                <a href={`tel:${footerData.contactInfo.phone}`} className="break-words transition-colors hover:text-white">
                  {footerData.contactInfo.phone}
                </a>
              </li>
            )}

            {footerData.contactInfo?.email && (
              <li className="flex items-start gap-3">
                <EmailIcon />
                <a href={`mailto:${footerData.contactInfo.email}`} className="break-words transition-colors hover:text-white">
                  {footerData.contactInfo.email}
                </a>
              </li>
            )}

            {footerData.contactInfo?.address && (
              <li className="flex items-start gap-3 leading-6">
                <AddressIcon />
                {footerData.contactInfo.address}
              </li>
            )}
          </ul>
        </div>

      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/15">
        <div className="site-container flex flex-col gap-3 py-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} UHPC-Việt. {t('footer.copyright')}
          </p>

          <div className="flex items-center gap-4">
            {footerData.social?.zaloUrl ? (
              <a
                href={footerData.social.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo"
                className="transition-opacity hover:opacity-70"
              >
                <ZaloIcon />
              </a>
            ) : (
              <span
                aria-label="Zalo unavailable"
                aria-disabled="true"
                className="cursor-not-allowed opacity-40"
              >
                <ZaloIcon />
              </span>
            )}

            {footerData.social?.facebookUrl ? (
              <a
                href={footerData.social.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white transition-opacity hover:opacity-70"
              >
                <FacebookIcon />
              </a>
            ) : (
              <span
                aria-label="Facebook unavailable"
                aria-disabled="true"
                className="cursor-not-allowed opacity-40"
              >
                <FacebookIcon />
              </span>
            )}
          </div>
        </div>
      </div>

    </footer>
  )
}

export default Footer
