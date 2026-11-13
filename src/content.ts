// ---------------------------------------------------------------
// All site copy and links live here. Edit this file to update the
// website; no component changes needed.
//
// Anything in [BRACKETS] is a placeholder. Placeholder text is
// automatically HIDDEN on the live site until you replace it,
// so the page never shows unfinished content.
// ---------------------------------------------------------------

/** True for text or links that still need real info. */
export const isPlaceholder = (v?: string) => !v || v === '#' || /\[[^\]]+\]/.test(v)
export const filled = <T extends Record<string, unknown>>(items: T[], ...keys: (keyof T)[]) =>
  items.filter((it) => keys.every((k) => !isPlaceholder(String(it[k] ?? ''))))

export const links = {
  bot: 'https://t.me/martytraderbot',
  x: 'https://x.com/matarabot', // confirm handle (@matarabot vs @martytraderbot)
  docs: '#', // [DOCS LINK]
  community: '#', // [COMMUNITY LINK]
  partnerContact: 'https://x.com/matarabot', // where projects reach you; swap for a Telegram/email link if preferred
}

export const nav = [
  { label: 'How it works', href: '#how' },
  { label: 'Try the demo', href: '#try' },
  { label: 'Features', href: '#features' },
  { label: 'Partners', href: '#partners' },
  { label: 'FAQ', href: '#faq' },
]

export const hero = {
  eyebrow: 'The fastest Telegram trading bot',
  titleA: 'Paste. Tap.',
  titleB: 'You’re in.',
  lede: 'Buy any token in two taps without leaving Telegram. 8 chains, limit orders, take-profit, stop-loss and copy trading. No extension. No DEX tabs. No sign-up.',
  primaryCta: 'Start trading on Telegram',
  secondaryCta: 'Try the demo',
  micro: 'Opens @martytraderbot · Your wallet is created on /start',
  meta: ['Live on mainnet', '8 chains', 'Powered by $MARS'],
}

export const chains: { name: string; placeholder?: boolean }[] = [
  { name: 'BSC' },
  { name: 'Ethereum' },
  { name: 'Base' },
  { name: 'Arbitrum' },
  { name: 'Solana' },
  { name: 'Arc' },
  { name: 'Robinhood' },
  { name: 'MegaETH' },
]

export const compare = {
  eyebrow: 'Why Marty',
  title: 'Stop juggling tabs.',
  accent: 'Same trade, two taps.',
  oldTitle: 'The old way',
  old: [
    'Install a wallet extension',
    'Switch networks and top up gas',
    'Find the right DEX for the chain',
    'Paste the contract, approve, set slippage',
    'Watch the chart all night to time your exit',
  ],
  newTitle: 'With Marty',
  new: [
    'Tap Start. Your wallet is ready',
    'Paste the contract',
    'Tap buy. Set TP/SL and go to sleep',
  ],
}

export const steps = [
  {
    n: '01',
    title: 'Tap Start',
    body: 'Open @martytraderbot and tap Start. Marty sets up your trading wallet automatically.',
    tag: 'No sign-up form',
  },
  {
    n: '02',
    title: 'Fund your wallet',
    body: "Send a small amount of the chain's gas token to your Marty wallet. Start small while you learn.",
    tag: 'Gas token per chain',
    gas: [
      { token: 'BNB', where: 'BSC' },
      { token: 'ETH', where: 'Ethereum, Base, Arbitrum, Robinhood, MegaETH' },
      { token: 'SOL', where: 'Solana' },
      { token: 'USDC', where: 'Arc' },
    ],
  },
  {
    n: '03',
    title: 'Paste a contract',
    body: "Drop any token's contract address into the chat. Marty pulls up the token with buy buttons. Pick an amount and tap.",
    tag: 'Done',
  },
]

export type FeatureIcon = 'limit' | 'shield' | 'copy' | 'chains'

export const features: { icon: FeatureIcon; title: string; body: string; kicker: string; wide?: boolean }[] = [
  {
    icon: 'limit',
    title: 'Limit orders',
    kicker: 'Buy the dip while you sleep',
    body: 'Set your entry price and close the app. Marty fills the order the moment the market gets there.',
    wide: true,
  },
  {
    icon: 'shield',
    title: 'Take-profit & stop-loss',
    kicker: 'Exit on your terms',
    body: 'Lock in gains or cap losses automatically, even when you are offline.',
  },
  {
    icon: 'copy',
    title: 'Copy trading',
    kicker: 'Mirror wallets you trust',
    body: 'Follow a wallet and its buys become your buys, sized your way. Stop anytime.',
  },
  {
    icon: 'chains',
    title: 'One wallet, 8 chains',
    kicker: 'One chat',
    body: 'BSC, Ethereum, Base, Arbitrum, Solana, Arc, Robinhood Chain and MegaETH, all from the same Telegram conversation.',
    wide: true,
  },
]

export const partners = [
  { ticker: '$LIGHT', name: 'Luminous', chain: 'BSC', link: 'https://t.me/martytraderbot?start=s_ECE55D7B' },
  { ticker: '$ZIPCAT', name: 'ZipCat', chain: 'BSC', link: 'https://t.me/martytraderbot?start=s_37485250' },
]

export const partnerPitch = {
  title: 'Launching a token?',
  body: 'Give your community a two-tap buy link and a co-branded banner. Your holders trade without leaving Telegram.',
  cta: 'Become a partner',
}

export const mars = {
  body: '[What $MARS does for Marty Bot: utility, holder benefits, fee share, etc.]',
  fallback: 'Marty Bot is built and powered by the $MARS ecosystem.',
  facts: [
    { label: 'Chain', value: '[CHAIN]' },
    { label: 'Contract', value: '[CONTRACT ADDRESS]' },
    { label: 'Buy on', value: '[WHERE TO BUY]' },
  ],
}

export const safety = [
  'The only official bot is @martytraderbot',
  'Marty never DMs you first',
  'No admin will ever ask for your private key or seed phrase',
]

export const faqs = [
  {
    q: 'Do I need a wallet extension?',
    a: 'No. Tapping Start creates a trading wallet for you inside Telegram. You just fund it with the gas token of the chain you want to trade.',
  },
  {
    q: 'Which chains does Marty support?',
    a: 'Eight: BSC, Ethereum, Base, Arbitrum, Solana, Arc, Robinhood Chain and MegaETH. Fund each with its gas token: BNB on BSC, SOL on Solana, USDC on Arc and ETH on the rest.',
  },
  {
    q: 'How fast is a trade?',
    a: 'Paste a contract and Marty shows buy buttons straight away. One tap to pick an amount, one tap to confirm. That’s it.',
  },
  {
    q: 'What are the fees?',
    a: '[FEE PER TRADE]. Network gas is paid in each chain’s gas token.',
  },
  {
    q: 'Can I export my wallet?',
    a: '[Explain how to export or back up the private key.]',
  },
  {
    q: 'Can I try it before funding?',
    a: 'Yes. Use the demo on this page with pretend funds. When you’re ready, open @martytraderbot and start with a small amount.',
  },
  {
    q: 'How do I know I’m using the real bot?',
    a: 'The only official bot is @martytraderbot. Marty will never DM you first, and no admin will ever ask for your private key or seed phrase.',
  },
]
