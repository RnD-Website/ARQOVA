import { motion, useScroll, useTransform, useSpring, useReducedMotion, MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { IMG } from '../data/content'
import { Photo } from './Photo'

const QUOTE = 'A website is visited. A magazine is kept on the table for months.'

/** Floating frames: position (vw/vh), width (vw), and scroll travel in vh — different speeds = depth. */
const FRAMES = [
  { id: IMG.seq[1], left: 7, top: 52, w: 16, from: 20, to: -130, r: -3 },
  { id: IMG.seq[2], left: 71, top: 46, w: 20, from: 30, to: -170, r: 2 },
  { id: IMG.seq[3], left: 27, top: 84, w: 12, from: 10, to: -210, r: 1.5 },
  { id: IMG.seq[4], left: 57, top: 92, w: 14, from: 0, to: -160, r: -2 },
  { id: IMG.seq[5], left: 85, top: 104, w: 11, from: 20, to: -230, r: 3 },
  { id: IMG.seq[6], left: 3, top: 116, w: 13, from: 0, to: -200, r: -1.5 },
]

/**
 * Pinned cinematic sequence. Frames drift past at different speeds while one photograph
 * stays pinned at the centre, then opens edge-to-edge like a page spread; the quote is
 * set word by word over it.
 */
export function Sequence() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 38, mass: 0.4, restDelta: 0.0002 })

  const clip = useTransform(p, [0.3, 0.66], [0, 1])
  const clipPath = useTransform(clip, (c) => {
    const v = (1 - c) * 31
    const hz = (1 - c) * 36
    return `inset(${v}% ${hz}% ${v}% ${hz}% round ${(1 - c) * 6}px)`
  })
  const heroScale = useTransform(p, [0, 0.66, 1], [1.35, 1.05, 1])
  const heroY = useTransform(p, [0, 0.3], ['8vh', '0vh'])
  const shade = useTransform(p, [0.58, 0.72], [0, 0.48])
  const framesO = useTransform(p, [0.52, 0.66], [1, 0])
  const headO = useTransform(p, [0, 0.08, 0.3, 0.4], [0, 1, 1, 0])
  const headY = useTransform(p, [0, 0.4], [40, -60])

  if (reduce) {
    return (
      <section id="sequence" className="sequence-static">
        <Photo id={IMG.seq[0]} alt="Editorial photograph" className="fill" />
        <blockquote className="seq-quote static">{QUOTE}</blockquote>
      </section>
    )
  }

  return (
    <section ref={ref} id="sequence" className="sequence" aria-label="Magazine spreads sequence">
      <div className="seq-stage">
        <motion.div className="seq-head" style={{ opacity: headO, y: headY }}>
          <p className="eyebrow">P.86 · On the press</p>
          <h2>Pages, <i>in&nbsp;motion</i></h2>
          <p className="seq-sub">Spreads, proofs and cover outtakes from the six titles — the pages that made it, and a few that nearly did.</p>
        </motion.div>

        <motion.div className="seq-hero" style={{ clipPath, y: heroY }}>
          <motion.div className="seq-hero-inner" style={{ scale: heroScale }}>
            <Photo id={IMG.seq[0]} alt="A model in a long coat in a stone courtyard" sizes="140vw" position="50% 30%" className="fill" />
          </motion.div>
          <motion.div className="seq-shade" style={{ opacity: shade }} />
        </motion.div>

        <motion.div className="seq-frames" style={{ opacity: framesO }}>
          {FRAMES.map((f, i) => (
            <Frame key={i} f={f} p={p} />
          ))}
        </motion.div>

        <blockquote className="seq-quote" aria-label={QUOTE}>
          <Words text={QUOTE} p={p} start={0.64} end={0.9} />
          <WordsCite p={p} />
        </blockquote>
      </div>
    </section>
  )
}

function Frame({ f, p }: { f: (typeof FRAMES)[number]; p: MotionValue<number> }) {
  const y = useTransform(p, [0, 1], [`${f.from}vh`, `${f.to}vh`])
  const rotate = useTransform(p, [0, 1], [f.r, -f.r])
  return (
    <motion.figure
      className="seq-frame"
      style={{ left: `${f.left}vw`, top: `${f.top}vh`, width: `${f.w}vw`, y, rotate }}
    >
      <Photo id={f.id} alt="" sizes="(max-width: 767px) 50vw, 30vw" className="fill" />
    </motion.figure>
  )
}

function Words({ text, p, start, end }: { text: string; p: MotionValue<number>; start: number; end: number }) {
  const words = text.split(' ')
  const step = (end - start) / words.length
  return (
    <span className="seq-words" aria-hidden>
      {words.map((w, i) => (
        <span key={i}>
          <Word w={w} p={p} a={start + i * step} b={start + (i + 1.6) * step} />{' '}
        </span>
      ))}
    </span>
  )
}

function Word({ w, p, a, b }: { w: string; p: MotionValue<number>; a: number; b: number }) {
  const o = useTransform(p, [a, b], [0, 1])
  const y = useTransform(p, [a, b], ['0.5em', '0em'])
  const blur = useTransform(p, [a, b], ['blur(8px)', 'blur(0px)'])
  return (
    <span className="seq-word-mask">
      <motion.span style={{ opacity: o, y, filter: blur }}>{w}</motion.span>
    </span>
  )
}

function WordsCite({ p }: { p: MotionValue<number> }) {
  const o = useTransform(p, [0.88, 0.95], [0, 1])
  return <motion.cite style={{ opacity: o }}>— ARQOVA, Issue Nº01</motion.cite>
}
