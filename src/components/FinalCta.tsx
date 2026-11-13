import qr from '@/assets/telegram-qr.svg'
import { links, safety } from '@/content'
import { Button } from './Button'
import { Icon } from './Icon'
import s from './FinalCta.module.scss'

export function FinalCta() {
  return (
    <section id="get-started" className={s.section} aria-labelledby="cta-title">
      <div className={s.inner}>
        <div className={s.panel} data-reveal>
          <div className={s.copy}>
            <h2 id="cta-title" className={s.title}>
              Your next trade is two taps away.
            </h2>
            <p className={s.sub}>Live on mainnet across 8 chains. No sign-up form.</p>
            <Button href={links.bot} variant="dark" size="lg">
              Start trading on Telegram <Icon name="arrow" size={20} />
            </Button>
          </div>
          <figure className={s.qr}>
            <img src={qr} alt="QR code that opens t.me/martytraderbot" width={168} height={168} loading="lazy" />
            <figcaption>On desktop? Scan to open Marty on your phone.</figcaption>
          </figure>
        </div>

        <ul className={s.safety} aria-label="Stay safe">
          {safety.map((t) => (
            <li key={t}>
              <Icon name="shield" size={18} />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
