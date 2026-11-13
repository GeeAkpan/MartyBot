import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import lion from '@/assets/lion.webp'
import { links, nav } from '@/content'
import { Button } from './Button'
import { Icon } from './Icon'
import s from './Header.module.scss'

const DESKTOP = '(min-width: 64rem)'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  // Solid header once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = nav
      .map((n) => document.querySelector<HTMLElement>(n.href))
      .filter((el): el is HTMLElement => !!el)
    if (!sections.length || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Lock page scroll while the mobile menu is open; close on Escape or when resized to desktop.
  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    firstLinkRef.current?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const mq = window.matchMedia(DESKTOP)
    const onMq = () => mq.matches && setOpen(false)
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      html.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  // Close the menu first, then scroll, so the jump is never blocked by the scroll lock.
  const go = useCallback((e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return
    const target = href === '#top' ? document.body : document.querySelector(href)
    if (!target) return
    e.preventDefault()
    setOpen(false)
    requestAnimationFrame(() => {
      document.documentElement.style.overflow = ''
      if (href === '#top') window.scrollTo({ top: 0 })
      else target.scrollIntoView({ block: 'start' })
      history.replaceState(null, '', href)
    })
  }, [])

  return (
    <header className={`${s.header} ${scrolled || open ? s.scrolled : ''}`}>
      <div className={s.inner}>
        <a href="#top" className={s.brand} onClick={(e) => go(e, '#top')}>
          <img src={lion} alt="" width={40} height={40} className={s.logo} />
          <span>Marty Bot</span>
        </a>

        <button
          ref={toggleRef}
          type="button"
          className={s.toggle}
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>

        <nav aria-label="Main" className={`${s.nav} ${open ? s.navOpen : ''}`} id="site-nav">
          <ul className={s.list}>
            {nav.map((item, i) => (
              <li key={item.href}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  className={s.link}
                  aria-current={active === item.href ? 'true' : undefined}
                  onClick={(e) => go(e, item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href={links.bot} className={s.cta}>
            Open in Telegram
          </Button>
        </nav>
      </div>
    </header>
  )
}
