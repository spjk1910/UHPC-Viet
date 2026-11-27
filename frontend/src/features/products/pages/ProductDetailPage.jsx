import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import useProductCatalog from '../hooks/useProductCatalog'
import ProductCard from '../components/ProductCard'
import ImagePlaceholder from '../../../shared/components/ImagePlaceholder/ImagePlaceholder'
import CloseIcon from '../../../assets/icons/CloseIcon'

function ProductDetailPage() {
  const { t, i18n } = useTranslation()
  const { id: slug } = useParams()
  const [activeTab, setActiveTab] = useState('description')
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const imageCloseButtonRef = useRef(null)
  const [selectedModelSelection, setSelectedModelSelection] = useState({
    productSlug: '',
    modelId: '',
  })

  useEffect(() => {
    if (!isImageOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const previouslyFocusedElement = document.activeElement
    document.body.style.overflow = 'hidden'
    imageCloseButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsImageOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocusedElement instanceof HTMLElement
          && document.contains(previouslyFocusedElement)) {
        previouslyFocusedElement.focus()
      }
    }
  }, [isImageOpen])

  const { products, isLoading, error } = useProductCatalog()
  const product = products.find((item) => item.slug === slug)

  const models = product?.models ?? []

  const selectedModelId =
    selectedModelSelection.productSlug === product?.slug
      ? selectedModelSelection.modelId
      : ''
  const selectedModel =
    models.find((model) => model.modelId === selectedModelId) ?? models[0]

  const getLocalizedValue = (value) => {
    if (!value) return ''

    if (typeof value === 'string') return value

    const language = i18n.language?.split('-')[0]
    if (typeof value !== 'object') return String(value)

    const localizedValue = value[language] ?? value.vi ?? value.en
    return localizedValue == null ? '' : String(localizedValue)
  }

  const getLocalizedData = (value) => {
    if (!value || typeof value !== 'object') return value

    const language = i18n.language?.split('-')[0]
    return value[language] ?? value.vi ?? value.en ?? value
  }

  const getModelName = (model) => {
    return getLocalizedValue(model?.productName) || model?.modelId || ''
  }

  const selectionName = getLocalizedValue(product?.selectionName)
  const selectedVariant = getLocalizedData(selectedModel?.variant)
  const advantages = Array.isArray(product?.shortAdvantage)
    ? product.shortAdvantage
    : product?.shortAdvantage
      ? [product.shortAdvantage]
      : []

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
            <div className="aspect-4/3 overflow-hidden rounded-3xl">
              {product.imageUrl ? (
                <button
                  type="button"
                  onClick={() => setIsImageOpen(true)}
                  aria-label={t('productDetail.enlargeImage')}
                  className="h-full w-full cursor-zoom-in border-0 bg-transparent p-0"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                </button>
              ) : (
                <ImagePlaceholder label={t('productDetail.imagePlaceholder')} className="h-full min-h-0" />
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
                {product.shortDescription}
              </p>

              {/* Model / Variant Selection */}
              {product.multipleVariant && models.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-sm font-bold text-dark">
                    {selectionName}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {models.map((model) => {
                      const isSelected = selectedModel?.modelId === model.modelId

                      return (
                        <button
                          key={model.modelId}
                          type="button"
                          onClick={() =>
                            setSelectedModelSelection({
                              productSlug: product.slug,
                              modelId: model.modelId,
                            })
                          }
                          aria-pressed={isSelected}
                          className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors ${
                            isSelected
                              ? 'border-brand-600 bg-brand-50 text-brand-700'
                              : 'border-gray-200 bg-white text-dark hover:border-brand-500'
                          }`}
                        >
                          {getModelName(model)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {advantages.length > 0 && (
                <ul className="mt-6 space-y-3 text-sm text-dark">
                  {advantages.map((advantage, index) => (
                    <li key={`${advantage}-${index}`} className="flex items-start gap-3">
                      <span className="text-brand-600">●</span>
                      <span>{String(advantage)}</span>
                    </li>
                  ))}
                </ul>
              )}

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
              {activeTab === 'description' && <p>{product.description}</p>}

              {activeTab === 'specifications' && (
                selectedVariant && typeof selectedVariant === 'object' && !Array.isArray(selectedVariant) ? (
                  <div className="space-y-3">
                    {Object.entries(selectedVariant).map(([key, value]) => {
                      const localizedValue = getLocalizedData(value)

                      return (
                        <div
                          key={key}
                          className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                        >
                          <span>{t(`productDetail.specs.${key}`, key)}</span>
                          <span className="text-right font-medium text-dark">
                            {localizedValue !== null && typeof localizedValue === 'object'
                              ? JSON.stringify(localizedValue)
                              : String(localizedValue ?? '')}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : Array.isArray(selectedVariant) ? (
                  <ul className="space-y-2">
                    {selectedVariant.map((value, index) => (
                      <li key={`${value}-${index}`}>{String(value)}</li>
                    ))}
                  </ul>
                ) : selectedVariant ? (
                  <p>{String(selectedVariant)}</p>
                ) : (
                  <p>{t('productDetail.specValue')}</p>
                )
              )}

              {activeTab === 'usage' && <p>{product.guide}</p>}
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

      {isImageOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('productDetail.enlargeImage')}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsImageOpen(false)
          }}
        >
          <button
            ref={imageCloseButtonRef}
            type="button"
            onClick={() => setIsImageOpen(false)}
            aria-label={t('productDetail.closeImage')}
            className="absolute right-4 top-4 rounded-full bg-white p-3 text-dark shadow-lg hover:bg-gray-100"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-[92vh] max-w-[96vw] object-contain"
          />
        </div>
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
                className="rounded-md p-1 text-concrete hover:text-dark"
                aria-label={t('productDetail.closeQuote')}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
              <label className="block text-sm font-medium text-dark">
                {t('productDetail.selectedProduct')}
                <input
                  readOnly
                  value={`${product.name}${selectedModel ? ` - ${getModelName(selectedModel)}` : ''}`}
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
