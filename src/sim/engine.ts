// ---------------------------------------------------------------
// Marty Bot playground: a self-contained simulation of the bot's
// chat flow. Nothing here touches a real wallet, chain or API.
// ---------------------------------------------------------------

export type Chain = {
  id: string
  name: string
  native: string
  startBalance: number
  presets: [number, number]
  solana?: boolean
}

export const CHAINS: Chain[] = [
  { id: 'bsc', name: 'BSC', native: 'BNB', startBalance: 1, presets: [0.05, 0.1] },
  { id: 'eth', name: 'Ethereum', native: 'ETH', startBalance: 0.5, presets: [0.01, 0.05] },
  { id: 'base', name: 'Base', native: 'ETH', startBalance: 0.5, presets: [0.01, 0.05] },
  { id: 'arb', name: 'Arbitrum', native: 'ETH', startBalance: 0.5, presets: [0.01, 0.05] },
  { id: 'sol', name: 'Solana', native: 'SOL', startBalance: 5, presets: [0.25, 0.5], solana: true },
  { id: 'arc', name: 'Arc', native: 'USDC', startBalance: 1000, presets: [25, 50] },
  { id: 'hood', name: 'Robinhood', native: 'ETH', startBalance: 0.5, presets: [0.01, 0.05] },
  { id: 'mega', name: 'MegaETH', native: 'ETH', startBalance: 0.5, presets: [0.01, 0.05] },
]

export const COPY_WALLETS = [
  { label: 'Whale', address: '0x7a3c…f19e' },
  { label: 'Sniper', address: '0x91cd…2be4' },
]

export type Action =
  | { type: 'user'; text: string }
  | { type: 'start' }
  | { type: 'chooseChainMenu' }
  | { type: 'chooseChain'; id: string }
  | { type: 'pasteDemo' }
  | { type: 'buy'; amount: number }
  | { type: 'askBuyX' }
  | { type: 'sell'; fraction: number }
  | { type: 'tpslMenu' }
  | { type: 'limitMenu' }
  | { type: 'setOrder'; kind: OrderKind; pct: number }
  | { type: 'cancelOrder'; id: number }
  | { type: 'wallet' }
  | { type: 'positions' }
  | { type: 'help' }
  | { type: 'copyMenu' }
  | { type: 'copyStart'; index: number }
  | { type: 'copyStop' }
  | { type: 'copyTrade' }
  | { type: 'tick' }
  | { type: 'nudge'; pct: number }
  | { type: 'reset' }

export type Button = { label: string; action: Action }
export type OrderKind = 'limit' | 'tp' | 'sl'
export type Order = { id: number; kind: OrderKind; trigger: number; size: number }

export type Msg = {
  id: number
  from: 'me' | 'bot'
  text?: string
  title?: string
  lines?: string[]
  tone?: 'success' | 'warn'
  keyboard?: Button[][]
}

export type Token = { symbol: string; address: string; price: number }

export type Goal = 'start' | 'chain' | 'paste' | 'buy' | 'limit' | 'tpsl' | 'copy' | 'sell'

export const GOALS: { id: Goal; label: string }[] = [
  { id: 'start', label: 'Tap /start' },
  { id: 'chain', label: 'Pick a chain' },
  { id: 'paste', label: 'Paste a contract' },
  { id: 'buy', label: 'Make a buy' },
  { id: 'limit', label: 'Set a limit order' },
  { id: 'tpsl', label: 'Set take-profit or stop-loss' },
  { id: 'copy', label: 'Copy a wallet' },
  { id: 'sell', label: 'Sell' },
]

export type State = {
  started: boolean
  chain: Chain | null
  balance: number
  token: Token | null
  history: number[]
  position: { qty: number; cost: number } | null
  orders: Order[]
  copy: (typeof COPY_WALLETS)[number] | null
  awaiting: 'buyAmount' | null
  messages: Msg[]
  done: Partial<Record<Goal, boolean>>
  seq: number
}

export const initialState: State = {
  started: false,
  chain: null,
  balance: 0,
  token: null,
  history: [],
  position: null,
  orders: [],
  copy: null,
  awaiting: null,
  messages: [
    {
      id: 0,
      from: 'bot',
      title: 'Marty Bot · demo',
      text: 'This is a practice version of Marty with pretend funds. Tap Start to begin.',
      keyboard: [[{ label: 'Start', action: { type: 'start' } }]],
    },
  ],
  done: {},
  seq: 1,
}

// ---------- formatting ------------------------------------------------
export const fmtNum = (n: number, digits = 4) =>
  n.toLocaleString('en-US', { maximumSignificantDigits: digits, minimumSignificantDigits: Math.min(2, digits) })

export const fmtQty = (n: number) =>
  n.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 2 })

export const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`

// ---------- helpers ---------------------------------------------------
const SYMBOLS = ['LION', 'ROAR', 'MANE', 'PRIDE', 'CUB', 'SAVNA', 'GOLD', 'APEX']
const HEX = '0123456789abcdef'
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)]
const randStr = (chars: string, n: number) => Array.from({ length: n }, () => pick(chars.split(''))).join('')

export const demoAddress = (chain: Chain) => (chain.solana ? randStr(B58, 44) : `0x${randStr(HEX, 40)}`)
const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`

const isAddress = (t: string) => /^0x[0-9a-fA-F]{6,64}$/.test(t) || /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(t)

function newToken(chain: Chain, address: string): Token {
  const price = chain.presets[0] / (8_000 + Math.random() * 60_000)
  return { symbol: pick(SYMBOLS), address, price }
}

// ---------- reducer ---------------------------------------------------
type Draft = State

function say(s: Draft, msg: Omit<Msg, 'id'>) {
  s.messages = [...s.messages, { ...msg, id: s.seq++ }].slice(-80)
}

function mainMenu(): Button[][] {
  return [
    [{ label: 'Paste demo contract', action: { type: 'pasteDemo' } }],
    [
      { label: 'Wallet', action: { type: 'wallet' } },
      { label: 'Positions', action: { type: 'positions' } },
    ],
    [
      { label: 'Copy trading', action: { type: 'copyMenu' } },
      { label: 'Switch chain', action: { type: 'chooseChainMenu' } },
    ],
  ]
}

function tokenKeyboard(c: Chain): Button[][] {
  return [
    [
      { label: `Buy ${c.presets[0]}`, action: { type: 'buy', amount: c.presets[0] } },
      { label: `Buy ${c.presets[1]}`, action: { type: 'buy', amount: c.presets[1] } },
      { label: 'Buy X', action: { type: 'askBuyX' } },
    ],
    [
      { label: 'Limit buy', action: { type: 'limitMenu' } },
      { label: 'Positions', action: { type: 'positions' } },
    ],
  ]
}

function positionKeyboard(): Button[][] {
  return [
    [
      { label: 'Sell 50%', action: { type: 'sell', fraction: 0.5 } },
      { label: 'Sell 100%', action: { type: 'sell', fraction: 1 } },
    ],
    [{ label: 'Take-profit / Stop-loss', action: { type: 'tpslMenu' } }],
  ]
}

function tokenCard(s: Draft) {
  const { token, chain } = s
  if (!token || !chain) return
  say(s, {
    from: 'bot',
    title: `$${token.symbol} · ${chain.name}`,
    lines: [
      `CA: ${short(token.address)}`,
      `Price: ${fmtNum(token.price)} ${chain.native}`,
      `Your balance: ${fmtNum(s.balance)} ${chain.native}`,
    ],
    keyboard: tokenKeyboard(chain),
  })
}

function needChain(s: Draft): boolean {
  if (!s.started) {
    say(s, { from: 'bot', text: 'Tap Start first.', keyboard: [[{ label: 'Start', action: { type: 'start' } }]] })
    return true
  }
  if (!s.chain) {
    chainMenu(s)
    return true
  }
  return false
}

function chainMenu(s: Draft) {
  const rows: Button[][] = []
  for (let i = 0; i < CHAINS.length; i += 4) {
    rows.push(CHAINS.slice(i, i + 4).map((c) => ({ label: c.name, action: { type: 'chooseChain', id: c.id } })))
  }
  say(s, { from: 'bot', text: 'Pick a chain to trade on:', keyboard: rows })
}

function loadToken(s: Draft, address: string) {
  if (!s.chain) return
  s.token = newToken(s.chain, address)
  s.history = [s.token.price]
  s.position = null
  s.orders = []
  s.done.paste = true
  tokenCard(s)
}

function doBuy(s: Draft, amount: number, note?: string) {
  const { chain, token } = s
  if (!chain || !token) return false
  if (amount <= 0 || amount > s.balance + 1e-12) {
    say(s, { from: 'bot', tone: 'warn', text: `Not enough ${chain.native}. Balance: ${fmtNum(s.balance)} ${chain.native}.` })
    return false
  }
  const qty = amount / token.price
  s.balance -= amount
  s.position = s.position
    ? { qty: s.position.qty + qty, cost: s.position.cost + amount }
    : { qty, cost: amount }
  s.done.buy = true
  say(s, {
    from: 'bot',
    tone: 'success',
    title: note ?? 'Buy confirmed',
    lines: [
      `Bought ${fmtQty(qty)} $${token.symbol}`,
      `Spent ${fmtNum(amount)} ${chain.native} at ${fmtNum(token.price)}`,
    ],
    keyboard: positionKeyboard(),
  })
  return true
}

function doSell(s: Draft, fraction: number, note?: string) {
  const { chain, token, position } = s
  if (!chain || !token) return
  if (!position) {
    say(s, { from: 'bot', text: `You don't hold any $${token.symbol} yet.`, keyboard: tokenKeyboard(chain) })
    return
  }
  const qty = position.qty * fraction
  const proceeds = qty * token.price
  const costPart = position.cost * fraction
  const pnl = ((proceeds - costPart) / costPart) * 100
  s.balance += proceeds
  s.position = fraction >= 0.999 ? null : { qty: position.qty - qty, cost: position.cost - costPart }
  if (!s.position) s.orders = s.orders.filter((o) => o.kind === 'limit')
  s.done.sell = true
  say(s, {
    from: 'bot',
    tone: pnl >= 0 ? 'success' : 'warn',
    title: note ?? 'Sell confirmed',
    lines: [
      `Sold ${fmtQty(qty)} $${token.symbol} for ${fmtNum(proceeds)} ${chain.native}`,
      `PnL on this sale: ${fmtPct(pnl)}`,
    ],
    keyboard: s.position ? positionKeyboard() : mainMenu(),
  })
}

function positionsMsg(s: Draft) {
  const { chain, token, position } = s
  if (!chain || !token || !position) {
    say(s, { from: 'bot', text: 'No open positions. Paste a contract to buy something.', keyboard: mainMenu() })
    return
  }
  const value = position.qty * token.price
  const pnl = ((value - position.cost) / position.cost) * 100
  say(s, {
    from: 'bot',
    title: `Position · $${token.symbol}`,
    lines: [
      `Holding ${fmtQty(position.qty)} $${token.symbol}`,
      `Value ${fmtNum(value)} ${chain.native} (${fmtPct(pnl)})`,
      `Entry ${fmtNum(position.cost / position.qty)} · Now ${fmtNum(token.price)}`,
    ],
    keyboard: positionKeyboard(),
  })
}

function checkOrders(s: Draft) {
  const { token, chain } = s
  if (!token || !chain) return
  const p = token.price
  for (const o of [...s.orders]) {
    const hit = o.kind === 'tp' ? p >= o.trigger : p <= o.trigger
    if (!hit) continue
    s.orders = s.orders.filter((x) => x.id !== o.id)
    if (o.kind === 'limit') doBuy(s, Math.min(o.size, s.balance), 'Limit order filled')
    else if (s.position) doSell(s, 1, o.kind === 'tp' ? 'Take-profit hit' : 'Stop-loss hit')
  }
}

export function reducer(prev: State, action: Action): State {
  if (action.type === 'reset') return { ...initialState, seq: prev.seq + 1, messages: initialState.messages.map((m) => ({ ...m, id: prev.seq })) }

  const s: Draft = { ...prev, done: { ...prev.done } }

  switch (action.type) {
    case 'user': {
      const text = action.text.trim()
      if (!text) return prev
      say(s, { from: 'me', text })
      if (s.awaiting === 'buyAmount') {
        s.awaiting = null
        const n = Number(text.replace(',', '.'))
        if (Number.isFinite(n) && n > 0) doBuy(s, n)
        else say(s, { from: 'bot', tone: 'warn', text: 'That is not a number. Tap Buy X to try again.' })
        return s
      }
      const cmd = text.toLowerCase()
      if (cmd === '/start') return reducer({ ...s, messages: s.messages }, { type: 'start' })
      if (cmd === '/wallet') return reducer(s, { type: 'wallet' })
      if (cmd === '/positions') return reducer(s, { type: 'positions' })
      if (cmd === '/help') return reducer(s, { type: 'help' })
      if (isAddress(text)) {
        if (needChain(s)) return s
        loadToken(s, text)
        return s
      }
      say(s, {
        from: 'bot',
        text: 'Try /start, /wallet, /positions, /help, or paste a token contract address.',
      })
      return s
    }

    case 'start':
      if (!s.messages.some((m) => m.from === 'me' && m.text === '/start')) say(s, { from: 'me', text: '/start' })
      s.started = true
      s.done.start = true
      say(s, { from: 'bot', title: 'Welcome to Marty.', text: 'Your demo trading wallet is ready.' })
      chainMenu(s)
      return s

    case 'chooseChainMenu':
      if (needChain(s)) return s
      chainMenu(s)
      return s

    case 'chooseChain': {
      const chain = CHAINS.find((c) => c.id === action.id)
      if (!chain) return prev
      if (!s.started) {
        s.started = true
        s.done.start = true
      }
      s.chain = chain
      s.balance = chain.startBalance
      s.token = null
      s.position = null
      s.orders = []
      s.history = []
      s.done.chain = true
      say(s, {
        from: 'bot',
        tone: 'success',
        title: `${chain.name} wallet funded`,
        lines: [
          `Demo balance: ${fmtNum(chain.startBalance)} ${chain.native}`,
          'Now paste a token contract address, or tap below for a demo one.',
        ],
        keyboard: mainMenu(),
      })
      return s
    }

    case 'pasteDemo':
      if (needChain(s)) return s
      {
        const addr = demoAddress(s.chain!)
        say(s, { from: 'me', text: addr })
        loadToken(s, addr)
      }
      return s

    case 'buy':
      if (needChain(s)) return s
      if (!s.token) return reducer(s, { type: 'pasteDemo' })
      doBuy(s, action.amount)
      return s

    case 'askBuyX':
      if (needChain(s) || !s.token) return s
      s.awaiting = 'buyAmount'
      say(s, { from: 'bot', text: `How much ${s.chain!.native} do you want to spend? Type an amount below.` })
      return s

    case 'sell':
      doSell(s, action.fraction)
      return s

    case 'limitMenu':
      if (needChain(s) || !s.token) return s
      say(s, {
        from: 'bot',
        text: `Limit buy $${s.token.symbol} with ${s.chain!.presets[0]} ${s.chain!.native} when the price drops by:`,
        keyboard: [[-5, -10, -20].map((pct) => ({ label: `${pct}%`, action: { type: 'setOrder', kind: 'limit', pct } }))],
      })
      return s

    case 'tpslMenu':
      if (!s.position || !s.token) {
        say(s, { from: 'bot', text: 'Buy something first, then set take-profit or stop-loss.' })
        return s
      }
      say(s, {
        from: 'bot',
        text: 'Set an exit from your entry price:',
        keyboard: [
          [
            { label: 'TP +25%', action: { type: 'setOrder', kind: 'tp', pct: 25 } },
            { label: 'TP +50%', action: { type: 'setOrder', kind: 'tp', pct: 50 } },
          ],
          [
            { label: 'SL −10%', action: { type: 'setOrder', kind: 'sl', pct: -10 } },
            { label: 'SL −20%', action: { type: 'setOrder', kind: 'sl', pct: -20 } },
          ],
        ],
      })
      return s

    case 'setOrder': {
      const { token, chain, position } = s
      if (!token || !chain) return prev
      const base = action.kind === 'limit' ? token.price : position ? position.cost / position.qty : token.price
      if (action.kind !== 'limit' && !position) return prev
      const trigger = base * (1 + action.pct / 100)
      // one TP and one SL at a time
      if (action.kind !== 'limit') s.orders = s.orders.filter((o) => o.kind !== action.kind)
      s.orders = [...s.orders, { id: s.seq++, kind: action.kind, trigger, size: action.kind === 'limit' ? chain.presets[0] : 1 }]
      s.done[action.kind === 'limit' ? 'limit' : 'tpsl'] = true
      const label = action.kind === 'limit' ? 'Limit buy' : action.kind === 'tp' ? 'Take-profit' : 'Stop-loss'
      say(s, {
        from: 'bot',
        tone: 'success',
        title: `${label} set`,
        lines: [
          `Trigger: ${fmtNum(trigger)} ${chain.native} (${fmtPct(action.pct)})`,
          'Marty watches the price for you. Use Pump or Dump under the chart to see it trigger.',
        ],
      })
      return s
    }

    case 'cancelOrder':
      s.orders = s.orders.filter((o) => o.id !== action.id)
      say(s, { from: 'bot', text: 'Order cancelled.' })
      return s

    case 'wallet':
      if (needChain(s)) return s
      say(s, {
        from: 'bot',
        title: `Wallet · ${s.chain!.name}`,
        lines: [
          `Balance: ${fmtNum(s.balance)} ${s.chain!.native}`,
          `Open orders: ${s.orders.length}`,
          s.copy ? `Copying: ${s.copy.label} ${s.copy.address}` : 'Copy trading: off',
        ],
        keyboard: mainMenu(),
      })
      return s

    case 'positions':
      positionsMsg(s)
      return s

    case 'help':
      say(s, {
        from: 'bot',
        title: 'What you can do',
        lines: [
          '/start: set up your wallet',
          'Paste a contract: get buy buttons',
          'Limit buy, take-profit, stop-loss',
          'Copy trading: mirror a wallet',
          '/wallet and /positions',
        ],
        keyboard: mainMenu(),
      })
      return s

    case 'copyMenu':
      if (needChain(s)) return s
      say(s, {
        from: 'bot',
        text: s.copy ? `You're copying ${s.copy.label}.` : 'Pick a demo wallet to mirror:',
        keyboard: s.copy
          ? [[{ label: 'Stop copying', action: { type: 'copyStop' } }]]
          : [COPY_WALLETS.map((w, i) => ({ label: `${w.label} ${w.address}`, action: { type: 'copyStart', index: i } }))],
      })
      return s

    case 'copyStart': {
      if (needChain(s)) return s
      s.copy = COPY_WALLETS[action.index]
      s.done.copy = true
      say(s, {
        from: 'bot',
        tone: 'success',
        title: `Copying ${s.copy.label}`,
        lines: [`Their buys and sells will be mirrored at ${s.chain!.presets[0]} ${s.chain!.native} a trade.`],
        keyboard: [[{ label: 'Stop copying', action: { type: 'copyStop' } }]],
      })
      if (!s.token) {
        const addr = demoAddress(s.chain!)
        s.token = newToken(s.chain!, addr)
        s.history = [s.token.price]
        say(s, { from: 'bot', text: `${s.copy.label} is trading $${s.token.symbol} right now.` })
      }
      return s
    }

    case 'copyStop':
      if (!s.copy) return prev
      say(s, { from: 'bot', text: `Stopped copying ${s.copy.label}.`, keyboard: mainMenu() })
      s.copy = null
      return s

    case 'copyTrade': {
      if (!s.copy || !s.chain || !s.token) return prev
      const sell = s.position && Math.random() < 0.4
      if (sell) doSell(s, 0.5, `Copied ${s.copy.label}: sell`)
      else if (s.balance >= s.chain.presets[0]) doBuy(s, s.chain.presets[0], `Copied ${s.copy.label}: buy`)
      return s
    }

    case 'tick':
    case 'nudge': {
      if (!s.token) return prev
      const shock =
        action.type === 'nudge'
          ? action.pct / 100
          : (Math.random() - 0.48) * 0.035 // small random walk, slight upward drift
      const price = Math.max(s.token.price * (1 + shock), 1e-15)
      s.token = { ...s.token, price }
      s.history = [...s.history, price].slice(-90)
      checkOrders(s)
      if (action.type === 'nudge' && s.messages.length === prev.messages.length && s.chain) {
        // Tell the user what happened if no order fired
        say(s, {
          from: 'bot',
          text: `Market ${action.pct > 0 ? 'pumped' : 'dumped'} ${Math.abs(action.pct)}%. $${s.token.symbol} is now ${fmtNum(price)} ${s.chain.native}.`,
        })
      }
      return s
    }
  }
  return prev
}
