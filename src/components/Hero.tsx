import { hero, links } from '@/content'
import { Button } from './Button'
import { ChatDemo } from './ChatDemo'
import { Icon } from './Icon'
import s from './Hero.module.scss'

export function Hero() {
  return (
    <section id="top" className={s.hero} aria-labelledby="hero-title">
      <div className={s.inner}>
        <div className={s.copy}>
          <p className={s.eyebrow}>
            <span className={s.pulse} aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className={s.title}>
            {hero.titleA}
            <br />
            <span className={s.accent}>{hero.titleB}</span>
          </h1>
          <p className={s.lede}>{hero.lede}</p>
          <div className={s.actions}>
            <Button href={links.bot} size="lg">
              {hero.primaryCta} <Icon name="arrow" size={20} />
            </Button>
            <Button href="#try" variant="ghost" size="lg">
              {hero.secondaryCta}
            </Button>
          </div>
          <p className={s.micro}>{hero.micro}</p>
          <ul className={s.meta}>
            {hero.meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <ChatDemo />
      </div>
    </section>
  )
}
