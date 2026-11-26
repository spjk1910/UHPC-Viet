import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const projects = [
  { key: 'giga', image: '/card_image/giga.jpg' },
  { key: 'lixil', image: '/card_image/lixil.jpg' },
  { key: 'olympus', image: '/card_image/olympus.png' },
]
const projectFields = ['location', 'contractor', 'products']

function ProjectsPage() {
  const { t } = useTranslation()
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return undefined

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [hash])

  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <img
          src="/background_image/application_herosection.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          style={{ transform: 'scaleX(-1)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-white/90 via-white/55 to-white/20 md:from-white/95 md:via-white/60 md:to-transparent"
        />
        <div className="site-container flex min-h-[300px] items-center py-12 sm:min-h-[360px] md:min-h-[420px]">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              {t('projectsPage.eyebrow')}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight text-dark sm:text-4xl md:text-5xl">
              {t('projectsPage.title')}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-concrete sm:text-base">
              {t('projectsPage.description')}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-light py-10 sm:py-14">
        <div className="site-container">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map(({ key, image }) => {
              const title = t(`home.applications.items.${key}`)

              return (
                <article
                  id={key}
                  key={key}
                  className="scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-5 sm:p-6">
                    <h2 className="text-xl font-bold text-dark">{title}</h2>
                    <dl className="mt-5 space-y-4">
                      {projectFields.map((field) => (
                        <div key={field}>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                            {t(`projectsPage.fields.${field}`)}
                          </dt>
                          <dd className="mt-1 text-sm leading-6 text-concrete">
                            {t(`projectsPage.items.${key}.${field}`)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProjectsPage