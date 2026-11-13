import { chains } from '@/content'
import s from './ChainMarquee.module.scss'

export function ChainMarquee() {
  // Rendered twice so the loop is seamless; the copy is hidden from assistive tech.
  const row = (hidden: boolean) => (
    <ul className={s.row} aria-hidden={hidden || undefined}>
      {chains.map((c) => (
        <li key={c.name} className={c.placeholder ? s.placeholder : s.chip}>
          {c.name}
        </li>
      ))}
    </ul>
  )

  return (
    <section className={s.band} aria-labelledby="chains-title">
      <div className={s.inner}>
        <h2 id="chains-title" className={s.label}>
          Trade across 8 chains
        </h2>
        <div className={s.viewport}>
          <div className={s.track}>
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
    </section>
  )
}
