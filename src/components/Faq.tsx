import { useId, useState } from 'react'
import { faqs as allFaqs, filled } from '@/content'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'
import s from './Faq.module.scss'

const faqs = filled(allFaqs, 'a')

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()

  return (
    <section id="faq" className={s.section} aria-labelledby="faq-title">
      <div className={s.inner}>
        <SectionHeading id="faq-title" eyebrow="Questions" align="center">
          FAQ
        </SectionHeading>

        <div className={s.list}>
          {faqs.map((item, i) => {
            const isOpen = open === i
            const btnId = `${base}-q${i}`
            const panelId = `${base}-a${i}`
            return (
              <div key={item.q} className={`${s.item} ${isOpen ? s.open : ''}`}>
                <h3 className={s.q}>
                  <button
                    id={btnId}
                    type="button"
                    className={s.trigger}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <Icon name="plus" size={20} className={s.chev} />
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={btnId} className={s.panel}>
                  <div className={s.panelInner}>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
