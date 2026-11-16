// Photos: `local:<name>` = your own shoot photos bundled in src/assets/photos (two sizes each);
// anything else is an Unsplash photo ID. Every image goes through `photo()` / `srcSet()`.
const FILES = import.meta.glob(
  '../assets/photos/{bow,jade,shore,sunset,golden,sapphire,roses,stool,pleat,alex,kelly,paloma,maitreyi,ember,olive,sun,ruffle,flora,sophia}-{800,1440}.webp',
  { eager: true, import: 'default' },
) as Record<string, string>
const LOCAL_W: Record<string, number> = {
  bow: 1102, jade: 1086, shore: 1028, sunset: 1123, golden: 1024, sapphire: 1024, roses: 1122, stool: 1122, pleat: 618, alex: 1086, kelly: 1086, paloma: 1086, maitreyi: 1086, ember: 1086,
  olive: 1122, sun: 1083, ruffle: 1122, flora: 1440, sophia: 1440,
}
const file = (name: string, w: 800 | 1440) => FILES[`../assets/photos/${name}-${w}.webp`]

export const photo = (id: string, w = 1600, h?: number) => {
  if (id.startsWith('local:')) return file(id.slice(6), w <= 800 ? 800 : 1440)
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=88`
}

export const srcSet = (id: string, widths = [640, 960, 1280, 1600, 2000, 2560, 3200]) => {
  if (id.startsWith('local:')) {
    const n = id.slice(6)
    if (LOCAL_W[n] <= 720) return `${file(n, 1440)} ${LOCAL_W[n]}w`
    return `${file(n, 800)} 720w, ${file(n, 1440)} ${LOCAL_W[n]}w`
  }
  return widths.map((w) => `${photo(id, w)} ${w}w`).join(', ')
}

export const IMG = {
  cover: 'local:shore',
  advert: 'local:sophia',
  intro: 'local:olive',
  editor: 'local:flora',
  signature: 'local:sun',
  studio: 'local:bow',
  studio2: 'local:jade',
  seq: [
    'local:stool',
    'local:sunset',
    'local:roses',
    'local:sapphire',
    'local:golden',
    'local:pleat',
    'local:maitreyi',
  ],
}

export type Story = {
  n: string
  page: string
  title: string
  category: string
  client: string
  intro: string
  deck: string
  quote: string
  credits: [string, string][]
  image: string
  thumb: string
  tint: string // panel colour
  ink: string // panel text colour
  imageSide: 'left' | 'right'
  pos?: string // object-position for the spread photo (default 50% 25%)
}

export const STORIES: Story[] = [
  {
    n: '01', page: '08', title: 'Quiet Matter', category: 'Brand Magazine', client: 'Maison Vael · Biannual, launched 2026',
    deck: 'A 180-page biannual for a fashion house that wanted to be read, not just seen.',
    intro: 'Maison Vael asked for a lookbook. We gave them a magazine: 180 pages of essays, portraits and monochrome tailoring, edited like a literary journal and printed on uncoated stock.',
    quote: 'A catalogue tells you what to buy. A magazine tells you why it matters.',
    credits: [['Editor-in-chief', 'Lior Anand'], ['Art direction', 'Céline Moreau'], ['Photography', 'Yuki Tan'], ['Pages', '180 · biannual'], ['For', 'Maison Vael']],
    image: 'local:kelly', thumb: 'local:alex', tint: '#2A2826', ink: '#F2EFE9', imageSide: 'left',
  },
  {
    n: '02', page: '22', title: 'Beyond the Ordinary', category: 'Redesign', client: 'Halden Quarterly · Issue 14',
    deck: 'A 30-year-old quarterly, rebuilt — new grid, new voice, and newsstand sales up 41%.',
    intro: 'A thirty-year-old culture quarterly that had stopped being picked up. We rebuilt the grid, the masthead and the editorial voice — and gave colour back to the cover.',
    quote: 'We didn’t change what Halden says. We changed how loudly it says it.',
    credits: [['Editorial strategy', 'Lior Anand'], ['Design', 'Amara Osei'], ['Type', 'Paolo Ferri'], ['Result', '+41% newsstand'], ['For', 'Halden Quarterly']],
    image: 'local:ruffle', thumb: 'local:paloma', tint: '#763B43', ink: '#F2EFE9', imageSide: 'right',
  },
  {
    n: '03', page: '36', title: 'Modern Muse', category: 'Launch Issue', client: 'Muse Collective · Issue Nº1',
    deck: 'From pitch deck to printed launch issue in eleven weeks — a new title for women in the arts.',
    intro: 'A founding team, an idea and no magazine yet. We named it, set its tone, commissioned its writers and photographers, and took Issue Nº1 to print in eleven weeks.',
    quote: 'A launch issue is a promise. Every issue after it has to keep it.',
    credits: [['Concept & naming', 'ARQOVA'], ['Managing editor', 'Céline Moreau'], ['Photography', 'Yuki Tan'], ['Print run', '8,000 copies'], ['For', 'Muse Collective']],
    image: 'local:paloma', thumb: 'local:sun', tint: '#C8B6A0', ink: '#171717', imageSide: 'left',
  },
  {
    n: '04', page: '50', title: 'Form & Feeling', category: 'Art Direction', client: 'Oblique Magazine · Form Issue',
    deck: 'A themed issue on architecture and the body — white space used as an editorial argument.',
    intro: 'Guest art direction for Oblique’s Form Issue. White on white on white: a layout system where margins do the talking and every page reads like a floor plan.',
    quote: 'Take away the colour and all that is left is structure — and nerve.',
    credits: [['Guest art direction', 'ARQOVA'], ['Editor', 'Amara Osei'], ['Photography', 'Lior Anand'], ['Pages', '144'], ['For', 'Oblique Magazine']],
    image: 'local:sun', thumb: 'local:olive', tint: '#E4DED4', ink: '#171717', imageSide: 'right',
  },
  {
    n: '05', page: '64', title: 'The New Elegance', category: 'Custom Publishing', client: 'Atelier Sorn · Members’ Journal',
    deck: 'A members-only journal mailed to 4,000 clients — quieter than an ad, longer-lasting than a post.',
    intro: 'A private journal for Atelier Sorn’s clients: interviews with makers, notes from the atelier, one red flower on every cover. Mailed twice a year, kept for much longer.',
    quote: 'Elegance is the decision to leave one thing out — even in print.',
    credits: [['Editor', 'Lior Anand'], ['Writing', 'Marc Duval'], ['Production', 'Studio Grão'], ['Circulation', '4,000 members'], ['For', 'Atelier Sorn']],
    image: 'local:olive', thumb: 'local:ember', tint: '#3C463A', ink: '#F2EFE9', imageSide: 'left',
  },
  {
    n: '06', page: '78', title: 'After the Light', category: 'Independent Title', client: 'ARQOVA Press · Annual',
    deck: 'Our own annual — a year of portraits shot after sunset, written, designed and printed in-house.',
    intro: 'Every agency should publish its own magazine. Ours is an annual of portraits made only after sunset — written, designed and printed in-house, then sold out in nine days.',
    quote: 'We publish our own title so we never forget what our clients are risking.',
    credits: [['Publisher', 'ARQOVA Press'], ['Photography', 'Tomás Reis'], ['Design', 'ARQOVA'], ['Format', '240 × 320 mm'], ['For', 'Ourselves']],
    image: 'local:ember', thumb: 'local:ruffle', tint: '#1D1A26', ink: '#F2EFE9', imageSide: 'right',
  },
]
