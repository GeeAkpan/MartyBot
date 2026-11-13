import type { CSSProperties } from 'react'
import { features } from '@/content'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'
import s from './Features.module.scss'

export function Features() {
  return (
    <section id="features" className={s.section} aria-labelledby="features-title">
      <div className={s.inner}>
        <SectionHeading id="features-title" eyebrow="Then level up" accent="while you sleep.">
          Tools that work
        </SectionHeading>

        <ul className={s.bento}>
          {features.map((f, i) => (
            <li
              key={f.title}
              className={`${s.tile} ${f.wide ? s.wide : ''}`}
              data-reveal
              style={{ '--reveal-delay': `${i * 100}ms` } as CSSProperties}
            >
              <span className={s.icon}>
                <Icon name={f.icon} size={26} />
              </span>
              <p className={s.kicker}>{f.kicker}</p>
              <h3 className={s.title}>{f.title}</h3>
              <p className={s.body}>{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
