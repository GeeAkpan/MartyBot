import { useEffect, useState } from 'react'
import lion from '@/assets/lion.webp'
import s from './ChatDemo.module.scss'

// Messages appear one by one to show the 3-step flow.
const script = [
  { from: 'me', text: '/start' },
  { from: 'bot', text: 'Welcome to Marty.\nYour trading wallet is ready.' },
  { from: 'me', text: '0x…contract address' },
  { from: 'bot', card: true },
] as const

export function ChatDemo() {
  const reduce =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [shown, setShown] = useState(reduce ? script.length : 0)

  useEffect(() => {
    if (shown >= script.length) return
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 500 : 900)
    return () => clearTimeout(t)
  }, [shown])

  return (
    <figure className={s.wrap}>
      <div className={s.glow} aria-hidden="true" />
      <div className={s.phone}>
        <div className={s.top}>
          <img src={lion} alt="" width={44} height={44} className={s.avatar} />
          <div>
            <p className={s.name}>Marty Bot</p>
            <p className={s.status}>
              <span className={s.dot} /> online
            </p>
          </div>
        </div>

        <ol className={s.thread} aria-label="Example conversation with Marty Bot">
          {script.slice(0, shown).map((m, i) =>
            'card' in m ? (
              <li key={i} className={`${s.msg} ${s.card}`}>
                <p className={s.ticker}>$TOKEN</p>
                <div className={s.buys} aria-hidden="true">
                  <span>Buy 0.05</span>
                  <span>Buy 0.1</span>
                  <span>Buy X</span>
                </div>
                <span className="visually-hidden">Buy buttons: 0.05, 0.1 or a custom amount</span>
              </li>
            ) : (
              <li key={i} className={`${s.msg} ${m.from === 'me' ? s.me : s.bot}`}>
                {m.text}
              </li>
            ),
          )}
        </ol>
      </div>
      <figcaption className="visually-hidden">
        Tap Start, paste a contract address, then pick a buy amount.
      </figcaption>
    </figure>
  )
}
