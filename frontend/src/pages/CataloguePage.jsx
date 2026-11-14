import { useTranslation } from 'react-i18next'

const CATALOGUE_URL = '/catalogue/uhpc-viet_catalogue.pdf'

function CataloguePage() {
  const { t } = useTranslation()

  return (
    <main className="bg-light">
      <section className="site-container py-12 md:py-16">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              {t('navigation.catalogue')}
            </p>
            <h1 className="section-title">{t('cataloguePage.title')}</h1>
            <p className="mt-4 max-w-2xl section-description">
              {t('cataloguePage.description')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={CATALOGUE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-brand-600 px-5 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
            >
              {t('cataloguePage.open')}
            </a>
            <a
              href={CATALOGUE_URL}
              download
              className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {t('cataloguePage.download')}
            </a>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <iframe
            src={CATALOGUE_URL}
            title={t('cataloguePage.title')}
            className="h-[75vh] min-h-[520px] w-full"
          />
        </div>
      </section>
    </main>
  )
}

export default CataloguePage