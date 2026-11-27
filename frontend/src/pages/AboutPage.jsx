import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import CheckCircleIcon from '../assets/icons/CheckCircleIcon'
import DiamondIcon from '../assets/icons/DiamondIcon'
import LightbulbIcon from '../assets/icons/LightbulbIcon'
import ShieldCheckIcon from '../assets/icons/ShieldCheckIcon'

const coreValues = [
  { key: 'quality', Icon: ShieldCheckIcon },
  { key: 'durability', Icon: DiamondIcon },
  { key: 'innovation', Icon: LightbulbIcon },
  { key: 'partnership', Icon: CheckCircleIcon },
]

function AboutPage() {
  const { t } = useTranslation()

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-light">
        <img
          src="/background_image/aboutus_herosection.jpg"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_center]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-white/95 via-white/85 to-white/20" />
        <div className="site-container flex min-h-[210px] items-center py-9 sm:min-h-[250px] sm:py-11 md:min-h-[280px]">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-brand-700/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-700 shadow-sm sm:text-sm">
              {t('aboutPage.hero.eyebrow')}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-dark sm:text-4xl md:text-5xl">
              {t('aboutPage.hero.title')}
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-dark/75 sm:text-base">
              {t('aboutPage.hero.description')}
            </p>
            <Link
              to="/products"
              className="mt-5 inline-flex items-center rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
            >
              {t('aboutPage.capabilities.action')}
              <span aria-hidden="true" className="ml-2">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="site-container grid items-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)] md:gap-12 lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              {t('aboutPage.company.eyebrow')}
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-tight text-dark sm:text-3xl">
              {t('aboutPage.company.title')}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-concrete sm:text-base">
              {t('aboutPage.company.description')}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-concrete">
              {t('aboutPage.company.detail')}
            </p>
          </div>
          <img
            src="/card_image/panel.jpg"
            alt={t('aboutPage.company.imageAlt')}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </div>
      </section>

      <section className="bg-brand-50 py-9 sm:py-11">
        <div className="site-container">
          <div className="mb-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
              {t('aboutPage.values.eyebrow')}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-dark sm:text-3xl">
              {t('aboutPage.values.title')}
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-0 lg:grid-cols-4">
            {coreValues.map(({ key, Icon }, index) => (
              <article
                key={key}
                className={`flex items-center gap-4 px-2 py-3 sm:flex-col sm:px-5 sm:text-center lg:px-6 ${
                  index % 2 === 1 ? 'sm:border-l' : ''
                } ${index > 1 ? 'lg:border-l' : ''}`}
              >
                <Icon className="h-8 w-8 shrink-0 text-brand-600" />
                <div>
                  <h3 className="text-sm font-bold text-dark">
                    {t(`aboutPage.values.items.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-concrete sm:text-sm">
                    {t(`aboutPage.values.items.${key}.description`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="site-container grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              {t('aboutPage.capabilities.eyebrow')}
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-dark sm:text-3xl">
              {t('aboutPage.capabilities.title')}
            </h2>
            <p className="mt-4 text-sm leading-7 text-concrete sm:text-base">
              {t('aboutPage.capabilities.description')}
            </p>
            <ul className="mt-5 space-y-3">
              {['productRange', 'modernProduction', 'customerSupport'].map((key) => (
                <li key={key} className="flex items-start gap-3 text-sm leading-6 text-dark">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <span>{t(`aboutPage.capabilities.points.${key}`)}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              {t('aboutPage.capabilities.action')}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <img
            src="/card_image/furniture.jpg"
            alt={t('aboutPage.capabilities.imageAlt')}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </div>
      </section>

      <section className="bg-dark py-9 text-white sm:py-11">
        <div className="site-container flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-100">
              {t('aboutPage.contact.eyebrow')}
            </p>
            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              {t('aboutPage.contact.title')}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              {t('aboutPage.contact.description')}
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t('aboutPage.contact.action')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
