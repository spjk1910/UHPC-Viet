import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
    localStorage.setItem('language', language)
  }

  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <button
        type="button"
        onClick={() => changeLanguage('vi')}
        className={i18n.language === 'vi'
          ? 'text-brand-700'
          : 'text-gray-400 hover:text-dark'}
      >
        VI
      </button>

      <span className="text-gray-300">|</span>

      <button
        type="button"
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en'
          ? 'text-brand-700'
          : 'text-gray-400 hover:text-dark'}
      >
        EN
      </button>
    </div>
  )
}

export default LanguageSwitcher
