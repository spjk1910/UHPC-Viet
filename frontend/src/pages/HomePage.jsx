import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import CardGridSection from '../shared/components/CardGridSection/CardGridSection'
import ImagePlaceholder from '../shared/components/ImagePlaceholder/ImagePlaceholder'

function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const products = ['spacer', 'panel', 'furniture', 'other'].map((key) => ({
    key,
    title: t(`categories.${key}`),
    to: `/products?category=${key}`,
  }))
  const applications = ['commercial', 'landscape', 'industrial', 'residential'].map((key) => ({
    key,
    title: t(`home.applications.items.${key}`),
    to: '/projects',
  }))
  const benefitKeys = ['performance', 'durable', 'sustainable', 'precise']

  return (
    <main>
      <section className="bg-brand-50">
        <div className="site-container grid items-center gap-10 py-14 md:grid-cols-2 md:py-20 lg:gap-16 lg:py-24">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex rounded-full bg-brand-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
              {t('home.hero.eyebrow')}
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-dark sm:text-5xl lg:text-6xl">
              {t('home.hero.title')}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-concrete sm:text-lg">
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
          <ImagePlaceholder label={t('placehoders')} className="min-h-70 rounded-3xl shadow-sm sm:min-h-95" />
        </div>
      </section>

      <CardGridSection
        eyebrow={t('home.products.eyebrow')}
        title={t('home.products.title')}
        action={t('home.products.action')}
        actionTo="/products"
        imageLabel={t('placehoders')}
        items={products}
      />

      <section className="bg-light">
        <div className="site-container grid items-center gap-10 py-14 md:grid-cols-2 md:py-20 lg:gap-16">
          <ImagePlaceholder label={t('placehoders')} className="min-h-75 rounded-3xl" />
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              {t('home.story.eyebrow')}
            </p>
            <h2 className="section-title">{t('home.story.title')}</h2>
            <p className="mt-5 section-description">{t('home.story.description')}</p>
            <Link to="/about" className="mt-7 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
              {t('home.story.action')}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-dark text-white">
        <div className="site-container grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefitKeys.map((key, index) => (
            <div key={key} className="flex gap-4 border-white/15 sm:border-l sm:pl-6 first:border-0 first:pl-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 font-bold text-white">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold">{t(`home.benefits.${key}.title`)}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-300">{t(`home.benefits.${key}.description`)}</p>
              </div>
            </div>
          ))}
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
