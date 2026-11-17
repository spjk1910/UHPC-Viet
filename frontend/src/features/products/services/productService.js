export async function getProductNavigation(locale, signal) {
  const [categoriesResponse, productsResponse] = await Promise.all([
    fetch(`/api/categories?locale=${locale}`, { signal }),
    fetch(`/api/products?locale=${locale}`, { signal }),
  ])

  if (!categoriesResponse.ok || !productsResponse.ok) {
    throw new Error('Unable to load product catalog')
  }

  const [categories, products] = await Promise.all([
    categoriesResponse.json(),
    productsResponse.json(),
  ])

  return {
    categories: categories.map((category) => ({
      ...category,
      products: products.filter((product) => product.categorySlug === category.slug),
    })),
  }
}
