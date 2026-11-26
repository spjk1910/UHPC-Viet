import { useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import { APP_ROUTES } from '../config/appRoutes'
import { MainLayout } from '../layouts/MainLayout'

import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import NotFoundPage from '../pages/NotFoundPage'
import CataloguePage from '../pages/CataloguePage'

import ProductsPage from '../features/products/pages/ProductsPage'
import ProductDetailPage from '../features/products/pages/ProductDetailPage'
import ContactPage from '../features/contact/pages/ContactPage'
import ProjectsPage from '../features/projects/pages/ProjectsPage'
import AdminSignInPage from '../features/admin/pages/AdminSignInPage'
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage'
import AdminRoute from '../features/admin/components/AdminRoute'

function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={APP_ROUTES.home} element={<HomePage />} />
          <Route path={APP_ROUTES.about} element={<AboutPage />} />
          <Route path={APP_ROUTES.products} element={<ProductsPage />} />
          <Route path={APP_ROUTES.productDetail} element={<ProductDetailPage />} />
          <Route path={APP_ROUTES.projects} element={<ProjectsPage/>} />
          <Route path={APP_ROUTES.catalogue} element={<CataloguePage/>} />
          <Route path={APP_ROUTES.contact} element={<ContactPage />} />
        </Route>

        <Route path={APP_ROUTES.admin} element={<AdminSignInPage />} />
        <Route
          path={APP_ROUTES.adminDashboard}
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}