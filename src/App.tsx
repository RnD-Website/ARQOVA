import { MotionConfig } from 'framer-motion'
import { Header, Folio } from './components/Chrome'
import { MagazineIntro } from './components/MagazineIntro'
import { Contents } from './components/Contents'
import { Stories } from './components/Stories'
import { Sequence } from './components/Sequence'
import { About } from './components/About'
import { BackCover } from './components/BackCover'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#contents">Skip to contents</a>
      <Header />
      <main>
        <MagazineIntro />
        <Contents />
        <Stories />
        <Sequence />
        <About />
        <BackCover />
      </main>
      <Folio />
      <div className="grain" aria-hidden />
    </MotionConfig>
  )
}
