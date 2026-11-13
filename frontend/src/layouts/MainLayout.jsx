import { Outlet } from 'react-router-dom'

import Header from '../shared/components/Header/Header'
import Footer from '../shared/components/Footer/Footer'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}