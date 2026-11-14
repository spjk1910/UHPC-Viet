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
  const [apiCategories, setApiCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    getProductNavigation(locale, controller.signal)
      .then((data) => setApiCategories(data.categories ?? []))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          console.error('Failed to load product catalog:', requestError)
          setError(requestError)
          setApiCategories([])
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [locale])

  const categories = apiCategories.length > 0 ? apiCategories : fallbackCategories
  const products = categories.flatMap((category) =>
    (category.products ?? []).map((product) => ({
      ...product,
      categoryName: category.name,
      categorySlug: category.slug,
    }))
  )

  return { categories, products, isLoading, error }
}

export default useProductCatalog
