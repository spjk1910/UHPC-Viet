
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import logo from '../../../assets/images/logo/uhpc-viet_logo.png'
import ChevronDownIcon from '../../../assets/icons/ChevronDownIcon'
import MenuIcon from '../../../assets/icons/MenuIcon'
import SearchIcon from '../../../assets/icons/SearchIcon'
import LanguageSwitcher from './LanguageSwitcher'
import ProductMegaMenu from './ProductMenu'
import { getProductNavigation } from '../../../features/products/services/productService'

function Header() {
  const { t, i18n } = useTranslation()

  const locale = i18n.resolvedLanguage?.startsWith('en')
    ? 'en'
    : 'vi'

  const [categories, setCategories] = useState([])
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    getProductNavigation(locale, controller.signal)
      .then((data) => {
        setCategories(data.categories ?? [])
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error(error)
          setCategories([])
        }
      })

    return () => controller.abort()
  }, [locale])

  const navLinkClass = ({ isActive }) =>
    `relative whitespace-nowrap py-7 text-sm font-semibold transition-colors ${
      isActive
        ? 'text-brand-700 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-brand-500'
        : 'text-dark hover:text-brand-700'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `block whitespace-nowrap rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-700'
        : 'text-dark hover:bg-gray-50 hover:text-brand-700'
    }`

  const handleSearch = (event) => {
    event.preventDefault()

    const query = searchTerm.trim()

    if (query) {
      window.location.href =
        `/products?search=${encodeURIComponent(query)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">

      <div className="site-container flex h-20 items-center justify-between gap-4 sm:gap-8">

        {/* Logo */}
        <Link to="/" className="shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <img
            src={logo}
            alt="UHPCViet"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden h-full items-center gap-10 lg:flex">

          <NavLink to="/" end className={navLinkClass}>
            {t('navigation.home')}
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            {t('navigation.about')}
          </NavLink>

          {/* Products */}
          <div
            className="flex h-full items-center"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
            onFocus={() => setProductsOpen(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setProductsOpen(false)
              }
            }}
          >
            <Link
              to="/products"
              aria-haspopup="true"
              aria-expanded={productsOpen}
              className={`${navLinkClass({
                isActive: productsOpen,
              })} flex items-center gap-1`}
            >
              {t('navigation.products')}

              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  productsOpen ? 'rotate-180' : ''
                }`}
              />
            </Link>

            {productsOpen && (
              <ProductMegaMenu
                categories={categories}
                t={t}
              />
            )}
          </div>

          <NavLink to="/projects" className={navLinkClass}>
            {t('navigation.project')}
          </NavLink>

           <NavLink to="/catalogue" className={navLinkClass}>
            {t('navigation.catalogue')}
          </NavLink>


          <NavLink to="/contact" className={navLinkClass}>
            {t('navigation.contact')}
          </NavLink>

        </nav>

        {/* Right actions */}
        <div className="hidden shrink-0 items-center gap-6 lg:flex">

          <LanguageSwitcher />

          <div className="h-8 w-px bg-gray-200" />

          <button
            type="button"
            aria-label={t('header.search')}
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-brand-700 transition-colors hover:text-brand-500"
          >
            <SearchIcon className="h-7 w-7" />
          </button>

          <Link
            to="/contact?type=quote"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-700 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            {t('contactType.contactQuote')}
            <span aria-hidden="true">→</span>
          </Link>

        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            aria-label={t('search.search')}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((isOpen) => !isOpen)}
            className="rounded-lg p-2 text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            className="rounded-lg p-2 text-dark transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <MenuIcon isOpen={mobileMenuOpen} className="h-7 w-7" />
          </button>
        </div>

      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-gray-100 bg-white py-3 shadow-lg lg:hidden"
        >
          <div className="site-container flex flex-col gap-1">
            <NavLink
              to="/"
              end
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.home')}
            </NavLink>
            <NavLink
              to="/about"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.about')}
            </NavLink>
            <NavLink
              to="/products"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.products')}
            </NavLink>
            <NavLink
              to="/news"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.news')}
            </NavLink>
            <NavLink
              to="/contact"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.contact')}
            </NavLink>
            <Link
              to="/contact?type=quote"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center whitespace-nowrap rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              {t('contactType.contactQuote')}
              <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </div>
        </nav>
      )}

      {/* Search panel */}
      {searchOpen && (
        <form
          onSubmit={handleSearch}
          className="site-container flex gap-2 border-t border-gray-100 py-3 sm:gap-3 sm:py-4"
        >
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t('search.search')}
            className="min-w-0 flex-1 rounded-md border border-gray-200 px-3 py-2 outline-none focus:border-brand-500 sm:px-4 sm:py-3"
            autoFocus
          />

          <button
            type="submit"
            className="whitespace-nowrap rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 sm:px-6 sm:py-3 sm:text-base"
          >
            {t('search.search')}
          </button>
        </form>
      )}

    </header>
  )
}

export default Header
