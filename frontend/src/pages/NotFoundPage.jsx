import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <main className="relative isolate flex min-h-[65vh] items-center overflow-hidden bg-light py-16">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-20 -z-10 h-80 w-80 rounded-full bg-brand-100/70 blur-3xl"
      />
      <div className="site-container grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-brand-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
            {t('notFoundPage.eyebrow')}
          </p>
          <p className="text-7xl font-extrabold leading-none tracking-tight text-brand-600 sm:text-8xl">
            404
          </p>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-dark sm:text-4xl">
            {t('notFoundPage.title')}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-concrete sm:text-base">
            {t('notFoundPage.description')}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {t('notFoundPage.homeAction')}
            </Link>
            <Link
              to="/products"
              className="rounded-full border border-brand-600 px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
            >
              {t('notFoundPage.productsAction')}
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-lg">
          <svg
            viewBox="0 0 420 320"
            className="h-auto w-full"
            aria-hidden="true"
          >
            <circle cx="210" cy="158" r="132" fill="#eaf6ee" />
            <path
              d="M56 263h308"
              stroke="#b7c1bb"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M91 263V142h83v121M174 263V184h78v79M252 263V119h77v144"
              fill="#fff"
              stroke="#8c9790"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            <path
              d="M109 161h18v18h-18zm34 0h18v18h-18zm-34 34h18v18h-18zm34 0h18v18h-18zm45 8h17v18h-17zm32 0h17v18h-17zm32-66h17v18h-17zm31 0h17v18h-17zm-31 34h17v18h-17zm31 0h17v18h-17z"
              fill="#dce9df"
            />
            <path
              d="M203 263v-32h25v32"
              stroke="#8c9790"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            <circle cx="299" cy="76" r="34" fill="#008f45" />
            <path
              d="M291 69a9 9 0 1 1 15 7c-5 4-7 5-7 11m0 8v1"
              stroke="#fff"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="m71 109 11 11 22-25"
              stroke="#008f45"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
            />
          </svg>
        </div>
      </div>
    </main>
  )
}

export default NotFoundPage
