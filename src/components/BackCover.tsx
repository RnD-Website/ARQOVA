import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Barcode } from './Barcode'

const TYPES = ['New magazine', 'Redesign', 'Brand magazine', 'Single issue', 'Something else']

/** Closing spread styled as the magazine's back cover, with a tear-out commission card. */
export function BackCover() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const cardY = useTransform(scrollYProgress, [0.25, 0.7], ['30%', '0%'])
  const cardR = useTransform(scrollYProgress, [0.25, 0.7], [4, -1.2])
  const markY = useTransform(scrollYProgress, [0.7, 1], ['40%', '0%'])
  const markS = useTransform(scrollYProgress, [0.7, 1], ['-0.02em', '-0.045em'])
  const [sent, setSent] = useState(false)
  const [type, setType] = useState(TYPES[0])

  return (
    <section ref={ref} id="contact" className="backcover">
      <div className="back-copy">
        <p className="eyebrow light">Start a title · P.98</p>
        <h2 className="back-title">Let’s Make a Magazine <i>Worth Keeping.</i></h2>
        <p className="back-lede">
          Send the card with a few lines about your brand, your readers and when you’d like to go to print. Every card
          is answered within two working days, and most launch issues reach print in ten to twelve weeks.
        </p>
        <dl className="back-stats">
          <div><dt>48 h</dt><dd>Reply time</dd></div>
          <div><dt>2</dt><dd>Newsrooms · Lisbon &amp; Paris</dd></div>
          <div><dt>12 wk</dt><dd>Pitch to print</dd></div>
        </dl>
      </div>

      <motion.div className="card-slot" style={{ y: cardY, rotate: cardR }}>
        <div className={`card ${sent ? 'is-sent' : ''}`}>
          <form
            className="card-face card-front"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
            aria-hidden={sent}
          >
            <div className="card-head">
              <h3>Pitch card</h3>
              <div className="stamp">Postage paid<br />Lisboa</div>
            </div>
            <div className="fields">
              <label><span>Name</span><input name="name" required placeholder="Your name" autoComplete="name" /></label>
              <label><span>Email</span><input name="email" type="email" required placeholder="you@brand.com" autoComplete="email" /></label>
              <fieldset className="types">
                <legend>What do you need?</legend>
                <div>
                  {TYPES.map((t) => (
                    <button type="button" key={t} className={t === type ? 'on' : ''} aria-pressed={t === type} onClick={() => setType(t)}>
                      {t}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="type" value={type} />
              </fieldset>
              <label className="wide"><span>Message</span><textarea name="message" rows={3} required placeholder="Brand, audience, frequency, print date, a few lines about the idea" /></label>
            </div>
            <button className="submit" type="submit">Post the card <span aria-hidden>→</span></button>
          </form>
          <div className="card-face card-back" aria-hidden={!sent} aria-live="polite">
            <AnimatePresence>
              {sent && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
                  <p className="eyebrow">Received</p>
                  <h3>Thank you — your card is in the post.</h3>
                  <p>We’ll reply within two working days from editors@arqova.studio.</p>
                  <button type="button" className="link" onClick={() => setSent(false)}>Write another card</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <footer className="back-foot">
        <div className="back-row">
          <a href="mailto:editors@arqova.studio">editors@arqova.studio</a>
          <a href="https://instagram.com/arqova.studio" target="_blank" rel="noreferrer">Instagram — @arqova.studio</a>
          <span>Lisbon · Paris</span>
          <span>© 2026 ARQOVA. All rights reserved.</span>
        </div>
        <div className="back-mark-wrap">
          <motion.p className="back-mark" style={{ y: markY, letterSpacing: markS }} aria-hidden>ARQOVA</motion.p>
        </div>
        <div className="back-colophon">
          <a href="https://seative.digital" target="_blank" rel="noreferrer" className="credit">Design by seative.digital</a>
          <span>Issue Nº01 · The Agency Issue · Autumn / Winter 2026</span>
          <Barcode className="light" />
        </div>
      </footer>
    </section>
  )
}
