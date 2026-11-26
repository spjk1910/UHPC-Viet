export async function getProductNavigation(locale, signal) {
  const productsResponse = await fetch(`/api/products?locale=${locale}`, { signal })

  if (!productsResponse.ok) {
    throw new Error('Unable to load products')
  }

  const products = await productsResponse.json()
  const localizedProducts = products.map((product) => ({
    ...product,
    categorySlug: product.productType,
  }))
  const categories = [...new Set(localizedProducts.map((product) => product.productType))]
    .map((slug) => ({
      id: slug,
      slug,
      name: slug,
      products: localizedProducts.filter((product) => product.productType === slug),
    }))

  return { categories, products: localizedProducts }
}
