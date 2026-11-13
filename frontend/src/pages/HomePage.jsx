
import { useTranslation } from 'react-i18next'

function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="site-container py-10">
      <h1 className="text-3xl font-bold">
        {t('navigation.home')}
      </h1>
    </div>
  )
}

export default HomePage
