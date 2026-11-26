import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import useProductCatalog from '../hooks/useProductCatalog'
import ProductCard from '../components/ProductCard'

function ProductsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { categories, products, isLoading, error } = useProductCatalog()
  const [searchTerm, setSearchTerm] = useState('')
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
    if (slug) {
      setSearchParams({ category: slug })
    } else {
      setSearchParams({})
    }
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
          className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-200/95 via-gray-100/80 to-gray-100/10"
        />
        <div className="site-container flex min-h-[300px] items-center py-12 sm:min-h-[360px] md:min-h-[420px]">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              {t('productsPage.eyebrow')}
            </p>
            <h1 className="text-4xl font-extrabold text-dark sm:text-5xl">
              {t('productsPage.title')}
            </h1>
            <p className="mt-5 max-w-xl leading-7 text-concrete">
              {t('productsPage.description')}
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="site-container">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => selectCategory('')}
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
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedCategory === category.slug ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-200 text-dark hover:border-brand-500'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="sr-only">{t('productsPage.search')}</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t('productsPage.search')}
              className="w-full rounded-full border border-gray-200 px-5 py-3 text-sm outline-none transition-colors focus:border-brand-500"
            />
          </label>

          {error && products.length > 0 && (
            <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {t('productsPage.loadError')}
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
