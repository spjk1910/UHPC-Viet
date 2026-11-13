import { Routes, Route } from 'react-router-dom'

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

export function AppRouter() {
  return (
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

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}