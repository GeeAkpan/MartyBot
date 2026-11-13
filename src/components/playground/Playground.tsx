import { useEffect, useRef, useState, type FormEvent } from 'react'
import lion from '@/assets/lion.webp'
import { links } from '@/content'
import { fmtNum, fmtPct, fmtQty, GOALS, type Msg } from '@/sim/engine'
import { useMartySim, useOnScreen } from '@/sim/useMartySim'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { SectionHeading } from '../SectionHeading'
import { PriceChart } from './PriceChart'
import s from './Playground.module.scss'

const ORDER_LABEL = { limit: 'Limit buy', tp: 'Take-profit', sl: 'Stop-loss' } as const

export function Playground() {
  const [sectionRef, onScreen] = useOnScreen<HTMLElement>()
  const [state, dispatch] = useMartySim(onScreen)
  const [draft, setDraft] = useState('')
  const logRef = useRef<HTMLOListElement>(null)

  // Keep the newest message in view without scrolling the page.
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [state.messages[state.messages.length - 1]?.id])

  const send = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    dispatch({ type: 'user', text: draft })
    setDraft('')
  }

  const { chain, token, position } = state
  const value = position && token ? position.qty * token.price : 0
  const pnl = position ? ((value - position.cost) / position.cost) * 100 : 0
  const doneCount = GOALS.filter((g) => state.done[g.id]).length
  const change =
    state.history.length > 1 ? ((state.history[state.history.length - 1] - state.history[0]) / state.history[0]) * 100 : 0

  return (
    <section id="try" ref={sectionRef} className={s.section} aria-labelledby="try-title">
      <div className={s.inner}>
        <SectionHeading id="try-title" eyebrow="Try it here" accent="before you fund.">
          Take Marty for a test drive
        </SectionHeading>

        <div className={s.layout}>
          {/* ---------------- Chat ---------------- */}
          <div className={s.phone}>
            <div className={s.bar}>
              <img src={lion} alt="" width={40} height={40} className={s.avatar} />
              <div className={s.barText}>
                <p className={s.barName}>Marty Bot</p>
                <p className={s.barSub}>{chain ? `${chain.name} · demo wallet` : 'demo'}</p>
              </div>
              <span className={s.demoBadge}>Demo · no real funds</span>
            </div>

            <ol ref={logRef} className={s.log} role="log" aria-live="polite" aria-label="Marty Bot demo chat">
              {state.messages.map((m) => (
                <Message key={m.id} m={m} onAction={dispatch} />
              ))}
            </ol>

            <form className={s.composer} onSubmit={send}>
              <label htmlFor="pg-input" className="visually-hidden">
                Message Marty
              </label>
              <input
                id="pg-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={state.awaiting ? 'Type an amount, e.g. 0.2' : 'Type /start or paste a contract address'}
                autoComplete="off"
                spellCheck={false}
                inputMode={state.awaiting ? 'decimal' : 'text'}
              />
              <button type="submit" aria-label="Send" className={s.sendBtn}>
                <Icon name="send" size={20} />
              </button>
            </form>
          </div>

          {/* ---------------- Dashboard ---------------- */}
          <aside className={s.panel} aria-label="Demo wallet">
            <div className={s.card}>
              <div className={s.cardHead}>
                <p className={s.label}>Demo wallet</p>
                <button type="button" className={s.textBtn} onClick={() => dispatch({ type: 'reset' })}>
                  Reset
                </button>
              </div>
              <dl className={s.stats}>
                <div>
                  <dt>Balance</dt>
                  <dd>{chain ? `${fmtNum(state.balance)} ${chain.native}` : '—'}</dd>
                </div>
                <div>
                  <dt>Position</dt>
                  <dd>{position && token ? `${fmtQty(position.qty)} $${token.symbol}` : '—'}</dd>
                </div>
                <div>
                  <dt>Value</dt>
                  <dd>{position && chain ? `${fmtNum(value)} ${chain.native}` : '—'}</dd>
                </div>
                <div>
                  <dt>PnL</dt>
                  <dd className={position ? (pnl >= 0 ? s.up : s.down) : ''}>{position ? fmtPct(pnl) : '—'}</dd>
                </div>
              </dl>
            </div>

            <div className={s.card}>
              <div className={s.cardHead}>
                <p className={s.label}>{token ? `$${token.symbol} price` : 'Price'}</p>
                {token && chain && (
                  <p className={`${s.price} ${change >= 0 ? s.up : s.down}`}>
                    {fmtNum(token.price)} {chain.native} <span>{fmtPct(change)}</span>
                  </p>
                )}
              </div>
              <PriceChart
                history={state.history}
                orders={state.orders}
                entry={position ? position.cost / position.qty : undefined}
              />
              <div className={s.market}>
                <span className={s.marketLabel}>Move the market</span>
                <button type="button" disabled={!token} onClick={() => dispatch({ type: 'nudge', pct: 15 })}>
                  Pump +15%
                </button>
                <button type="button" disabled={!token} onClick={() => dispatch({ type: 'nudge', pct: -15 })}>
                  Dump −15%
                </button>
              </div>
              {state.orders.length > 0 && (
                <ul className={s.orders} aria-label="Open orders">
                  {state.orders.map((o) => (
                    <li key={o.id} className={s[`ord${o.kind}`]}>
                      <span>
                        {ORDER_LABEL[o.kind]} at {fmtNum(o.trigger)}
                      </span>
                      <button
                        type="button"
                        className={s.textBtn}
                        onClick={() => dispatch({ type: 'cancelOrder', id: o.id })}
                        aria-label={`Cancel ${ORDER_LABEL[o.kind]}`}
                      >
                        Cancel
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {state.copy && (
                <p className={s.copying}>
                  <span className={s.liveDot} aria-hidden="true" /> Copying {state.copy.label} {state.copy.address}
                </p>
              )}
            </div>

            <div className={s.card}>
              <div className={s.cardHead}>
                <p className={s.label}>Things to try</p>
                <p className={s.progress}>
                  {doneCount}/{GOALS.length}
                </p>
              </div>
              <ul className={s.goals}>
                {GOALS.map((g) => (
                  <li key={g.id} className={state.done[g.id] ? s.goalDone : ''}>
                    <span className={s.check} aria-hidden="true" />
                    {g.label}
                    {state.done[g.id] && <span className="visually-hidden"> (done)</span>}
                  </li>
                ))}
              </ul>
              {doneCount === GOALS.length ? (
                <Button href={links.bot} className={s.realCta}>
                  You're ready. Trade for real <Icon name="arrow" size={18} />
                </Button>
              ) : (
                <p className={s.note}>
                  Prices here are simulated. Real trades happen in <a href={links.bot}>@martytraderbot</a>.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Message({ m, onAction }: { m: Msg; onAction: (a: NonNullable<Msg['keyboard']>[number][number]['action']) => void }) {
  return (
    <li className={`${s.msg} ${m.from === 'me' ? s.me : s.bot} ${m.tone ? s[m.tone] : ''}`}>
      {m.title && <p className={s.msgTitle}>{m.title}</p>}
      {m.text && <p className={s.msgText}>{m.text}</p>}
      {m.lines && (
        <ul className={s.msgLines}>
          {m.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
      {m.keyboard && (
        <div className={s.keyboard}>
          {m.keyboard.map((row, i) => (
            <div key={i} className={s.kbRow}>
              {row.map((b) => (
                <button key={b.label} type="button" className={s.kbBtn} onClick={() => onAction(b.action)}>
                  {b.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </li>
  )
}
