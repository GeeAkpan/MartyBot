import type { Order } from '@/sim/engine'
import s from './Playground.module.scss'

const W = 320
const H = 120

export function PriceChart({ history, orders, entry }: { history: number[]; orders: Order[]; entry?: number }) {
  if (history.length < 2) {
    return <div className={s.chartEmpty}>Paste a contract to see the live price.</div>
  }
  const levels = [...orders.map((o) => o.trigger), ...(entry ? [entry] : [])]
  const all = [...history, ...levels]
  const min = Math.min(...all)
  const max = Math.max(...all)
  const pad = (max - min) * 0.1 || max * 0.05
  const lo = min - pad
  const hi = max + pad
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H
  const x = (i: number) => (i / (history.length - 1)) * W
  const pts = history.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const up = history[history.length - 1] >= history[0]

  return (
    <svg className={s.chart} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`Price chart, trending ${up ? 'up' : 'down'}`}>
      <defs>
        <linearGradient id="pg-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e8c77a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#e8c77a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#pg-fill)" />
      <polyline points={pts} fill="none" stroke="#e8c77a" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {entry && (
        <line x1="0" x2={W} y1={y(entry)} y2={y(entry)} className={s.lvlEntry} vectorEffect="non-scaling-stroke" />
      )}
      {orders.map((o) => (
        <line
          key={o.id}
          x1="0"
          x2={W}
          y1={y(o.trigger)}
          y2={y(o.trigger)}
          className={o.kind === 'tp' ? s.lvlTp : o.kind === 'sl' ? s.lvlSl : s.lvlLimit}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}
