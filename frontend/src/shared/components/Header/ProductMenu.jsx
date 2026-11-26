import { Link } from 'react-router-dom'
import { useState } from 'react'

function ProductMegaMenu({ categories, t }) {
  const safeCategories = categories ?? []
  const [activeCategory, setActiveCategory] = useState(
    safeCategories[0]?.id
  )

  const activeCategoryId = safeCategories.some(
    (category) => category.id === activeCategory
  )
    ? activeCategory
    : safeCategories[0]?.id
  const selectedCategory = safeCategories.find(
    (category) => category.id === activeCategoryId
  )
  const getCategoryName = (category) =>
    t(`categories.${category.slug}`, category.name || category.slug)

  if (!safeCategories.length) return null

  return (
    <div className="absolute left-0 top-full z-50 w-full border-t border-gray-100 bg-white shadow-xl">
      <div className="site-container grid grid-cols-12 gap-8 py-8">

        {/* Category list */}
        <div className="col-span-3 border-r border-gray-100 pr-6">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-gray-500">
            {t('productMenu.categories')}
          </h3>

          <div className="flex flex-col gap-1">
            {safeCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                onMouseEnter={() => setActiveCategory(category.id)}
                onFocus={() => setActiveCategory(category.id)}
                className={`flex items-center justify-between rounded-md px-4 py-3 text-sm font-semibold transition-colors ${
                  activeCategoryId === category.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-dark hover:bg-gray-50'
                }`}
              >
                {getCategoryName(category)}

                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="col-span-9">
          {selectedCategory && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-dark">
                  {getCategoryName(selectedCategory)}
                </h3>

                <Link
                  to={`/products?category=${selectedCategory.slug}`}
                  className="text-sm font-semibold text-brand-700 hover:text-brand-600"
                >
                  {t('productMenu.viewAll')} →
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-5">
                {selectedCategory.products?.map((product) => (
                  <Link
                    key={product.id ?? product.slug}
                    to={`/products/${product.slug}`}
                    className="group"
                  >
                    <div className="aspect-4/3 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.imageUrl || undefined}
                        alt={product.name || product.slug}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <h4 className="mt-3 text-sm font-semibold text-dark transition-colors group-hover:text-brand-700">
                      {product.name || product.slug}
                    </h4>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProductMegaMenu
