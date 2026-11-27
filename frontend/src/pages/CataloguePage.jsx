import { useTranslation } from 'react-i18next'

const CATALOGUE_URL = '/catalogue/uhpc-viet_catalogue.pdf'

function CataloguePage() {
  const { t } = useTranslation()

  return (
    <main className="bg-light">
      <section className="relative isolate overflow-hidden bg-dark text-white">
        <div aria-hidden="true" className="absolute -right-24 -top-36 -z-10 h-[28rem] w-[28rem] rounded-full border border-white/10 bg-brand-600/20 blur-3xl" />
        <div aria-hidden="true" className="absolute bottom-0 left-0 -z-10 h-1 w-full bg-gradient-to-r from-brand-500 via-brand-300 to-transparent" />
        <div className="site-container grid gap-8 py-12 sm:py-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12 md:py-20">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-100">
              {t('navigation.catalogue')}
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
              {t('cataloguePage.title')}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              {t('cataloguePage.description')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:max-w-64 md:flex-col">
            <a
              href={CATALOGUE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              {t('cataloguePage.open')}
            </a>
            <a
              href={CATALOGUE_URL}
              download
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-brand-600"
            >
              {t('cataloguePage.download')}
            </a>
          </div>
        </div>
      </section>

      <section className="site-container py-10 md:py-14">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
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
