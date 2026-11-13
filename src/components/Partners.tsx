import { links, partnerPitch, partners } from '@/content'
import { Button } from './Button'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'
import s from './Partners.module.scss'

export function Partners() {
  return (
    <section id="partners" className={s.section} aria-labelledby="partners-title">
      <div className={s.inner}>
        <SectionHeading id="partners-title" eyebrow="Official partners" accent="in two taps.">
          Buy partner tokens
        </SectionHeading>

        <ul className={s.grid}>
          {partners.map((p) => (
            <li key={p.ticker} className={s.card} data-reveal>
              <div className={s.head}>
                <p className={s.ticker}>{p.ticker}</p>
                <p className={s.meta}>
                  {p.name} · {p.chain}
                </p>
              </div>
              <Button href={p.link} aria-label={`Trade ${p.ticker} on Marty Bot`}>
                Trade {p.ticker} <Icon name="arrow" size={18} />
              </Button>
            </li>
          ))}
          <li className={`${s.card} ${s.invite}`} data-reveal>
            <span className={s.plus}>
              <Icon name="plus" size={22} />
            </span>
            <h3 className={s.inviteTitle}>{partnerPitch.title}</h3>
            <p className={s.inviteBody}>{partnerPitch.body}</p>
            <a href={links.partnerContact} className={s.inviteLink} target="_blank" rel="noopener noreferrer">
              {partnerPitch.cta} <Icon name="arrow" size={18} />
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
