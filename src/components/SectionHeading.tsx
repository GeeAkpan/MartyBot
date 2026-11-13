import type { ReactNode } from 'react'
import s from './SectionHeading.module.scss'

export function SectionHeading({
  id,
  eyebrow,
  children,
  accent,
  align = 'start',
}: {
  id?: string
  eyebrow: string
  children: ReactNode
  accent?: ReactNode
  align?: 'start' | 'center'
}) {
  return (
    <header className={`${s.head} ${align === 'center' ? s.center : ''}`} data-reveal>
      <p className={s.eyebrow}>{eyebrow}</p>
      <h2 id={id} className={s.title}>
        {children} {accent && <span className={s.accent}>{accent}</span>}
      </h2>
    </header>
  )
}
