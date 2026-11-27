import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Header from '../shared/components/Header/Header'
import Footer from '../shared/components/Footer/Footer'
import ContactBubble from '../shared/components/ContactBubble/ContactBubble'

export function MainLayout() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-white px-4 py-3 text-dark focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t('accessibility.skipToContent')}
      </a>
      <Header />

      <div id="main-content" className="flex-1">
        <Outlet />
      </div>

      <Footer />
      <ContactBubble />
    </div>
  )
}
