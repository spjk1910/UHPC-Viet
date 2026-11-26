import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { APP_ROUTES } from '../../../config/appRoutes'
import { deleteProduct, getAdminProducts, signOutAdmin } from '../services/adminService'
import ProductFormModal from '../components/ProductFormModal'

function AdminDashboardPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const loadProducts = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      setProducts(await getAdminProducts())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    getAdminProducts()
      .then((result) => {
        if (active) setProducts(result)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  function openCreateForm() {
    setEditingProduct(null)
    setIsFormOpen(true)
    setError('')
    setNotice('')
  }

  function openEditForm(product) {
    setEditingProduct(product)
    setIsFormOpen(true)
    setError('')
    setNotice('')
  }

  async function handleSaved(message) {
    setIsFormOpen(false)
    setEditingProduct(null)
    setNotice(message)
    await loadProducts()
  }

  async function handleProductsChanged() {
    await loadProducts()
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.productName?.en || product.slug}"?`)) return

    setError('')
    setNotice('')
    try {
      await deleteProduct(product.slug)
      setNotice('Product deleted.')
      await loadProducts()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function handleSignOut() {
    try {
      await signOutAdmin()
      navigate(APP_ROUTES.admin, { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="min-h-screen bg-light">
      <header className="border-b border-gray-200 bg-white">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-semibold text-brand-700">UHPC Viet</p>
            <h1 className="text-2xl font-bold">Product administration</h1>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </header>

      {error && <p role="alert" className="site-container mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="site-container mt-5 break-all rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-700">{notice}</p>}

      <div className="site-container py-8">
        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Products</h2>
            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Add product
            </button>
          </div>

          {isLoading ? (
            <p className="mt-6 text-concrete">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="mt-6 rounded-xl bg-white p-5 text-concrete">No products found.</p>
          ) : (
            <ul className="mt-5 divide-y divide-gray-200 rounded-xl bg-white">
              {products.map((product) => (
                <li key={product.productId} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{product.productName?.en || product.productId}</p>
                    <p className="text-sm text-concrete">{product.slug} · {product.productType}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(product)}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {isFormOpen && (
        <ProductFormModal
          product={editingProduct}
          products={products}
          onProductsChanged={handleProductsChanged}
          onClose={() => {
            setIsFormOpen(false)
            setEditingProduct(null)
          }}
          onSaved={handleSaved}
        />
      )}
    </main>
  )
}

export default AdminDashboardPage
