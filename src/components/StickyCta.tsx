import { useEffect, useState } from 'react'
import lion from '@/assets/lion.webp'
import { links } from '@/content'
import s from './StickyCta.module.scss'

/**
 * Mobile-only "Open in Telegram" bar. It appears once the hero has scrolled away
 * and hides near the demo, the final CTA and the footer, so it never covers
 * anything people are interacting with.
 */
export function StickyCta() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const ids = ['top', 'try', 'get-started', 'site-footer']
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (!els.length || !('IntersectionObserver' in window)) return
    const visible = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        setShow(visible.size === 0)
      },
      { threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className={`${s.bar} ${show ? s.show : ''}`} aria-hidden={!show}>
      <a href={links.bot} className={s.link} tabIndex={show ? 0 : -1} target="_blank" rel="noopener noreferrer">
        <img src={lion} alt="" width={32} height={32} className={s.logo} />
        <span className={s.text}>
          <strong>Trade in two taps</strong>
          <span>Open @martytraderbot</span>
        </span>
        <span className={s.go}>Open</span>
      </a>
    </div>
  )
}
