import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function ProductCard({ product }) {
  const { t } = useTranslation()

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            {t('productsPage.imagePlaceholder')}
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {product.categoryName}
        </p>
        <h2 className="mt-2 font-semibold text-dark">{product.name}</h2>
        <span className="mt-4 inline-flex text-sm font-semibold text-brand-600">
          {t('productMenu.viewDetails')} →
        </span>
      </div>
    </Link>
  )
}

export default ProductCard
