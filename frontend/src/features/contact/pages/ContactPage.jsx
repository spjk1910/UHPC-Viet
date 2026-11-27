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
      <section aria-labelledby="contact-page-title" className="relative isolate overflow-hidden bg-light">
        <img
          src="/background_image/contact_hersection.jpg"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-white/95 via-white/85 to-white/10"
        />
        <div className="site-container flex min-h-[300px] items-center py-12 sm:min-h-[350px] md:min-h-[390px] md:py-16">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-brand-600/20 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-700 shadow-sm">
              {t('contactPage.eyebrow')}
            </p>
            <h1 id="contact-page-title" className="mt-4 text-4xl font-extrabold leading-tight text-dark sm:text-5xl md:text-6xl">
              {t('contactPage.title')}
            </h1>
            <span aria-hidden="true" className="mt-5 block h-1 w-14 rounded-full bg-brand-600" />
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#contact-form"
                className="inline-flex items-center rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-600"
              >
                {t('contactPage.formTitle')}
                <span aria-hidden="true" className="ml-2">&rarr;</span>
              </a>
              {contactInfo.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="inline-flex items-center rounded-full border border-dark/20 bg-white/80 px-5 py-3 text-sm font-semibold text-dark transition-colors hover:border-brand-600 hover:text-brand-700"
                >
                  <PhoneIcon className="mr-2 h-4 w-4" />
                  {contactInfo.phone}
                </a>
              )}
            </div>
          </div>
        </div>
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
            id="contact-form"
            className="scroll-mt-28 rounded-2xl bg-light p-6 sm:p-8"
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
