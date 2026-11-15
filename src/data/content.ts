// Unsplash photo IDs — every image is served through `photo()` so sizing stays consistent.
export const photo = (id: string, w = 1600, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=80`

export const srcSet = (id: string, widths = [480, 800, 1200, 1600, 2200]) =>
  widths.map((w) => `${photo(id, w)} ${w}w`).join(', ')

export const IMG = {
  cover: '1601412436009-d964bd02edbc',
  advert: '1554412933-514a83d2f3c8',
  intro: '1608748010899-18f300247112',
  editor: '1524504388940-b1c1722653e1',
  signature: '1475695752828-6d2b0a83cf8a',
  studio: '1534528741775-53994a69daeb',
  studio2: '1509631179647-0177331693ae',
  seq: [
    '1618244972963-dbee1a7edc95',
    '1539533018447-63fcce2678e3',
    '1485462537746-965f33f7f6a7',
    '1506794778202-cad84cf45f1d',
    '1605763240000-7e93b172d754',
    '1519699047748-de8e457a634e',
    '1483985988355-763728e1935b',
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
}

export const STORIES: Story[] = [
  {
    n: '01', page: '08', title: 'Quiet Matter', category: 'Brand Magazine', client: 'Maison Vael · Biannual, launched 2026',
    deck: 'A 180-page biannual for a fashion house that wanted to be read, not just seen.',
    intro: 'Maison Vael asked for a lookbook. We gave them a magazine: 180 pages of essays, portraits and monochrome tailoring, edited like a literary journal and printed on uncoated stock.',
    quote: 'A catalogue tells you what to buy. A magazine tells you why it matters.',
    credits: [['Editor-in-chief', 'Lior Anand'], ['Art direction', 'Céline Moreau'], ['Photography', 'Yuki Tan'], ['Pages', '180 · biannual'], ['For', 'Maison Vael']],
    image: '1613915617430-8ab0fd7c6baf', thumb: '1574015974293-817f0ebebb74', tint: '#2A2826', ink: '#F2EFE9', imageSide: 'left',
  },
  {
    n: '02', page: '22', title: 'Beyond the Ordinary', category: 'Redesign', client: 'Halden Quarterly · Issue 14',
    deck: 'A 30-year-old quarterly, rebuilt — new grid, new voice, and newsstand sales up 41%.',
    intro: 'A thirty-year-old culture quarterly that had stopped being picked up. We rebuilt the grid, the masthead and the editorial voice — and gave colour back to the cover.',
    quote: 'We didn’t change what Halden says. We changed how loudly it says it.',
    credits: [['Editorial strategy', 'Lior Anand'], ['Design', 'Amara Osei'], ['Type', 'Paolo Ferri'], ['Result', '+41% newsstand'], ['For', 'Halden Quarterly']],
    image: '1562572159-4efc207f5aff', thumb: '1529139574466-a303027c1d8b', tint: '#763B43', ink: '#F2EFE9', imageSide: 'right',
  },
  {
    n: '03', page: '36', title: 'Modern Muse', category: 'Launch Issue', client: 'Muse Collective · Issue Nº1',
    deck: 'From pitch deck to printed launch issue in eleven weeks — a new title for women in the arts.',
    intro: 'A founding team, an idea and no magazine yet. We named it, set its tone, commissioned its writers and photographers, and took Issue Nº1 to print in eleven weeks.',
    quote: 'A launch issue is a promise. Every issue after it has to keep it.',
    credits: [['Concept & naming', 'ARQOVA'], ['Managing editor', 'Céline Moreau'], ['Photography', 'Yuki Tan'], ['Print run', '8,000 copies'], ['For', 'Muse Collective']],
    image: '1611042553365-9b101441c135', thumb: '1531746020798-e6953c6e8e04', tint: '#C8B6A0', ink: '#171717', imageSide: 'left',
  },
  {
    n: '04', page: '50', title: 'Form & Feeling', category: 'Art Direction', client: 'Oblique Magazine · Form Issue',
    deck: 'A themed issue on architecture and the body — white space used as an editorial argument.',
    intro: 'Guest art direction for Oblique’s Form Issue. White on white on white: a layout system where margins do the talking and every page reads like a floor plan.',
    quote: 'Take away the colour and all that is left is structure — and nerve.',
    credits: [['Guest art direction', 'ARQOVA'], ['Editor', 'Amara Osei'], ['Photography', 'Lior Anand'], ['Pages', '144'], ['For', 'Oblique Magazine']],
    image: '1589465885857-44edb59bbff2', thumb: '1608748010899-18f300247112', tint: '#E4DED4', ink: '#171717', imageSide: 'right',
  },
  {
    n: '05', page: '64', title: 'The New Elegance', category: 'Custom Publishing', client: 'Atelier Sorn · Members’ Journal',
    deck: 'A members-only journal mailed to 4,000 clients — quieter than an ad, longer-lasting than a post.',
    intro: 'A private journal for Atelier Sorn’s clients: interviews with makers, notes from the atelier, one red flower on every cover. Mailed twice a year, kept for much longer.',
    quote: 'Elegance is the decision to leave one thing out — even in print.',
    credits: [['Editor', 'Lior Anand'], ['Writing', 'Marc Duval'], ['Production', 'Studio Grão'], ['Circulation', '4,000 members'], ['For', 'Atelier Sorn']],
    image: '1571513722275-4b41940f54b8', thumb: '1550639525-c97d455acf70', tint: '#3C463A', ink: '#F2EFE9', imageSide: 'left',
  },
  {
    n: '06', page: '78', title: 'After the Light', category: 'Independent Title', client: 'ARQOVA Press · Annual',
    deck: 'Our own annual — a year of portraits shot after sunset, written, designed and printed in-house.',
    intro: 'Every agency should publish its own magazine. Ours is an annual of portraits made only after sunset — written, designed and printed in-house, then sold out in nine days.',
    quote: 'We publish our own title so we never forget what our clients are risking.',
    credits: [['Publisher', 'ARQOVA Press'], ['Photography', 'Tomás Reis'], ['Design', 'ARQOVA'], ['Format', '240 × 320 mm'], ['For', 'Ourselves']],
    image: '1502823403499-6ccfcf4fb453', thumb: '1512316609839-ce289d3eba0a', tint: '#1D1A26', ink: '#F2EFE9', imageSide: 'right',
  },
]
