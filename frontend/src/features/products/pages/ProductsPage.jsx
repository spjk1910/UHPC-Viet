import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import useProductCatalog from '../hooks/useProductCatalog'
import ProductCard from '../components/ProductCard'
import ImagePlaceholder from '../../../shared/components/ImagePlaceholder/ImagePlaceholder'

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
        || product.name.toLowerCase().includes(normalizedSearch)

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
      <section className="bg-brand-50">
        <div className="site-container grid items-center gap-8 py-12 md:grid-cols-[1fr_1.2fr] md:py-16">
          <div>
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
          <ImagePlaceholder label={t('productsPage.heroPlaceholder')} className="min-h-56 rounded-3xl md:min-h-72" />
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
