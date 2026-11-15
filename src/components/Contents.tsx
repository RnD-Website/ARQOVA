import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { STORIES, photo } from '../data/content'
import { useMedia } from '../hooks/useViewport'

/**
 * Interactive contents page. Desktop: hovering a row tints the page, dims the others and
 * reveals the story's photograph, which trails the cursor on a spring. Touch: the row
 * crossing the centre of the screen becomes active and shows its image inline.
 */
export function Contents() {
  const [active, setActive] = useState<number | null>(null)
  const hover = useMedia('(hover: hover) and (pointer: fine)')
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 180, damping: 22, mass: 0.6 })
  const rows = useRef<(HTMLLIElement | null)[]>([])

  // touch devices: activate the row nearest the viewport centre
  useEffect(() => {
    if (hover) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    rows.current.forEach((r) => r && io.observe(r))
    return () => io.disconnect()
  }, [hover])

  const tint = active === null ? '#F2EFE9' : mix(STORIES[active].tint)

  return (
    <motion.section
      id="contents"
      className="contents"
      animate={{ backgroundColor: tint }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        mx.set(e.clientX)
        my.set(e.clientY)
      }}
      onMouseLeave={() => hover && setActive(null)}
    >
      <header className="contents-head">
        <h2 className="contents-title">Contents</h2>
        <div className="contents-meta">
          <b>Nº01</b>
          <span>Autumn / Winter 2026</span>
          <span>Six magazines · One agency</span>
        </div>
      </header>

      <ol className={`contents-list ${active !== null ? 'has-active' : ''}`}>
        {STORIES.map((s, i) => (
          <li
            key={s.n}
            ref={(el) => (rows.current[i] = el)}
            data-i={i}
            className={`contents-row ${active === i ? 'is-active' : ''}`}
            onMouseEnter={() => hover && setActive(i)}
          >
            <a href={`#story-${s.n}`} className="contents-link">
              <span className="c-num">{s.n}</span>
              <span className="c-title">
                <span className="c-title-inner">{s.title}</span>
              </span>
              <span className="c-deck">{s.deck}</span>
              <span className="c-page">P.{s.page}</span>
            </a>
            {!hover && (
              <AnimatePresence initial={false}>
                {active === i && (
                  <motion.div
                    className="c-inline"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <img className="photo" src={photo(s.image, 900, 600)} alt="" loading="lazy" />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </li>
        ))}
      </ol>

      <footer className="contents-foot">
        <a href="#sequence">P.86 · On the press</a>
        <a href="#studio">P.90 · The agency</a>
        <a href="#contact">P.98 · Start a title</a>
      </footer>

      {hover && (
        <motion.div className="c-float" style={{ x: sx, y: sy }} aria-hidden>
          <AnimatePresence mode="popLayout">
            {active !== null && (
              <motion.div
                key={active}
                className="c-float-card"
                initial={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0 0 0)', rotate: -4, scale: 1.08 }}
                animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0 0 0)', rotate: i2rot(active), scale: 1 }}
                exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)', scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <img className="photo" src={photo(STORIES[active].image, 700, 900)} alt="" />
                <span>{STORIES[active].category}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.section>
  )
}

const i2rot = (i: number) => (i % 2 ? 2.5 : -2.5)

/** Soft paper tint: mixes the story colour into the cream background. */
function mix(hex: string, amt = 0.14) {
  const base = [0xf2, 0xef, 0xe9]
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const m = base.map((b, i) => Math.round(b + (c[i] - b) * amt))
  return `rgb(${m.join(',')})`
}
