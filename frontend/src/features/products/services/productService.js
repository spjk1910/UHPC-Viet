export async function getProductNavigation(locale, signal) {
  const response = await fetch(
    `/api/public/navigation/products?locale=${locale}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error('Unable to load product navigation')
  }

  return response.json()
}
