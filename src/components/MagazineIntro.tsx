import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue, MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { IMG, STORIES } from '../data/content'
import { useViewport } from '../hooks/useViewport'
import { Photo } from './Photo'
import { Barcode } from './Barcode'

/* ------------------------------------------------------------------ *
 * Scroll choreography (progress p of the pinned section, 0 → 1)
 *   0.00–0.12  full-bleed photograph, cover typography prints in
 *   0.12–0.36  cover shrinks into a physical magazine, tilts in space
 *   0.36–0.44  settles flat in the centre of the stage
 *   0.44–0.64  front cover swings open on its spine → spread A
 *   0.70–0.88  page turns in 3D → spread B: the editor's letter
 *   0.88–1.00  hold, then the section scrolls away into Contents
 * ------------------------------------------------------------------ */
const T = {
  textIn: [0.025, 0.12],
  shrink: [0.12, 0.36],
  settle: [0.36, 0.44],
  open: [0.44, 0.64],
  turn: [0.7, 0.88],
}

export function MagazineIntro() {
  const reduce = useReducedMotion()
  const vp = useViewport()
  if (reduce) return <MagazineStatic vw={vp.w} vh={vp.h} />
  return <MagazineScroll key={`${vp.w}x${vp.h}`} vw={vp.w} vh={vp.h} />
}

function dims(vw: number, vh: number) {
  const mobile = vw < 768
  const ratio = 0.75
  let W: number
  if (mobile) W = Math.min(vw * 0.82, vh * 0.66 * ratio)
  else W = Math.min(vw * (vw < 1024 ? 0.46 : 0.43), (vh - 150) * ratio)
  W = Math.round(W)
  const H = Math.round(W / ratio)
  // where the spine sits once open: desktop centres the spread, mobile pans to the right page
  const xA = mobile ? W * 0.3 : W / 2
  const xB = mobile ? 0 : W / 2
  return { W, H, xA, xB, mobile }
}

function MagazineScroll({ vw, vh }: { vw: number; vh: number }) {
  const ref = useRef<HTMLElement>(null)
  const { W, H, xA, xB, mobile } = dims(vw, vh)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // light smoothing so wheel steps feel like paper, not jumps
  const p = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.35, restDelta: 0.0002 })

  const w = useTransform(p, T.shrink, [vw, W])
  const h = useTransform(p, T.shrink, [vh, H])
  const y = useTransform(p, [0.12, 0.36], [0, mobile ? 10 : 24])
  const radius = useTransform(p, T.shrink, [0, 3])
  const rotX = useTransform(p, [0.12, 0.28, 0.44], [0, 9, 0])
  const rotZ = useTransform(p, [0.12, 0.28, 0.44], [0, -2.5, 0])
  // whole pixels only — subpixel offsets make the page text render soft
  const x = useTransform(p, [0.44, 0.64, 0.7, 0.88], [0, xA, xA, xB], { clamp: true })
  const xPx = useTransform(x, Math.round)
  const yPx = useTransform(y, Math.round)
  const coverRot = useTransform(p, T.open, [0, -180])
  const leafRot = useTransform(p, T.turn, [0, -180])
  // Depth offsets keep stacked leaves from z-fighting, but under perspective they also scale each
  // page by ~0.1% and resample its text. So depth is on only while the book tilts or a leaf turns;
  // at rest every page lies flat at z=0 and renders pixel-sharp (coplanar pages paint in DOM order).
  const active = useTransform(p, [0.115, 0.125, 0.645, 0.655, 0.69, 0.7, 0.885, 0.895], [0, 1, 1, 0, 0, 1, 1, 0])
  const zCoverFront = useTransform(active, (a) => a * 3)
  const zCoverBack = useTransform(active, (a) => -a * 1)
  const zLeaf = useTransform(active, (a) => a * 2)
  const zLeafBack = useTransform(active, (a) => -a * 2)
  // once the leaf has turned, the advert sits fully under it — hide it so the flat stack stays correct
  const advertVis = useTransform(leafRot, (r) => (r < -90 ? 'hidden' : 'visible'))
  const depth = useTransform(p, [0.2, 0.36], [0, 1])
  const hint = useTransform(p, [0, 0.06], [1, 0])
  const stageBg = useTransform(p, [0.2, 0.4], ['#171717', '#F2EFE9'])

  return (
    <section ref={ref} id="top" className="intro" style={{ height: mobile ? '560vh' : '640vh' }} aria-label="ARQOVA Issue Nº01 — The Agency Issue">
      <motion.div className="intro-stage" style={{ backgroundColor: stageBg }}>
        <motion.div
          className="book"
          style={{ width: w, height: h, x: xPx, y: yPx, rotateX: rotX, rotateZ: rotZ, borderRadius: radius }}
        >
          <motion.div className="book-shadow" style={{ opacity: depth }} aria-hidden />
          <motion.div className="book-edges" style={{ opacity: depth }} aria-hidden />

          {/* z0 — right page of spread B: the editor's letter */}
          <div className="page page-right base">
            <EditorsLetter />
            <div className="gutter gutter-left" />
          </div>

          {/* z1 — the leaf that turns: front = "in this issue", back = editor portrait */}
          <motion.div className="leaf turn-leaf" style={{ rotateY: leafRot }}>
            <motion.div className="face front page" style={{ z: zLeaf }}>
              <InThisIssue />
              <div className="gutter gutter-left" />
              <LeafShade rot={leafRot} />
            </motion.div>
            <motion.div className="face back page" style={{ rotateY: 180, z: zLeafBack }}>
              <Photo id={IMG.editor} alt="Portrait of ARQOVA founder Lior Anand" sizes="(max-width: 767px) 95vw, 60vw" position="50% 30%" className="fill" />
              <p className="page-caption">Lior Anand, founder &amp; editorial director. Photographed in the Lisbon newsroom.</p>
              <div className="gutter gutter-right" />
            </motion.div>
          </motion.div>

          {/* z2 — the front cover: front = cover, back = inside-cover advert */}
          <motion.div className="leaf cover-leaf" style={{ rotateY: coverRot, borderRadius: radius }}>
            <motion.div className="face front" style={{ z: zCoverFront }}>
              <Cover p={p} />
              <LeafShade rot={coverRot} />
            </motion.div>
            <motion.div className="face back page" style={{ rotateY: 180, z: zCoverBack, visibility: advertVis }}>
              <Advert />
              <div className="gutter gutter-right" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="scroll-hint" style={{ opacity: hint }}>
          Scroll to open the issue
        </motion.div>
      </motion.div>
    </section>
  )
}

/** Darkens a leaf as it rotates through 90°, like light falling off a turning page. */
function LeafShade({ rot }: { rot: MotionValue<number> }) {
  const o = useTransform(rot, [0, -60, -100, -180], [0, 0.18, 0.35, 0])
  return <motion.div className="leaf-shade" style={{ opacity: o }} aria-hidden />
}

/* ----------------------------- Cover ----------------------------- */
function Cover({ p }: { p?: MotionValue<number> }) {
  const fallback = useMotionValue(1)
  const src = p ?? fallback
  const r = (a: number, b: number) => useTransform(src, [a, b], [0, 1])
  // staggered "print-in" of the cover typography
  const o1 = r(0.025, 0.08)
  const o2 = r(0.045, 0.1)
  const o3 = r(0.06, 0.115)
  const o4 = r(0.075, 0.125)
  const mastY = useTransform(o1, [0, 1], ['18%', '0%'])
  const leftX = useTransform(o2, [0, 1], [-30, 0])
  const rightX = useTransform(o2, [0, 1], [30, 0])
  const badgeS = useTransform(o4, [0, 1], [0.6, 1])
  const imgScale = useTransform(src, [0, 0.36], [1.12, 1])

  return (
    <div className="cover">
      <motion.div className="cover-img" style={{ scale: imgScale }}>
        <Photo id={IMG.cover} alt="Cover: a model in dramatic low light" priority sizes="115vw" position="50% 22%" className="fill" />
      </motion.div>
      <div className="cover-vignette" />
      <motion.p className="cover-kicker" style={{ opacity: o1 }}>
        The Agency Issue · Six Magazines · Made to Be Kept
      </motion.p>
      <div className="cover-mast-wrap">
        <motion.h1 className="cover-mast" style={{ y: mastY, opacity: o1 }}>ARQOVA</motion.h1>
      </div>
      <motion.ul className="cover-lines left" style={{ x: leftX, opacity: o2 }}>
        <li><b>Quiet Matter</b><span>A fashion house learns to publish <em>P.08</em></span></li>
        <li><b>Modern Muse</b><span>Pitch to print in 11 weeks <em>P.36</em></span></li>
        <li><b>On the press</b><span>Lior Anand on why print still wins <em>P.86</em></span></li>
      </motion.ul>
      <motion.ul className="cover-lines right" style={{ x: rightX, opacity: o3 }}>
        <li className="big"><b>06</b><span>Magazines in this issue</span></li>
        <li><b>Beyond the Ordinary</b><span>Redesigning a 30-year quarterly <em>P.22</em></span></li>
        <li><b>After the Light</b><span>Our own annual, sold out <em>P.78</em></span></li>
      </motion.ul>
      <motion.div className="cover-badge" style={{ opacity: o4, scale: badgeS }}>
        <b>Nº01</b><span>First issue</span>
      </motion.div>
      <motion.div className="cover-price" style={{ opacity: o4 }}>
        <Barcode />
        <div><b>Free</b><span>Autumn / Winter 2026</span></div>
      </motion.div>
    </div>
  )
}

function Advert() {
  return (
    <div className="advert">
      <Photo id={IMG.advert} alt="ARQOVA advertisement" sizes="(max-width: 767px) 95vw, 60vw" position="50% 30%" className="fill" />
      <div className="advert-grad" />
      <p className="advert-label">Advertisement</p>
      <div className="advert-copy">
        <h3>ARQOVA Agency</h3>
        <p>Launches · Redesigns · Brand magazines</p>
        <p>Now booking titles for 2027</p>
      </div>
    </div>
  )
}

function InThisIssue() {
  return (
    <div className="paper issue-page">
      <div className="paper-head"><span>Nº01 · Autumn / Winter 2026</span><span>1</span></div>
      <p className="eyebrow">In this issue</p>
      <h2 className="issue-title">Made to<br /><i>Be Kept.</i></h2>
      <ol className="issue-list">
        {STORIES.map((s) => (
          <li key={s.n}><span>{s.page}</span>{s.title}</li>
        ))}
      </ol>
      <div className="issue-foot">
        <Photo id={IMG.intro} alt="" sizes="(max-width: 767px) 35vw, 20vw" className="issue-thumb" />
        <p>Six magazines we made for brands and publishers — and the thinking behind each one.</p>
      </div>
      <p className="turn-cue">Turn the page →</p>
    </div>
  )
}

function EditorsLetter() {
  return (
    <div className="paper letter">
      <div className="paper-head"><span>Nº01 · Autumn / Winter 2026</span><span>3</span></div>
      <p className="eyebrow accent">Editor’s letter</p>
      <h2 className="letter-title">Every Brand Has a Magazine <i>Waiting</i> Inside It.</h2>
      <div className="letter-body">
        <p className="dropcap">
          At ARQOVA, we make magazines for people who have something to say. We plan them, edit them, design them
          and see them through the press — so brands and publishers can talk to readers in a format they keep.
        </p>
        <p>This first issue gathers six titles from our last two years — a launch, a redesign, a members’ journal and
          our own annual. Each one began as a conversation. Turn slowly, and imagine yours.</p>
      </div>
      <div className="letter-sign">
        <div>
          <p className="sig">Lior Anand</p>
          <p className="sig-role">Founder &amp; editorial director</p>
        </div>
        <Photo id={IMG.signature} alt="" sizes="(max-width: 767px) 30vw, 16vw" className="letter-thumb" />
      </div>
    </div>
  )
}

/* -------- reduced-motion fallback: same content, no scroll choreography -------- */
function MagazineStatic({ vw, vh }: { vw: number; vh: number }) {
  const { W, H } = dims(vw, vh)
  return (
    <section id="top" className="intro-static" aria-label="ARQOVA Issue Nº01 — The Agency Issue">
      <div className="intro-static-cover"><Cover /></div>
      <div className="intro-static-spread">
        <div className="page" style={{ width: W, height: H }}><Advert /></div>
        <div className="page" style={{ width: W, height: H }}><EditorsLetter /></div>
      </div>
    </section>
  )
}
