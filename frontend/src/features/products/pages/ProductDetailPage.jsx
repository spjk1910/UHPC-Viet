import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import useProductCatalog from '../hooks/useProductCatalog'
import ProductCard from '../components/ProductCard'
import ImagePlaceholder from '../../../shared/components/ImagePlaceholder/ImagePlaceholder'

function ProductDetailPage() {
  const { t } = useTranslation()
  const { id: slug } = useParams()
  const [activeTab, setActiveTab] = useState('description')
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const { products, isLoading, error } = useProductCatalog()
  const product = products.find((item) => item.slug === slug)
  const relatedProducts = products
    .filter((item) => item.slug !== slug && item.categorySlug === product?.categorySlug)
    .slice(0, 4)

  if (isLoading) {
    return <main className="site-container py-20"><div className="h-96 animate-pulse rounded-3xl bg-gray-100" /></main>
  }

  if (error || !product) {
    return (
      <main className="site-container py-20 text-center">
        <h1 className="section-title">{t('productDetail.notFound')}</h1>
        <Link to="/products" className="mt-6 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white">
          {t('productDetail.back')}
        </Link>
      </main>
    )
  }

  return (
    <main>
      <section className="section-spacing">
        <div className="site-container">
          <Link to="/products" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            ← {t('productDetail.back')}
          </Link>

          <div className="mt-8 grid items-center gap-10 md:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-3xl bg-gray-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  className="aspect-4/3 h-full w-full object-cover"
                />
              ) : (
                <ImagePlaceholder label={t('productDetail.imagePlaceholder')} className="min-h-80" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                {product.categoryName}
              </p>
              <h1 className="mt-3 text-4xl font-extrabold text-dark sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-5 leading-7 text-concrete">
                {product.description ?? t('productDetail.description', { product: product.name })}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-dark">
                {['performance', 'durable', 'versatile'].map((key) => (
                  <li key={key} className="flex items-center gap-3">
                    <span className="text-brand-600">●</span>
                    {t(`productDetail.highlights.${key}`)}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setIsQuoteOpen(true)}
                className="mt-8 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                {t('productDetail.requestQuote')} →
              </button>
            </div>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-gray-200">
            <div className="grid grid-cols-3 border-b border-gray-200" role="tablist">
              {[
                ['description', 'descriptionTab'],
                ['specifications', 'specificationsTab'],
                ['usage', 'usageTab'],
              ].map(([tab, labelKey]) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-3 py-4 text-sm font-bold transition-colors sm:px-5 ${
                    activeTab === tab
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-transparent text-dark hover:bg-gray-50'
                  }`}
                >
                  {t(`productDetail.${labelKey}`)}
                </button>
              ))}
            </div>

            <div className="min-h-36 p-5 text-sm leading-6 text-concrete" role="tabpanel">
              {activeTab === 'description' && <p>{t('productDetail.detailText')}</p>}

              {activeTab === 'specifications' && (
                <div className="space-y-3">
                  {['size', 'finish', 'application'].map((key) => (
                    <div key={key} className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <span>{t(`productDetail.specs.${key}`)}</span>
                      <span className="text-right font-medium text-dark">{t('productDetail.specValue')}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'usage' && <p>{t('productDetail.detailText')}</p>}
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-light py-14">
          <div className="site-container">
            <h2 className="section-title text-2xl">{t('productDetail.related')}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id ?? relatedProduct.slug} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {isQuoteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsQuoteOpen(false)
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-dialog-title"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                  {product.categoryName}
                </p>
                <h2 id="quote-dialog-title" className="mt-2 text-2xl font-bold text-dark">
                  {t('productDetail.requestQuote')}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsQuoteOpen(false)}
                className="text-2xl leading-none text-concrete hover:text-dark"
                aria-label={t('productDetail.closeQuote')}
              >
                ×
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
              <label className="block text-sm font-medium text-dark">
                {t('productDetail.selectedProduct')}
                <input
                  readOnly
                  value={product.name}
                  className="mt-2 w-full rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-brand-800 outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-dark">
                {t('contactPage.name')} <span className="text-red-500">*</span>
                <input required name="name" type="text" className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-brand-500" />
              </label>
              <label className="block text-sm font-medium text-dark">
                {t('contactPage.phone')} <span className="text-red-500">*</span>
                <input required name="phone" type="tel" className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-brand-500" />
              </label>
              <label className="block text-sm font-medium text-dark">
                {t('contactPage.message')}
                <textarea name="message" className="mt-2 min-h-28 w-full resize-y rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-brand-500" />
              </label>
              <button type="submit" className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
                {t('contactPage.submit')} →
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default ProductDetailPage
