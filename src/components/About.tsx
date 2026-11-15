import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'
import { IMG } from '../data/content'
import { Photo } from './Photo'

const PRINCIPLES = [
  ['Editorial first', 'Every magazine starts with what it has to say and who it is for. The design follows the voice, never the other way round.'],
  ['One team, cover to print', 'Strategy, editing, writing, art direction, photography and print production — under one roof, on one schedule.'],
  ['Made to be kept', 'Paper, binding and pacing chosen so readers hold on to every issue. A magazine that gets thrown away has failed.'],
]

const PROJECTS = [
  ['2026', 'Maison Vael', 'Quiet Matter', 'Brand magazine'],
  ['2026', 'Halden Quarterly', 'Beyond the Ordinary', 'Redesign'],
  ['2026', 'Muse Collective', 'Modern Muse', 'Launch issue'],
  ['2025', 'Atelier Sorn', 'The New Elegance', 'Custom publishing'],
  ['2025', 'Oblique Magazine', 'Form & Feeling', 'Art direction'],
  ['2024', 'Casa Lume', 'Linen Hours', 'Annual report'],
]

const COLLABORATORS = ['Céline Moreau — managing editor', 'Amara Osei — design', 'Yuki Tan — photography', 'Paolo Ferri — typography', 'Marc Duval — writing', 'Tomás Reis — photography', 'Studio Grão — print & paper', 'Ines Varela — sub-editing']

const HIGHLIGHTS = [
  ['64', 'Issues published'],
  ['19', 'Titles since 2019'],
  ['1.2 M', 'Copies printed'],
  ['48 h', 'Average reply time'],
]

function Line({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  return (
    <span ref={ref} className="line-mask">
      <motion.span
        initial={{ y: '105%' }}
        animate={inView ? { y: '0%' } : {}}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function About() {
  const imgRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['30%', '-40%'])

  return (
    <section id="studio" className="about">
      <header className="about-head">
        <p className="eyebrow">P.90 · The agency</p>
        <h2 className="about-title">
          <Line>Behind Every Issue,</Line>
          <Line delay={0.08}>There Is an <i>Editor.</i></Line>
        </h2>
      </header>

      <div className="about-grid">
        <div className="about-photos" ref={imgRef}>
          <div className="about-photo main">
            <motion.div className="fill-wrap" style={{ y }}>
              <Photo id={IMG.studio} alt="Portrait from an ARQOVA cover shoot" sizes="(max-width: 767px) 90vw, 40vw" className="fill" />
            </motion.div>
          </div>
          <motion.div className="about-photo inset" style={{ y: y2 }}>
            <Photo id={IMG.studio2} alt="Proofs on the studio wall" sizes="20vw" className="fill" />
          </motion.div>
          <p className="about-caption">The newsroom, Lisbon — Rua da Boavista 41</p>
        </div>

        <div className="about-text">
          <p className="about-lede">
            ARQOVA is an independent magazine agency. We plan, edit, design and print magazines for brands,
            institutions and publishers — from launch issues to full redesigns.
          </p>
          <ol className="principles">
            {PRINCIPLES.map(([t, d], i) => (
              <li key={t}>
                <span>0{i + 1}</span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="about-lists">
        <div className="projects">
          <h3 className="list-title">Selected projects</h3>
          <ul>
            {PROJECTS.map(([y, c, p, t]) => (
              <li key={p}>
                <span>{y}</span><span>{c}</span><b>{p}</b><span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="side-lists">
          <div>
            <h3 className="list-title">Editorial team</h3>
            <ul className="collab">{COLLABORATORS.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
          <div>
            <h3 className="list-title">Agency highlights</h3>
            <dl className="highlights">
              {HIGHLIGHTS.map(([n, l]) => (
                <div key={l}><dt>{n}</dt><dd>{l}</dd></div>
              ))}
            </dl>
            <p className="press">Shortlisted at the Stack Awards 2025 and the European Design Awards — Best Magazine, 2026.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
