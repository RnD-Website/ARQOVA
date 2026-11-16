import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { STORIES, Story } from '../data/content'
import { Photo } from './Photo'

/** Time (in vh) each spread holds on its own before the next one slides over it. */
const HOLD = 70

/**
 * Six full-screen spreads, stacked like pages. Each spread is pinned (sticky) and the next
 * one slides up over it; the covered spread recedes and darkens while its photograph,
 * title and polaroid keep moving on their own scroll-linked tracks.
 */
export function Stories() {
  return (
    <section id="stories" className="stories" aria-label="Featured magazines">
      {STORIES.map((s, i) => (
        <StorySpread key={s.n} story={s} index={i} last={i === STORIES.length - 1} />
      ))}
    </section>
  )
}

function StorySpread({ story: s, index, last }: { story: Story; index: number; last: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const height = last ? HOLD + 100 : HOLD + 200
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const { scrollYProgress: stay } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const coverStart = last ? 1 : HOLD / (HOLD + 100)

  const dir = s.imageSide === 'left' ? 1 : -1
  const imgScale = useTransform([enter, stay], ([e, st]: number[]) => (e < 1 ? 1.28 - e * 0.18 : 1.1 - st * 0.1))
  const imgY = useTransform(stay, [0, 1], ['0%', '-6%'])
  const titleX = useTransform([enter, stay], ([e, st]: number[]) => `${(e < 1 ? (1 - e) * 14 : -st * 6) * dir}vw`)
  const textY = useTransform(enter, [0.4, 1], [90, 0])
  const polaroidY = useTransform(stay, [0, 1], [50, -90])
  const polaroidR = useTransform(stay, [0, 1], [dir * 4, dir * -3])
  const recede = useTransform(stay, [coverStart, 1], [1, 0.9])
  const dim = useTransform(stay, [coverStart, 1], [0, 0.55])
  const recY = useTransform(stay, [coverStart, 1], ['0vh', '-4vh'])

  const next = STORIES[index + 1]
  const prev = STORIES[index - 1]
  const st = (v: unknown) => (reduce ? undefined : v)

  return (
    <div
      ref={ref}
      id={`story-${s.n}`}
      className="spread-wrap"
      style={{ height: `${height}vh`, marginTop: index ? '-100vh' : 0, zIndex: index + 1 }}
    >
      <motion.article
        className={`spread side-${s.imageSide}`}
        style={{ scale: st(recede) as never, y: st(recY) as never, ['--tint' as string]: s.tint, ['--panel-ink' as string]: s.ink }}
        aria-labelledby={`t-${s.n}`}
      >
        <div className="spread-img">
          <motion.div className="spread-img-inner" style={{ scale: st(imgScale) as never, y: st(imgY) as never }}>
            <Photo id={s.image} alt={`${s.title} — ${s.category}`} sizes="(max-width: 767px) 130vw, 66vw" position={s.pos ?? '50% 25%'} className="fill" />
          </motion.div>
          <span className="spread-folio">ARQOVA · P.{s.page}</span>
        </div>

        <div className="spread-panel">
          <div className="spread-meta">
            <span>P.{s.page}</span>
            <span>{s.category}</span>
            <span>{s.client}</span>
          </div>
          <motion.div className="spread-body" style={{ y: st(textY) as never }}>
            <p className="spread-intro">{s.intro}</p>
            <dl className="spread-credits">
              {s.credits.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <blockquote className="spread-quote">“{s.quote}”</blockquote>
          </motion.div>
          <nav className="spread-nav" aria-label="Story navigation">
            {prev ? <a href={`#story-${prev.n}`}>← {prev.title}</a> : <a href="#contents">← Contents</a>}
            <span>{s.n} / 06</span>
            {next ? <a href={`#story-${next.n}`}>{next.title} →</a> : <a href="#sequence">Continue →</a>}
          </nav>
          <motion.figure className="polaroid" style={{ y: st(polaroidY) as never, rotate: st(polaroidR) as never }}>
            <Photo id={s.thumb} alt="" sizes="320px" className="fill" />
            <figcaption>Cover {s.n} · Proof {index + 3}</figcaption>
          </motion.figure>
        </div>

        {/* Title printed twice, each copy clipped to one half: light over the photo, ink over the panel */}
        <div className="t-layer t-layer-img">
          <motion.h2 id={`t-${s.n}`} className="spread-title" style={{ x: st(titleX) as never }}><span className="t-text">{s.title}</span></motion.h2>
        </div>
        <div className="t-layer t-layer-panel" aria-hidden>
          <motion.p className="spread-title" style={{ x: st(titleX) as never }}><span className="t-text">{s.title}</span></motion.p>
        </div>
        <span className="spread-num" aria-hidden>{s.n}</span>

        <motion.div className="spread-dim" style={{ opacity: st(dim) as never }} aria-hidden />
      </motion.article>
    </div>
  )
}
