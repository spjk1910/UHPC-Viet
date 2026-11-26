import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import CheckCircleIcon from '../assets/icons/CheckCircleIcon'
import DiamondIcon from '../assets/icons/DiamondIcon'
import FactoryIcon from '../assets/icons/FactoryIcon'
import GearIcon from '../assets/icons/GearIcon'
import LightbulbIcon from '../assets/icons/LightbulbIcon'
import ShieldCheckIcon from '../assets/icons/ShieldCheckIcon'
import CardGridSection from '../shared/components/CardGridSection/CardGridSection'

function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const products = ['spacer', 'panel', 'furniture', 'other'].map((key) => ({
    key,
    title: t(`categories.${key}`),
    to: `/products?category=${key}`,
    image: `/card_image/${key}.jpg`,
  }))
  const applications = [
    { key: 'giga', image: '/card_image/giga.jpg' },
    { key: 'lixil', image: '/card_image/lixil.jpg' },
    { key: 'olympus', image: '/card_image/olympus.png' },
  ].map(({ key, image }) => ({
    key,
    title: t(`home.applications.items.${key}`),
    to: '/projects',
    image,
  }))
  const aboutHighlights = [
    { key: 'quality', Icon: ShieldCheckIcon },
    { key: 'technology', Icon: GearIcon },
    { key: 'partner', Icon: CheckCircleIcon },
  ]
  const whyChooseItems = [
    { key: 'durability', Icon: DiamondIcon },
    { key: 'consistency', Icon: ShieldCheckIcon },
    { key: 'flexibility', Icon: LightbulbIcon },
    { key: 'capacity', Icon: FactoryIcon },
  ]

  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <img
          src="/background_image/home_herosection.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center] sm:object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-white/95 via-white/80 to-white/10"
        />
        <div className="site-container flex min-h-[420px] items-center py-14 sm:min-h-[480px] md:py-20 lg:min-h-[560px] xl:min-h-[600px]">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex rounded-full bg-brand-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
              {t('home.hero.eyebrow')}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight text-dark sm:text-4xl md:text-5xl lg:text-6xl">
              {t('home.hero.title')}
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-concrete sm:text-base lg:text-lg">
              {t('home.hero.description')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
                {t('home.hero.primaryAction')}
              </Link>
              <Link to="/contact" className="rounded-full border border-brand-600 px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100">
                {t('home.hero.secondaryAction')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CardGridSection
        eyebrow={t('home.products.eyebrow')}
        title={t('home.products.title')}
        action={t('home.products.action')}
        actionTo="/products"
        imageLabel={t('placehoders')}
        items={products}
        className="pb-6 sm:pb-8"
      />

      <section className="bg-[#f5f5f5] py-8 sm:py-10">
        <div className="site-container grid items-center gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.4fr)_minmax(220px,0.9fr)] lg:gap-7">
          <img
            src="/background_image/home_aboutus.jpg"
            alt={t('home.story.imageAlt')}
            loading="lazy"
            className="h-52 w-full object-cover sm:h-60 md:h-full md:min-h-52 lg:h-48"
          />

          <div className="py-2">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
              {t('home.story.eyebrow')}
            </p>
            <h2 className="text-xl font-bold leading-tight text-dark sm:text-2xl">
              {t('home.story.title')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-concrete">
              {t('home.story.description')}
            </p>
            <Link
              to="/about"
              className="mt-4 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              {t('home.story.action')} →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 md:col-span-2 lg:col-span-1 lg:grid-cols-1 lg:border-l lg:border-brand-100 lg:py-1 lg:pl-6">
            {aboutHighlights.map(({ key, Icon }) => (
              <div key={key} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brand-600" />
                <div>
                  <h3 className="text-sm font-semibold leading-5 text-dark">
                    {t(`home.story.highlights.${key}.title`)}
                  </h3>
                  <p className="mt-0.5 text-xs leading-5 text-concrete">
                    {t(`home.story.highlights.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#dedede]">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-1/3 bg-[#c7c7c7] lg:block lg:[clip-path:polygon(0_0,65%_0,100%_100%,0_100%)]"
        />
        <div className="site-container relative py-4 sm:py-6">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div className="bg-[#c7c7c7] px-6 py-7 sm:px-8 lg:bg-transparent lg:py-9 lg:pr-14">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-600">
                {t('home.whyChoose.eyebrow')}
              </p>
              <h2 className="max-w-52 text-xl font-bold leading-tight text-dark sm:text-2xl">
                {t('home.whyChoose.title')}
              </h2>
              <span className="mt-4 block h-0.5 w-9 bg-brand-600" />
            </div>

            <div className="grid grid-cols-2 bg-[#dedede] sm:grid-cols-4">
              {whyChooseItems.map(({ key, Icon }) => (
                <article
                  key={key}
                  className="flex flex-col items-center justify-center border-t border-gray-400/50 px-3 py-5 text-center first:border-t-0 even:border-l sm:border-t-0 sm:border-l sm:first:border-l-0 sm:px-4 lg:py-6"
                >
                  <Icon className="mb-3 h-9 w-9 text-brand-600 sm:h-11 sm:w-11" />
                  <h3 className="text-xs font-semibold leading-5 text-dark sm:text-sm">
                    {t(`home.whyChoose.items.${key}.title`)}
                  </h3>
                  <p className="mt-1 max-w-40 text-[11px] leading-4 text-concrete sm:text-xs">
                    {t(`home.whyChoose.items.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CardGridSection
        eyebrow={t('home.applications.eyebrow')}
        title={t('home.applications.title')}
        action={t('home.applications.action')}
        actionTo="/projects"
        imageLabel={t('placehoders')}
        items={applications}
      />

      <section className="bg-brand-50">
        <div className="site-container grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              {t('home.contact.eyebrow')}
            </p>
            <h2 className="section-title">{t('home.contact.title')}</h2>
            <p className="mt-5 section-description">{t('home.contact.description')}</p>
            <Link to="/contact" className="mt-7 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
              {t('home.contact.action')}
            </Link>
          </div>

          <form
            className="rounded-3xl bg-white p-5 shadow-sm sm:p-8"
            onSubmit={(event) => {
              event.preventDefault()
              navigate('/contact')
            }}
          >
            <p className="mb-5 text-lg font-semibold text-dark">{t('home.contact.formTitle')}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-dark">
                {t('home.contact.name')} <span className="text-red-500">*</span>
                <input required name="name" className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-normal outline-none focus:border-brand-500" placeholder={t('home.contact.name')} />
              </label>
              <label className="text-sm font-medium text-dark">
                {t('home.contact.phone')} <span className="text-red-500">*</span>
                <input required name="phone" className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-normal outline-none focus:border-brand-500" placeholder={t('home.contact.phone')} />
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium text-dark">
              {t('home.contact.message')} <span className="text-red-500">*</span>
              <textarea required name="message" className="mt-2 min-h-28 w-full rounded-lg border border-gray-200 px-4 py-3 font-normal outline-none focus:border-brand-500" placeholder={t('home.contact.message')} />
            </label>
            <button type="submit" className="mt-4 flex w-full justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
              {t('home.contact.submit')}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default HomePage
