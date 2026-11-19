'use client';

import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight, ArrowLeft, ArrowUpRight, Check, Menu, X } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';

/* ------------------------------------------------------------------ */
/*  CONTENT (all copy lives here: add a second language by cloning     */
/*  the `copy` object, markup stays untouched)                         */
/* ------------------------------------------------------------------ */

// One image per hero slide, all from the client's portfolio. The last one sits behind the final H1.
const HERO_SLIDES = [
  { src: '/projects/gsp-01.webp', alt: 'GSP reception with a curved blue desk, suspended blue ribbons and a tiled mosaic wall' },
  { src: '/projects/offices-hero.webp', alt: 'Office under curved timber beams with a desk, glass partitions and a large charcoal artwork' },
  { src: '/projects/page-01.webp', alt: 'PAGE coworking lounge with pink and red modular sofas and a planter' },
  { src: '/projects/approach.webp', alt: 'Office kitchen with a timber-grain bar and sage-green stools' },
];

const copy = {
  nav: [
    { label: 'Approach', href: '#approach' },
    { label: 'Work', href: '#work' },
    { label: 'Studio', href: '#studio' },
    { label: 'Contact', href: '#contact' },
  ],
  cta: 'Start a project',
  hero: {
    captions: [
      'Spaces that inspire.',
      'Environments that perform.',
      'Workplace & interior design, from Milan to seven countries.',
    ],
    eyebrow: 'Designic Milano',
    h1: 'We create distinctive workplaces.',
    sub: 'Strategy, human experience and design, brought together by an international studio with a creative practice in Milan.',
    secondary: 'See the work',
    meta: ['Workplace & Interior design', 'Milano', '2026', 'designic.com'],
  },
  manifesto: {
    eyebrow: 'About',
    statement: ['We create distinctive workplaces that bring together ', 'strategy', ', ', 'human experience', ', and ', 'design', '.'],
    body: 'Designic Milano is an international design studio with a creative practice in Milan, founded by designer and art collector Anya Sarks. For 10 years, we have designed corporate, educational, and mixed-use spaces with a focus on emotional design.',
    mission: 'We transform business environments through design.',
  },
  approach: {
    eyebrow: 'Approach',
    title: 'Three ideas behind every space.',
    pillars: [
      { n: '01', title: 'Human-centeredness', text: 'We are guided by the needs of those who will use the space. The human experience is at the core of every project we create.' },
      { n: '02', title: 'Art & Aesthetics', text: 'Art is an integral part of our design language. We thoughtfully develop details and meanings, creating cohesive and balanced concepts.' },
      { n: '03', title: 'Experiential design', text: 'We design spaces around the experiences they create, shaping scenarios, emotions, and interactions that connect people to a place and its story.' },
    ],
  },
  services: {
    eyebrow: 'What we do',
    title: 'Four kinds of space. One way of working.',
    items: [
      { n: '01', title: 'Offices & Business Spaces', text: 'Headquarters, branch offices and lounges shaped around how teams really work.', img: '/projects/gsp-01.webp', alt: 'GSP corporate office reception with blue ceiling sculptures' },
      { n: '02', title: 'Apartment Hotels & Hospitality Projects', text: 'Welcoming environments where comfort, story and atmosphere come together.', img: '/projects/villa-meneghetti-02.webp', alt: 'Villa Meneghetti interior with a flowering tree over a long table' },
      { n: '03', title: 'Educational centers & campuses', text: 'Places that support learning, curiosity and community.', img: '/projects/designic-studio-02.webp', alt: 'Playful armchairs and a sculptural chandelier in the Designic studio' },
      { n: '04', title: 'Mixed-use Spaces', text: 'Cultural, leisure and working functions living side by side.', img: '/projects/page-01.webp', alt: 'PAGE coworking lounge with pink and red modular sofas' },
    ],
  },
  work: {
    eyebrow: 'Selected work',
    title: 'Spaces we have designed.',
    filters: ['All', 'Offices', 'Hospitality & Culture', 'Coworking', 'Installations'] as const,
  },
  installations: {
    eyebrow: 'Installations',
    title: 'Where design meets art.',
    text: 'Temporary spaces, exhibition stands and installations: a place to experiment, tell stories and play with scale.',
  },
  trust: {
    eyebrow: 'Studio in numbers',
    title: 'A Milan practice with an international reach.',
    stats: [
      { value: 10, suffix: '', label: 'years of experience' },
      { value: 200, suffix: '+', label: 'projects across 7 countries' },
      { value: 7, suffix: '', label: 'countries' },
      { value: 15, suffix: '+', label: 'professional awards' },
    ],
    countries: ['Italy', 'Finland', 'Russia', 'Kazakhstan', 'China', 'United Arab Emirates', 'Indonesia'],
    clientsTitle: 'Corporate clients include',
    clients: ['Deloitte', 'Semrush', 'Kemira', 'Metso Outotec', 'Jotun', 'Nissan', 'JTI', 'Nokian Tyres', 'Element Group', 'Zielinski & Rozen'],
    kemira: {
      eyebrow: 'Case highlight',
      title: 'Kemira',
      text: 'We designed an office for the subsidiary of a Finnish company. The design solutions developed for the project, including an expanded color palette and furniture recommendations, later became part of the company-wide brand book and design guidelines.',
    },
  },
  studio: {
    eyebrow: 'Studio',
    title: 'Founded by Anya Sarks.',
    text: 'Designer and art collector, Anya Sarks founded Designic Milano as an international studio with a creative practice in Milan. Her approach puts the human experience at the core of every project, and art at the center of the design language.',
  },
  contact: {
    eyebrow: 'Contact',
    title: "Let's design a space that performs.",
    text: 'Tell us about your project: the place, the people who will use it, and what you want it to feel like. We will come back to you by email.',
    email: 'info@designic.it',
    site: 'www.designic.com',
    base: 'Based in Milan, working in 7 countries.',
    types: ['Offices & Business Spaces', 'Hospitality', 'Educational', 'Mixed-use', 'Installation', 'Other'],
  },
  footer: {
    payoff: ['Spaces that inspire.', 'Environments that perform.'],
    privacyTitle: 'Privacy & cookies',
    privacyText:
      'The details you send through the contact form are used only to reply to your request and are sent by email to info@designic.it. This site does not set tracking or advertising cookies.',
  },
};

type Category = 'Offices' | 'Hospitality & Culture' | 'Coworking' | 'Installations';

interface Project {
  id: string;
  name: string;
  category: Category;
  type: string;
  area?: string;
  short: string;
  long: string;
  images: { src: string; alt: string }[];
}

const projects: Project[] = [
  {
    id: 'gsp', name: 'GSP', category: 'Offices', type: 'Office', area: '3 730 m²',
    short: 'Corporate office for the newly established centralized unit of a construction company.',
    long: 'Corporate office for the newly established centralized unit of a construction company. A blue-toned reception, sculptural ceiling elements and a mosaic wall give a large floor plate a clear identity.',
    images: [{ src: '/projects/gsp-01.webp', alt: 'GSP reception with curved blue desk, suspended blue ribbons and a tiled mosaic wall' }],
  },
  {
    id: 'designic-studio', name: 'Designic Studio', category: 'Offices', type: 'Office', area: '245 m²',
    short: 'A cozy and inspiring office inspired by Scandinavian design.',
    long: 'A cozy and inspiring office inspired by Scandinavian design. Art, playful furniture, and carefully considered details create a relaxed atmosphere that encourages creativity and artistic expression.',
    images: [
      { src: '/projects/designic-studio-01.webp', alt: 'Designic Studio kitchen corner with light wood cabinets, black stools and pastel pendant lamps' },
      { src: '/projects/designic-studio-02.webp', alt: 'Blue and yellow sculptural armchairs under a petal-like chandelier' },
    ],
  },
  {
    id: 'page', name: 'PAGE', category: 'Coworking', type: 'Coworking', area: '2 045 m²',
    short: 'Flagship space of a coworking chain, for which we developed the brand book and design guidelines.',
    long: 'Flagship space of a coworking chain, for which we developed the brand book and design guidelines. Soft pink and deep red seating, greenery and warm timber make a large shared floor feel welcoming.',
    images: [{ src: '/projects/page-01.webp', alt: 'PAGE coworking with pink and red sofas, a planter and a ping-pong table' }],
  },
  {
    id: 'villa-meneghetti', name: 'Villa Meneghetti', category: 'Hospitality & Culture', type: 'Cultural cluster', area: '7 700 m²',
    short: 'A cultural cluster in a historic Venetian villa inspired by the image of a butterfly.',
    long: 'A cultural cluster in a historic Venetian villa inspired by the image of a butterfly. Rooted in the story of the place, it becomes a guiding symbol that brings together the past and the future, as well as hospitality, leisure and art.',
    images: [
      { src: '/projects/villa-meneghetti-01.webp', alt: 'Villa Meneghetti garden with a green arch swing, a fountain and a butterfly sculpture' },
      { src: '/projects/villa-meneghetti-02.webp', alt: 'Villa interior with a flowering tree above a long table on a checkerboard floor' },
    ],
  },
  {
    id: 'golf-museum', name: 'Golf Museum', category: 'Hospitality & Culture', type: 'Museum',
    short: 'Museum dedicated to the history of golf, centered around a unique private collection.',
    long: 'Museum dedicated to the history of golf, centered around a unique private collection acquired in the US by a hickory golf champion.',
    images: [{ src: '/projects/golf-museum-01.webp', alt: 'Golf museum gallery with vintage golf bags and hanging white flowers' }],
  },
  {
    id: 'kemira', name: 'Kemira', category: 'Offices', type: 'Office', area: '385 m²',
    short: 'Office for a Finnish company’s subsidiary; its design solutions entered the company-wide brand book.',
    long: 'Office for a Finnish company’s subsidiary. The design solutions developed for this project, including an expanded color palette and furniture recommendations, later became part of the company-wide brand book and design guidelines.',
    images: [{ src: '/projects/kemira-01.webp', alt: 'Kemira office meeting area with light wood chairs against a grey wall' }],
  },
  {
    id: 'avito', name: 'Avito', category: 'Offices', type: 'Office lounge', area: '132 m²',
    short: 'Colorful and artsy lounge area at the corporate office of a large IT company.',
    long: 'Colorful and artsy lounge area at the corporate office of a large IT company. Neon lines, a suspended motorbike and a coral fluted bar turn a break area into a destination.',
    images: [{ src: '/projects/avito-01.webp', alt: 'Avito lounge with neon light sculpture, a suspended motorbike and a coral bar' }],
  },
  {
    id: 'kassir', name: 'Kassir', category: 'Offices', type: 'Office', area: '688 m²',
    short: 'Vibrant and welcoming workspace of a ticket operator, connecting people with emotional experiences.',
    long: 'Vibrant and welcoming workspace of a ticket operator that reflects the company’s mission of connecting people with emotional and memorable experiences.',
    images: [
      { src: '/projects/kassir-01.webp', alt: 'Kassir office corridor with a saturated yellow wall and timber seating' },
      { src: '/projects/kassir-02.webp', alt: 'Kassir kitchen counter with round wall mirrors and fruit' },
    ],
  },
];

const installations: Project[] = [
  {
    id: 'zielinski-rozen', name: 'Zielinski & Rozen', category: 'Installations', type: 'Salone del Mobile',
    short: 'A floral installation featuring craspedia flowers, paying homage to Ingo Maurer.',
    long: 'Display design during Salone del Mobile: a floral installation featuring craspedia flowers paying homage to the work of German industrial designer Ingo Maurer.',
    images: [{ src: '/projects/zielinski-rozen-01.webp', alt: 'Hand-drawn sketch of the Zielinski & Rozen shop window with craspedia flowers' }],
  },
  {
    id: 'myth-gallery', name: 'MYTH Gallery', category: 'Installations', type: 'Exhibition stand',
    short: 'The physical space for the stand of a modern art gallery, where art is the main focus.',
    long: 'We created the physical space for the exhibition stand of a modern art gallery. Building upon the materials and colors of the exhibited art objects, we shaped an environment where art is the main focus.',
    images: [
      { src: '/projects/myth-gallery-01.webp', alt: 'MYTH Gallery stand with a steel frame, ochre walls and framed artworks' },
      { src: '/projects/myth-gallery-02.webp', alt: 'Framed paintings beside a brushed steel wall at the MYTH Gallery stand' },
    ],
  },
  {
    id: 'the-right-way', name: 'The Right Way', category: 'Installations', type: 'Labyrinth',
    short: 'A glowing labyrinth about the feeling that there is no way out. Or is there?',
    long: 'Sometimes things are so complicated that it feels like there is no way out, a feeling that we envisioned in the form of a labyrinth. Despite following the signs, you might never find a proper exit. Or will you?',
    images: [{ src: '/projects/the-right-way-01.webp', alt: 'Illuminated white labyrinth walls with exit signs and red geraniums' }],
  },
  {
    id: 'amphiprion', name: 'Amphiprion', category: 'Installations', type: 'Immersive space',
    short: 'Inspired by the soothing effect of anemones: a safe haven in a fast-paced world.',
    long: 'Inspired by the soothing effect of anemones, we sought to create a space that is warm and calming, a safe haven in a fast-paced and often stressful world.',
    images: [{ src: '/projects/amphiprion-01.webp', alt: 'Glowing orange curtained cube with visitors walking past' }],
  },
  {
    id: 'paradox', name: 'Paradox', category: 'Installations', type: 'Installation',
    short: 'A play on the collision between the digital and the physical.',
    long: 'An installation that plays with the collision of the digital and the physical. By highlighting the contrast between an ever-accelerating speed of technological development and ever-persistent paperwork-tied bureaucracy, it highlights an interesting paradox of our time.',
    images: [
      { src: '/projects/paradox-02.webp', alt: 'Lilac pavilion with violet graphic shapes and a glowing base' },
      { src: '/projects/paradox-01.webp', alt: 'Archive room with shelves of cardboard boxes and a desk of papers' },
    ],
  },
];

// Only people present in the client PDFs. Add more here and the layout adapts.
const team = [
  { name: 'Anya Sarks', role: 'Founder, designer and art collector', photo: '/projects/anya-sarks.webp', alt: 'Anya Sarks, founder of Designic Milano, standing at a glass door in an office' },
];

/* ------------------------------------------------------------------ */
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */

/** The Designic bracket: a 1px line with vertical ticks at the ends and at each divider. */
function Bracket({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex w-full text-xs sm:text-sm ${className}`}>
      {items.map((it, i) => (
        <li key={it} className="relative flex-1 border-b border-current px-2 pb-3 text-center">
          <span aria-hidden className="absolute bottom-0 left-0 h-2 w-px bg-current" />
          {i === items.length - 1 && <span aria-hidden className="absolute bottom-0 right-0 h-2 w-px bg-current" />}
          {it}
        </li>
      ))}
    </ul>
  );
}

/** Keyword underlined with a small bracket. */
function Keyword({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'green' }) {
  const c = tone === 'blue' ? 'text-dusty-blue' : 'text-dusty-green';
  return (
    <span className={`relative inline-block ${c}`}>
      {children}
      <span aria-hidden className="absolute -bottom-1 left-0 right-0 h-2 border-b border-current">
        <span className="absolute bottom-0 left-0 h-2 w-px bg-current" />
        <span className="absolute bottom-0 right-0 h-2 w-px bg-current" />
      </span>
    </span>
  );
}

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs uppercase tracking-label ${className}`}>{children}</p>;
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PillLink({ href, children, tone = 'green', onClick }: { href: string; children: React.ReactNode; tone?: 'green' | 'outline' | 'blue'; onClick?: () => void }) {
  const tones = {
    green: 'bg-dusty-green text-dusty-blue hover:bg-paper',
    outline: 'border border-dusty-green/60 text-dusty-green hover:bg-dusty-green hover:text-dusty-blue',
    blue: 'bg-dusty-blue text-paper hover:bg-ink',
  };
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 ${tones[tone]}`}
    >
      {children}
      <ArrowRight size={20} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  HEADER                                                             */
/* ------------------------------------------------------------------ */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled || open ? 'bg-dusty-blue/95 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10">
          <a href="#top" aria-label="Designic Milano, back to top" className="block">
            <Image src="/designic-milano-logo.png" alt="Designic Milano" width={1344} height={440} priority className="h-6 w-auto md:h-8" />
          </a>
          <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
            {copy.nav.map((n) => (
              <a key={n.href} href={n.href} className="text-xs uppercase tracking-[0.25em] text-paper transition-colors hover:text-dusty-green">
                {n.label}
              </a>
            ))}
            <a href="#contact" className="rounded-full bg-dusty-green px-5 py-2.5 text-sm font-medium text-dusty-blue transition-colors hover:bg-paper">
              {copy.cta}
            </a>
          </nav>
          <button
            type="button"
            className="p-2 text-paper md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-dusty-blue px-5 pb-10 pt-28 md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-6">
              {copy.nav.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-5xl font-normal tracking-tight text-dusty-green">
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="text-paper">
              <a href="#contact" onClick={() => setOpen(false)} className="mb-8 inline-flex items-center gap-2 rounded-full bg-dusty-green px-6 py-3 text-sm font-medium text-dusty-blue">
                {copy.cta} <ArrowRight size={20} strokeWidth={1.5} />
              </a>
              <p className="text-sm">{copy.contact.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO: scroll-scrubbed video                                        */
/* ------------------------------------------------------------------ */

function Caption({ p, from, to, children }: { p: MotionValue<number>; from: number; to: number; children: React.ReactNode }) {
  const mid = (from + to) / 2;
  const opacity = useTransform(p, [from, from + 0.05, to - 0.05, to], [0, 1, 1, 0]);
  const y = useTransform(p, [from, mid, to], [28, 0, -28]);
  return (
    <motion.p style={{ opacity, y }} className="absolute inset-x-5 bottom-[22vh] max-w-4xl text-4xl font-normal leading-[1] tracking-tight text-paper sm:text-6xl md:inset-x-10 md:bottom-[24vh] md:text-8xl">
      {children}
    </motion.p>
  );
}

/** One hero slide: fades in/out with the scroll and drifts slowly while it is on screen. */
function HeroSlide({ p, i, slide, last }: { p: MotionValue<number>; i: number; slide: (typeof HERO_SLIDES)[number]; last: boolean }) {
  // slide i is fully visible between its caption boundaries; 0.06 of scroll is the cross-fade
  const start = i === 0 ? 0 : 0.02 + i * 0.24 - 0.03;
  const end = 0.02 + (i + 1) * 0.24 + 0.03;
  const opacity = useTransform(p, i === 0 ? [0, end - 0.06, end] : last ? [start, start + 0.06] : [start, start + 0.06, end - 0.06, end], i === 0 ? [1, 1, 0] : last ? [0, 1] : [0, 1, 1, 0]);
  const scale = useTransform(p, [Math.max(0, start), Math.min(1, end + 0.1)], [1.1, 1]);
  const x = useTransform(p, [Math.max(0, start), Math.min(1, end + 0.1)], [i % 2 ? 24 : -24, 0]);
  return (
    <motion.div style={{ opacity, scale, x }} className="absolute inset-0 will-change-transform">
      <Image src={slide.src} alt={slide.alt} fill priority={i === 0} loading="eager" sizes="100vw" className="object-cover" />
    </motion.div>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  const finalOpacity = useTransform(scrollYProgress, [0.72, 0.84], [0, 1]);
  const finalY = useTransform(scrollYProgress, [0.72, 0.84], [32, 0]);
  const cue = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  if (reduce) {
    return (
      <section id="top" className="relative min-h-screen bg-dusty-blue">
        <Image src={HERO_SLIDES[0].src} alt={HERO_SLIDES[0].alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-dusty-blue/55" />
        <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col justify-end gap-8 px-5 pb-12 pt-32 text-paper md:px-10">
          <ul className="space-y-1 text-3xl tracking-tight md:text-5xl">
            {copy.hero.captions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <HeroFinal />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="top" className="relative h-[400vh] bg-dusty-blue" aria-label="Introduction">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <HeroSlide key={s.src} p={scrollYProgress} i={i} slide={s} last={i === HERO_SLIDES.length - 1} />
        ))}
        <div className="absolute inset-0 bg-dusty-blue/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusty-blue/80 via-dusty-blue/10 to-dusty-blue/30" />

        <Caption p={scrollYProgress} from={0.02} to={0.26}>{copy.hero.captions[0]}</Caption>
        <Caption p={scrollYProgress} from={0.26} to={0.5}>{copy.hero.captions[1]}</Caption>
        <Caption p={scrollYProgress} from={0.5} to={0.74}>{copy.hero.captions[2]}</Caption>

        <motion.div style={{ opacity: finalOpacity, y: finalY }} className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 pb-10 md:px-10">
          <HeroFinal />
        </motion.div>

        <motion.p style={{ opacity: cue }} className="absolute bottom-8 left-5 text-xs uppercase tracking-label text-paper md:left-10">
          Scroll
        </motion.p>
      </div>
    </section>
  );
}

function HeroFinal() {
  return (
    <div className="text-paper">
      <Eyebrow className="mb-4 text-dusty-green">{copy.hero.eyebrow}</Eyebrow>
      <h1 className="max-w-[1300px] text-5xl font-normal leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-[8rem]">
        We create distinctive <span className="text-dusty-green">workplaces</span>.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed md:text-lg">{copy.hero.sub}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <PillLink href="#contact">{copy.cta}</PillLink>
        <PillLink href="#work" tone="outline">{copy.hero.secondary}</PillLink>
      </div>
      <Bracket items={copy.hero.meta} className="mt-10 text-dusty-green" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SECTIONS                                                           */
/* ------------------------------------------------------------------ */

function Manifesto() {
  const s = copy.manifesto.statement;
  return (
    <section id="about" className="scroll-mt-20 bg-paper px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <Eyebrow className="mb-8 text-dusty-blue">{copy.manifesto.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal>
          <h2 className="max-w-6xl text-4xl font-normal leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl">
            {s[0]}
            <Keyword>{s[1]}</Keyword>
            {s[2]}
            <Keyword>{s[3]}</Keyword>
            {s[4]}
            <Keyword>{s[5]}</Keyword>
            {s[6]}
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
          <Reveal className="md:col-span-5 md:col-start-7">
            <p className="max-w-[65ch] text-base leading-relaxed md:text-lg">{copy.manifesto.body}</p>
            <p className="mt-6 text-base font-medium text-dusty-blue md:text-lg">{copy.manifesto.mission}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" className="scroll-mt-20 bg-dusty-blue text-paper">
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[60vh] md:min-h-screen">
          <Image src="/projects/approach.webp" alt="Office kitchen with a timber-grain bar, sage-green stools and a blurred figure passing by" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dusty-blue/70 to-transparent" />
          <div className="absolute bottom-8 left-5 right-5 md:bottom-12 md:left-10">
            <Eyebrow className="mb-3 text-dusty-green">{copy.approach.eyebrow}</Eyebrow>
            <p className="max-w-md text-2xl leading-tight tracking-tight md:text-3xl">
              We create distinctive workplaces that bring together strategy, human experience, and design.
            </p>
          </div>
        </div>
        <div className="px-5 py-16 md:px-12 md:py-28">
          <Reveal>
            <h2 className="mb-14 max-w-lg text-4xl font-normal tracking-tight text-dusty-green md:text-6xl">{copy.approach.title}</h2>
          </Reveal>
          <ol className="space-y-12">
            {copy.approach.pillars.map((p, i) => (
              <li key={p.n}>
                <Reveal delay={i * 0.08}>
                  <div className="border-t border-dusty-green/30 pt-6">
                    <span className="text-5xl font-light text-dusty-green md:text-7xl">{p.n}</span>
                    <h3 className="mt-4 text-2xl tracking-tight md:text-3xl">{p.title}</h3>
                    <p className="mt-3 max-w-[48ch] text-base leading-relaxed text-paper/90">{p.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const [active, setActive] = useState(0);
  return (
    <section id="services" className="scroll-mt-20 bg-paper px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <Eyebrow className="mb-6 text-dusty-blue">{copy.services.eyebrow}</Eyebrow>
          <h2 className="max-w-3xl text-4xl font-normal tracking-tight md:text-6xl">{copy.services.title}</h2>
        </Reveal>
        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
          <ul className="md:col-span-6">
            {copy.services.items.map((s, i) => (
              <li key={s.n} className="border-t border-ink/10 last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className="group flex w-full items-start gap-6 py-7 text-left md:py-9"
                >
                  <span className={`text-sm tracking-[0.25em] transition-colors ${active === i ? 'text-dusty-blue' : 'text-ink/50'}`}>{s.n}</span>
                  <span className="flex-1">
                    <span className={`block text-2xl tracking-tight transition-colors md:text-3xl ${active === i ? 'text-dusty-blue' : 'text-ink'}`}>{s.title}</span>
                    <span className="mt-2 block max-w-[46ch] text-base leading-relaxed text-ink/80">{s.text}</span>
                  </span>
                </button>
                <div className="relative mb-6 aspect-[4/3] overflow-hidden md:hidden">
                  <Image src={s.img} alt={s.alt} fill loading="lazy" sizes="100vw" className="object-cover" />
                </div>
              </li>
            ))}
          </ul>
          <div className="relative hidden md:col-span-6 md:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image src={copy.services.items[active].img} alt={copy.services.items[active].alt} fill loading="lazy" sizes="50vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p, span, onOpen, accent }: { p: Project; span: string; onOpen: (p: Project) => void; accent?: boolean }) {
  const meta = [p.type, p.area].filter(Boolean).join(', ');
  return (
    <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className={span}>
      <button type="button" onClick={() => onOpen(p)} className="group block w-full text-left" aria-label={`Open project ${p.name}`}>
        <div className="relative h-[280px] overflow-hidden bg-dusty-blue-light/30 sm:h-[380px] md:h-[520px]">
          <Image src={p.images[0].src} alt={p.images[0].alt} fill loading="lazy" sizes="(min-width: 768px) 58vw, 100vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 flex items-end bg-dusty-blue/80 p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
            <p className="max-w-[40ch] text-sm leading-relaxed text-paper md:text-base">{p.short}</p>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4 text-paper">
          <h3 className="text-xl tracking-tight md:text-2xl">{p.name}</h3>
          <ArrowUpRight size={20} strokeWidth={1.5} className={accent ? 'text-dusty-pink' : 'text-dusty-green'} />
        </div>
        <p className={`mt-1 text-sm ${accent ? 'text-dusty-pink' : 'text-dusty-green'}`}>{meta}</p>
      </button>
    </motion.li>
  );
}

function Work({ onOpen }: { onOpen: (p: Project) => void }) {
  const [filter, setFilter] = useState<(typeof copy.work.filters)[number]>('All');
  const list = useMemo(() => {
    if (filter === 'All') return projects;
    if (filter === 'Installations') return installations;
    return projects.filter((p) => p.category === filter);
  }, [filter]);
  const spans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7'];

  return (
    <section id="work" className="scroll-mt-20 bg-dusty-blue px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Reveal className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <Eyebrow className="mb-6 text-dusty-green">{copy.work.eyebrow}</Eyebrow>
            <h2 className="max-w-3xl text-4xl font-normal tracking-tight text-paper md:text-6xl">{copy.work.title}</h2>
          </div>
          <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
            {copy.work.filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  filter === f ? 'border-dusty-green bg-dusty-green text-dusty-blue' : 'border-dusty-green/40 text-dusty-green hover:border-dusty-green'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>
        <motion.ul layout className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-12">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProjectCard key={p.id} p={p} span={spans[i % 4]} onOpen={onOpen} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

function Installations({ onOpen }: { onOpen: (p: Project) => void }) {
  const ref = useRef<HTMLUListElement>(null);
  const scrollBy = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * Math.min(560, window.innerWidth * 0.8), behavior: 'smooth' });
  return (
    <section id="installations" className="scroll-mt-20 overflow-hidden bg-paper py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow className="mb-6 text-dusty-blue">{copy.installations.eyebrow}</Eyebrow>
            <h2 className="max-w-3xl text-4xl font-normal tracking-tight md:text-6xl">
              Where design meets <span className="text-dusty-blue underline decoration-dusty-pink decoration-4 underline-offset-8">art</span>.
            </h2>
            <p className="mt-6 max-w-[55ch] text-base leading-relaxed md:text-lg">{copy.installations.text}</p>
          </div>
          <div className="hidden gap-2 md:flex">
            <button type="button" aria-label="Previous installations" onClick={() => scrollBy(-1)} className="rounded-full border border-ink/20 p-3 transition-colors hover:bg-dusty-pink">
              <ArrowLeft size={20} strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="Next installations" onClick={() => scrollBy(1)} className="rounded-full border border-ink/20 p-3 transition-colors hover:bg-dusty-pink">
              <ArrowRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </Reveal>
      </div>
      <ul ref={ref} className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:px-10" aria-label="Installations">
        {installations.map((p) => (
          <li key={p.id} className="w-[78vw] shrink-0 snap-start sm:w-[420px]">
            <button type="button" onClick={() => onOpen(p)} className="group block w-full text-left" aria-label={`Open installation ${p.name}`}>
              <div className="relative aspect-[4/5] overflow-hidden border-b-4 border-dusty-pink">
                <Image src={p.images[0].src} alt={p.images[0].alt} fill loading="lazy" sizes="(min-width: 640px) 420px, 78vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              </div>
              <h3 className="mt-4 text-xl tracking-tight md:text-2xl">{p.name}</h3>
              <p className="mt-1 text-sm text-ink/70">{p.type}</p>
              <p className="mt-3 max-w-[40ch] text-base leading-relaxed">{p.short}</p>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1600;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);
  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      {n}
      {suffix}
    </span>
  );
}

function Trust() {
  return (
    <>
      <section id="numbers" className="scroll-mt-20 bg-dusty-blue px-5 py-24 text-paper md:px-10 md:py-40">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <Eyebrow className="mb-6 text-dusty-green">{copy.trust.eyebrow}</Eyebrow>
            <h2 className="max-w-3xl text-4xl font-normal tracking-tight md:text-6xl">{copy.trust.title}</h2>
          </Reveal>
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 md:mt-24 md:grid-cols-4">
            {copy.trust.stats.map((s) => (
              <div key={s.label} className="flex flex-col border-t border-dusty-green/30 pt-6">
                <dt className="order-2 mt-2 text-sm text-paper/90 md:text-base">{s.label}</dt>
                <dd className="text-7xl font-light leading-none text-dusty-green md:text-9xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-20 flex flex-wrap gap-x-6 gap-y-3 text-2xl tracking-tight md:mt-28 md:gap-x-10 md:text-4xl">
            {copy.trust.countries.map((c) => (
              <li key={c} className={c === 'Italy' ? 'text-dusty-green' : 'text-paper/70'}>
                {c === 'Italy' ? <Keyword tone="green">Italy · Milano</Keyword> : c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="clients" className="bg-paper px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <Eyebrow className="mb-10 text-dusty-blue">{copy.trust.clientsTitle}</Eyebrow>
          </Reveal>
          <ul className="grid grid-cols-2 gap-px bg-ink/10 md:grid-cols-5">
            {copy.trust.clients.map((c) => (
              <li key={c} className="flex h-28 items-center justify-center bg-paper px-4 text-center text-xl font-semibold tracking-tight text-ink opacity-60 transition-opacity duration-300 hover:opacity-100 md:h-36 md:text-2xl">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="kemira" className="bg-dusty-green px-5 py-24 text-dusty-blue md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1600px] items-center gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-6">
            <Eyebrow className="mb-6">{copy.trust.kemira.eyebrow}</Eyebrow>
            <h2 className="text-5xl font-normal tracking-tight md:text-8xl">{copy.trust.kemira.title}</h2>
            <p className="mt-8 max-w-[55ch] text-base leading-relaxed text-ink md:text-lg">{copy.trust.kemira.text}</p>
          </Reveal>
          <Reveal className="md:col-span-5 md:col-start-8">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/projects/kemira-01.webp" alt="Kemira office meeting area with light wood chairs against a grey wall" fill loading="lazy" sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Studio() {
  return (
    <section id="studio" className="scroll-mt-20 bg-paper px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <Eyebrow className="mb-6 text-dusty-blue">{copy.studio.eyebrow}</Eyebrow>
          <h2 className="max-w-3xl text-4xl font-normal tracking-tight md:text-6xl">{copy.studio.title}</h2>
        </Reveal>
        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12">
          {team.map((m) => (
            <Reveal key={m.name} className="md:col-span-4">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src={m.photo} alt={m.alt} fill loading="lazy" sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <h3 className="mt-5 text-2xl tracking-tight">{m.name}</h3>
              <p className="mt-1 text-sm text-ink/70">{m.role}</p>
            </Reveal>
          ))}
          <Reveal className="md:col-span-6 md:col-start-7 md:self-end" delay={0.1}>
            <p className="max-w-[60ch] text-lg leading-relaxed md:text-2xl md:leading-snug">{copy.studio.text}</p>
            <blockquote className="mt-10 border-l border-dusty-blue pl-6 text-2xl tracking-tight text-dusty-blue md:text-4xl">
              {copy.manifesto.mission}
              <footer className="mt-3 text-xs uppercase tracking-label">Our mission</footer>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTACT FORM                                                       */
/* ------------------------------------------------------------------ */

export interface LeadData {
  name: string;
  company: string;
  email: string;
  role: string;
  type: string;
  size: string;
  location: string;
  message: string;
  consent: boolean;
}
const emptyLead: LeadData = { name: '', company: '', email: '', role: '', type: '', size: '', location: '', message: '', consent: false };

function validate(d: LeadData) {
  const e: Partial<Record<keyof LeadData, string>> = {};
  if (!d.name.trim()) e.name = 'Please tell us your name.';
  if (!d.company.trim()) e.company = 'Please tell us your company.';
  if (!d.email.trim()) e.email = 'Please enter your email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'This email address does not look right.';
  if (!d.type) e.type = 'Please choose a project type.';
  if (!d.message.trim()) e.message = 'Please tell us a little about the project.';
  if (!d.consent) e.consent = 'Please accept the privacy note to continue.';
  return e;
}

function ContactForm({ onSubmit }: { onSubmit?: (d: LeadData) => Promise<void> }) {
  const uid = useId();
  const [data, setData] = useState<LeadData>(emptyLead);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const set = <K extends keyof LeadData>(k: K, v: LeadData[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus('submitting');
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        const body = [
          `Name: ${data.name}`, `Company: ${data.company}`, `Email: ${data.email}`, `Role: ${data.role || '-'}`,
          `Project type: ${data.type}`, `Approx. size (m²): ${data.size || '-'}`, `Location: ${data.location || '-'}`, '', data.message,
        ].join('\n');
        const href = `mailto:${copy.contact.email}?subject=${encodeURIComponent(`New project enquiry from ${data.company}`)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const field = 'w-full border-b border-dusty-green/50 bg-transparent py-3 text-base text-paper placeholder:text-paper/50 focus:border-dusty-green focus:outline-none';
  const label = 'mb-1 block text-xs uppercase tracking-[0.25em] text-dusty-green';
  const err = (k: keyof LeadData) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} role="alert" className="mt-1 text-sm text-dusty-pink-light">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof LeadData) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${uid}-${k}-err` : undefined });

  if (status === 'success') {
    return (
      <div role="status" className="border border-dusty-green/40 p-8 text-paper md:p-12">
        <Check size={28} strokeWidth={1.5} className="text-dusty-green" />
        <h3 className="mt-6 text-3xl tracking-tight text-dusty-green md:text-4xl">Thank you, {data.name.split(' ')[0]}.</h3>
        <p className="mt-4 max-w-[48ch] text-base leading-relaxed">
          {onSubmit
            ? 'We have received your request and will reply by email.'
            : 'Your email app should now be open with your request ready to send to info@designic.it. If nothing opened, write to us directly at that address.'}
        </p>
        <button
          type="button"
          onClick={() => { setData(emptyLead); setStatus('idle'); }}
          className="mt-8 rounded-full border border-dusty-green/60 px-6 py-3 text-sm text-dusty-green transition-colors hover:bg-dusty-green hover:text-dusty-blue"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <div>
        <label htmlFor={`${uid}-name`} className={label}>Name*</label>
        <input id={`${uid}-name`} className={field} autoComplete="name" value={data.name} onChange={(e) => set('name', e.target.value)} {...aria('name')} />
        {err('name')}
      </div>
      <div>
        <label htmlFor={`${uid}-company`} className={label}>Company*</label>
        <input id={`${uid}-company`} className={field} autoComplete="organization" value={data.company} onChange={(e) => set('company', e.target.value)} {...aria('company')} />
        {err('company')}
      </div>
      <div>
        <label htmlFor={`${uid}-email`} className={label}>Email*</label>
        <input id={`${uid}-email`} type="email" className={field} autoComplete="email" value={data.email} onChange={(e) => set('email', e.target.value)} {...aria('email')} />
        {err('email')}
      </div>
      <div>
        <label htmlFor={`${uid}-role`} className={label}>Role</label>
        <input id={`${uid}-role`} className={field} autoComplete="organization-title" value={data.role} onChange={(e) => set('role', e.target.value)} />
      </div>
      <div>
        <label htmlFor={`${uid}-type`} className={label}>Project type*</label>
        <select id={`${uid}-type`} className={`${field} [&>option]:text-ink`} value={data.type} onChange={(e) => set('type', e.target.value)} {...aria('type')}>
          <option value="">Select…</option>
          {copy.contact.types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {err('type')}
      </div>
      <div>
        <label htmlFor={`${uid}-size`} className={label}>Approx. size in m²</label>
        <input id={`${uid}-size`} inputMode="numeric" className={field} value={data.size} onChange={(e) => set('size', e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-location`} className={label}>Location</label>
        <input id={`${uid}-location`} className={field} value={data.location} onChange={(e) => set('location', e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-message`} className={label}>Message*</label>
        <textarea id={`${uid}-message`} rows={4} className={field} value={data.message} onChange={(e) => set('message', e.target.value)} {...aria('message')} />
        {err('message')}
      </div>
      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-paper">
          <input id={`${uid}-consent`} type="checkbox" checked={data.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-1 h-4 w-4 accent-dusty-green" {...aria('consent')} />
          <span>
            I have read the <a href="#privacy" className="underline underline-offset-4 hover:text-dusty-green">privacy note</a> and agree to be contacted about my request.*
          </span>
        </label>
        {err('consent')}
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="group inline-flex items-center gap-2 rounded-full bg-dusty-green px-7 py-3.5 text-sm font-medium text-dusty-blue transition-colors hover:bg-paper disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Send request'}
          <ArrowRight size={20} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
        </button>
        {status === 'error' && (
          <p role="alert" className="text-sm text-dusty-pink-light">
            Something went wrong. Please try again or write to {copy.contact.email}.
          </p>
        )}
      </div>
    </form>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 bg-dusty-blue px-5 py-24 text-paper md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-16 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <Eyebrow className="mb-6 text-dusty-green">{copy.contact.eyebrow}</Eyebrow>
          <h2 className="text-4xl font-normal leading-[1] tracking-tight text-dusty-green md:text-6xl">{copy.contact.title}</h2>
          <p className="mt-6 max-w-[45ch] text-base leading-relaxed md:text-lg">{copy.contact.text}</p>
          <ul className="mt-12 space-y-3 text-base">
            <li><a href={`mailto:${copy.contact.email}`} className="underline underline-offset-4 transition-colors hover:text-dusty-green">{copy.contact.email}</a></li>
            <li><a href="https://www.designic.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-colors hover:text-dusty-green">{copy.contact.site}</a></li>
            <li className="pt-4 text-dusty-green">{copy.contact.base}</li>
          </ul>
        </Reveal>
        <Reveal className="md:col-span-7" delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-dusty-green/20 bg-dusty-blue px-5 pb-10 pt-20 text-dusty-green md:px-10 md:pt-28">
      <div className="mx-auto max-w-[1600px]">
        <Image src="/designic-milano-logo.png" alt="Designic Milano" width={1344} height={440} loading="lazy" sizes="100vw" className="h-auto w-full" />
        <p className="mt-12 text-2xl leading-tight tracking-tight md:text-4xl">
          {copy.footer.payoff[0]}
          <br />
          {copy.footer.payoff[1]}
        </p>
        <Bracket items={['© 2026 Designic Milano', copy.contact.email, 'designic.com']} className="mt-16" />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-paper">
          <a href="https://www.designic.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-dusty-green">
            Designic International <ArrowUpRight size={20} strokeWidth={1.5} />
          </a>
          <a href="#top" className="underline underline-offset-4 hover:text-dusty-green">Back to top</a>
        </div>
        <div id="privacy" className="mt-12 max-w-[70ch] scroll-mt-24 text-sm leading-relaxed text-paper/90">
          <h2 className="mb-2 text-xs uppercase tracking-label text-dusty-green">{copy.footer.privacyTitle}</h2>
          <p>{copy.footer.privacyText}</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  PROJECT DRAWER (modal, Esc, focus trap)                            */
/* ------------------------------------------------------------------ */

function ProjectDrawer({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!project) return;
    opener.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[60]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-ink/60" onClick={onClose} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={project.name}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto bg-paper md:w-[min(760px,60vw)]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-paper/95 px-5 py-4 backdrop-blur-sm md:px-8">
              <Eyebrow className="text-dusty-blue">{project.category === 'Installations' ? 'Installation' : 'Project'}</Eyebrow>
              <button type="button" onClick={onClose} aria-label="Close project" className="rounded-full border border-ink/20 p-2 transition-colors hover:bg-dusty-green">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <div className="px-5 pb-16 md:px-8">
              <h2 className="text-4xl tracking-tight md:text-6xl">{project.name}</h2>
              <Bracket items={[project.type, ...(project.area ? [project.area] : []), project.category]} className="mt-6 text-dusty-blue" />
              <p className="mt-8 max-w-[60ch] text-base leading-relaxed md:text-lg">{project.long}</p>
              <div className="mt-10 space-y-4">
                {project.images.map((im) => (
                  <div key={im.src} className="relative">
                    <Image src={im.src} alt={im.alt} width={1600} height={1100} sizes="(min-width: 768px) 60vw, 100vw" className="h-auto w-full" />
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <PillLink href="#contact" tone="blue" onClick={onClose}>{copy.cta}</PillLink>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Designic Milano',
  url: 'https://www.designic.com',
  email: 'info@designic.it',
  description: 'International interior and workplace design studio with a creative practice in Milan, founded by designer and art collector Anya Sarks.',
  slogan: 'Spaces that inspire. Environments that perform.',
  foundingLocation: { '@type': 'Place', name: 'Milan, Italy' },
  founder: { '@type': 'Person', name: 'Anya Sarks' },
  areaServed: copy.trust.countries,
  knowsAbout: ['Workplace design', 'Interior design', 'Emotional design', 'Hospitality design', 'Installations'],
};

export default function DesignicMilanoHomepage() {
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Approach />
        <Services />
        <Work onOpen={setOpen} />
        <Installations onOpen={setOpen} />
        <Trust />
        <Studio />
        <Contact />
      </main>
      <Footer />
      <ProjectDrawer project={open} onClose={close} />
    </>
  );
}
