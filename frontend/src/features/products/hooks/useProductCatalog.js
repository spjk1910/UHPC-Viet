import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getProductNavigation } from '../services/productService'

function useProductCatalog() {
  const { i18n } = useTranslation()
  const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'vi'
  const fallbackCategories = useMemo(() => {
    const localizedCategories = i18n.getResource(locale, 'common', 'categories') ?? {}

    return Object.entries(localizedCategories).map(([slug, name]) => ({
      id: slug,
      slug,
      name,
      products: [],
    }))
  }, [i18n, locale])
  const [apiProducts, setApiProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    getProductNavigation(locale, controller.signal)
      .then((data) => setApiProducts(data.products ?? []))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          console.error('Failed to load product catalog:', requestError)
          setError(requestError)
          setApiProducts([])
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [locale])

  const products = apiProducts.map((product) => ({
    ...product,
    categorySlug: product.productType,
    categoryName: i18n.t(`categories.${product.productType}`, product.productType),
  }))
  const categories = fallbackCategories.map((category) => ({
    ...category,
    products: products.filter((product) => product.categorySlug === category.slug),
  }))

  return { categories, products, isLoading, error }
}

export default useProductCatalog
