import { useTranslation } from 'react-i18next'

import AddressIcon from '../../../assets/icons/AddressIcon'
import EmailIcon from '../../../assets/icons/EmailIcon'
import PhoneIcon from '../../../assets/icons/PhoneIcon'

function ContactPage() {
  const { i18n, t } = useTranslation()
  const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'vi'
  const footerData = i18n.getResource(locale, 'common', 'footer') ?? {}
  const contactInfo = footerData.contactInfo ?? {}
  const mapQuery = contactInfo.address || 'UHPC Viet'

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-50">
        <div className="site-container relative z-10 py-14 md:py-20">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
            {t('contactPage.eyebrow')}
          </p>
          <h1 className="text-4xl font-extrabold text-dark sm:text-5xl">
            {t('contactPage.title')}
          </h1>
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-brand-50 via-brand-50/80 to-transparent" />
      </section>

      <section className="section-spacing">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_1px_1fr] lg:gap-12">
          <div>
            <h2 className="section-title text-2xl sm:text-3xl">
              {t('contactPage.informationTitle')}
            </h2>

            <div className="mt-8 space-y-5 text-concrete">
              {contactInfo.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-start gap-3 transition-colors hover:text-brand-600"
                >
                  <EmailIcon />
                  <span className="wrap-break-word underline underline-offset-4">
                    {contactInfo.email}
                  </span>
                </a>
              )}

              {contactInfo.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-start gap-3 transition-colors hover:text-brand-600"
                >
                  <PhoneIcon />
                  <span>{contactInfo.phone}</span>
                </a>
              )}

              {contactInfo.address && (
                <div className="flex items-start gap-3 leading-6">
                  <AddressIcon />
                  <span>{contactInfo.address}</span>
                </div>
              )}
            </div>

            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              title={t('contactPage.mapTitle')}
              className="mt-8 h-64 w-full rounded-2xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="hidden bg-gray-200 lg:block" />

          <form
            className="rounded-2xl bg-light p-6 sm:p-8"
            onSubmit={(event) => event.preventDefault()}
          >
            <h2 className="section-title text-2xl sm:text-3xl">
              {t('contactPage.formTitle')}
            </h2>

            <div className="mt-8 space-y-5">
              <label className="block text-sm font-medium text-dark">
                {t('contactPage.name')} <span className="text-red-500">*</span>
                <input
                  required
                  name="name"
                  type="text"
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-normal outline-none transition-colors focus:border-brand-500"
                  placeholder={t('contactPage.name')}
                />
              </label>

              <label className="block text-sm font-medium text-dark">
                {t('contactPage.phone')} <span className="text-red-500">*</span>
                <input
                  required
                  name="phone"
                  type="tel"
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-normal outline-none transition-colors focus:border-brand-500"
                  placeholder={t('contactPage.phone')}
                />
              </label>

              <label className="block text-sm font-medium text-dark">
                {t('contactPage.message')} <span className="text-red-500">*</span>
                <textarea
                  required
                  name="message"
                  className="mt-2 min-h-36 w-full resize-y rounded-lg border border-gray-200 bg-white px-4 py-3 font-normal outline-none transition-colors focus:border-brand-500"
                  placeholder={t('contactPage.message')}
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:w-auto"
              >
                {t('contactPage.submit')} →
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default ContactPage
