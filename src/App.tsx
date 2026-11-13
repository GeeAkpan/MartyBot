import { Analytics } from '@vercel/analytics/react'
import { ChainMarquee } from './components/ChainMarquee'
import { Compare } from './components/Compare'
import { Faq } from './components/Faq'
import { Features } from './components/Features'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Mars } from './components/Mars'
import { Partners } from './components/Partners'
import { Playground } from './components/playground/Playground'
import { StickyCta } from './components/StickyCta'
import { Steps } from './components/Steps'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <ChainMarquee />
        <Compare />
        <Steps />
        <Playground />
        <Features />
        <Partners />
        <Mars />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
      <Analytics />
    </>
  )
}
