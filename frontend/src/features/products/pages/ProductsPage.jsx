import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import useProductCatalog from '../hooks/useProductCatalog'
import ProductCard from '../components/ProductCard'

function ProductsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { categories, products, isLoading, error } = useProductCatalog()
  const searchTerm = searchParams.get('search') ?? ''
  const selectedCategory = searchParams.get('category') ?? ''

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory = !selectedCategory || product.categorySlug === selectedCategory
      const matchesSearch = !normalizedSearch
        || String(product.name ?? '').toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [products, searchTerm, selectedCategory])

  const selectCategory = (slug) => {
    const nextParams = new URLSearchParams(searchParams)
    if (slug) nextParams.set('category', slug)
    else nextParams.delete('category')
    setSearchParams(nextParams)
  }

  const updateSearch = (value) => {
    const nextParams = new URLSearchParams(searchParams)
    if (value.trim()) nextParams.set('search', value.trim())
    else nextParams.delete('search')
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <img
          src="/background_image/product_herosection"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-white/95 via-white/85 to-white/15"
        />
        <div className="site-container flex min-h-[320px] items-center py-12 sm:min-h-[380px] md:min-h-[430px]">
          <div className="max-w-xl">
            <p className="inline-flex rounded-full border border-brand-600/20 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-700 shadow-sm">
              {t('productsPage.eyebrow')}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-dark sm:text-5xl md:text-6xl">
              {t('productsPage.title')}
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-dark/75 sm:text-lg">
              {t('productsPage.description')}
            </p>
            <a href="#product-catalog" className="mt-6 inline-flex items-center rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600">
              {t('home.products.action')}
              <span aria-hidden="true" className="ml-2">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div id="product-catalog" className="site-container scroll-mt-28">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => selectCategory('')}
              aria-pressed={!selectedCategory}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                !selectedCategory ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-200 text-dark hover:border-brand-500'
              }`}
            >
              {t('productsPage.all')}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => selectCategory(category.slug)}
                aria-pressed={selectedCategory === category.slug}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedCategory === category.slug ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-200 text-dark hover:border-brand-500'
                }`}
              >
                {t(`categories.${category.slug}`, category.name)}
              </button>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="sr-only">{t('productsPage.search')}</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder={t('productsPage.search')}
              className="w-full rounded-full border border-gray-200 px-5 py-3 text-sm outline-none transition-colors focus:border-brand-500"
            />
          </label>

          {error && products.length > 0 && (
            <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {t('productsPage.loadError')}
            </p>
          )}

          {!isLoading && !error && (
            <p className="mt-6 text-sm text-concrete" aria-live="polite">
              {visibleProducts.length} {t('productsPage.title').toLowerCase()}
            </p>
          )}

          {isLoading ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-80 animate-pulse rounded-2xl bg-gray-100" />
              ))}
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id ?? product.slug} product={product} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-concrete">{t('productsPage.empty')}</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default ProductsPage
