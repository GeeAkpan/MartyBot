import type { CSSProperties } from 'react'
import { steps } from '@/content'
import { SectionHeading } from './SectionHeading'
import s from './Steps.module.scss'

export function Steps() {
  return (
    <section id="how" className={s.section} aria-labelledby="how-title">
      <div className={s.inner}>
        <SectionHeading id="how-title" eyebrow="New to Marty?" accent="in 3 steps.">
          Your first trade
        </SectionHeading>

        <ol className={s.grid}>
          {steps.map((step, i) => (
            <li
              key={step.n}
              className={s.card}
              data-reveal
              style={{ '--reveal-delay': `${i * 120}ms` } as CSSProperties}
            >
              <div className={s.top}>
                <span className={s.num} aria-hidden="true">
                  {step.n}
                </span>
                <span className={s.tag}>{step.tag}</span>
              </div>
              <h3 className={s.title}>
                <span className="visually-hidden">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className={s.body}>{step.body}</p>
              {step.gas && (
                <dl className={s.gas}>
                  {step.gas.map((g) => (
                    <div key={g.token} className={s.gasRow}>
                      <dt>{g.token}</dt>
                      <dd>on {g.where}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
