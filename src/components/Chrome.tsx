import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

const LINKS = [
  { label: 'Contents', page: 'p.4', href: '#contents' },
  { label: 'Work', page: 'p.8', href: '#stories' },
  { label: 'Agency', page: 'p.90', href: '#studio' },
  { label: 'Contact', page: 'p.98', href: '#contact' },
]

/** Fixed masthead navigation — slides in once the reader starts opening the issue. */
export function Header() {
  const { scrollY } = useScroll()
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setShown(v > window.innerHeight * 0.35))
  return (
    <motion.header
      className="site-header"
      initial={false}
      animate={{ y: shown ? 0 : -90, opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#top" className="brand" aria-label="ARQOVA — back to cover">ARQOVA</a>
      <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Issue navigation">
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
            {l.label} <em>{l.page}</em>
          </a>
        ))}
        <a href="#contact" className="nav-cta-mobile" onClick={() => setOpen(false)}>Start a magazine →</a>
      </nav>
      <a href="#contact" className="cta">Start a magazine <span aria-hidden>→</span></a>
      <button className="menu-btn" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        <span /><span />
      </button>
    </motion.header>
  )
}

/** Running folio, bottom-left, like a printed page number: p. 001 → p. 100. */
export function Folio() {
  const { scrollYProgress } = useScroll()
  const page = useTransform(scrollYProgress, (v) => String(Math.max(1, Math.round(v * 100))).padStart(3, '0'))
  const [p, setP] = useState('001')
  useMotionValueEvent(page, 'change', setP)
  return (
    <div className="folio" aria-hidden>
      ARQOVA · Nº01 <em>p. {p}</em>
    </div>
  )
}
