import lion from '@/assets/lion.webp'
import { isPlaceholder, links } from '@/content'
import s from './Footer.module.scss'

const footerLinks = [
  { label: 'Telegram', href: links.bot },
  { label: 'X (@matarabot)', href: links.x },
  { label: 'Docs', href: links.docs },
  { label: 'Community', href: links.community },
].filter((l) => !isPlaceholder(l.href))

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer id="site-footer" className={s.footer}>
      <div className={s.inner}>
        <div className={s.brand}>
          <img src={lion} alt="" width={36} height={36} className={s.logo} />
          <div>
            <p className={s.name}>@martytraderbot</p>
            <p className={s.tag}>The fastest Telegram bot, powered by $MARS</p>
          </div>
        </div>

        <nav aria-label="Footer">
          <ul className={s.links}>
            {footerLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className={s.legal}>
          Trading crypto carries a high risk. Token prices can go to zero. Nothing on this site is financial advice.
          Only trade what you can afford to lose. © {year} Marty Bot.
        </p>
      </div>
    </footer>
  )
}
