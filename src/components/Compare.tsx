import { compare, links } from '@/content'
import { Button } from './Button'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'
import s from './Compare.module.scss'

export function Compare() {
  return (
    <section className={s.section} aria-labelledby="compare-title">
      <div className={s.inner}>
        <SectionHeading id="compare-title" eyebrow={compare.eyebrow} accent={compare.accent}>
          {compare.title}
        </SectionHeading>

        <div className={s.grid}>
          <div className={`${s.col} ${s.old}`} data-reveal>
            <div className={s.colHead}>
              <h3>{compare.oldTitle}</h3>
              <span className={s.count}>{compare.old.length}+ steps</span>
            </div>
            <ol className={s.list}>
              {compare.old.map((t) => (
                <li key={t}>
                  <span className={s.x} aria-hidden="true">
                    <Icon name="close" size={14} />
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </div>

          <div className={`${s.col} ${s.new}`} data-reveal>
            <div className={s.colHead}>
              <h3>{compare.newTitle}</h3>
              <span className={`${s.count} ${s.countGold}`}>2 taps</span>
            </div>
            <ol className={s.list}>
              {compare.new.map((t) => (
                <li key={t}>
                  <span className={s.tick} aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                  {t}
                </li>
              ))}
            </ol>
            <Button href={links.bot} className={s.cta}>
              Try it on Telegram <Icon name="arrow" size={18} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
