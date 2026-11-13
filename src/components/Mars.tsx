import { filled, isPlaceholder, links, mars } from '@/content'
import s from './Mars.module.scss'

export function Mars() {
  const facts = filled(mars.facts, 'value')
  const body = isPlaceholder(mars.body) ? mars.fallback : mars.body
  return (
    <section id="mars" className={s.section} aria-labelledby="mars-title">
      <div className={s.inner}>
        <div className={`${s.panel} ${facts.length ? '' : s.compact}`} data-reveal>
          <div className={s.copy}>
            <p className={s.eyebrow}>Powered by</p>
            <h2 id="mars-title" className={s.title}>
              $MARS
            </h2>
            <p className={s.body}>{body}</p>
            {!facts.length && (
              <a className={s.follow} href={links.x} target="_blank" rel="noopener noreferrer">
                Follow updates on X
              </a>
            )}
          </div>
          {facts.length > 0 && (
            <dl className={s.facts}>
              {facts.map((f) => (
                <div key={f.label} className={s.fact}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  )
}
