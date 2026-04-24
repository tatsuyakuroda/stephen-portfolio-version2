import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Stack from './components/stack/Stack'
import { SkillsPage } from './components/skills/SkillsPage'
import './App.css'

/** Vite serves `public/` at site root; respects `base` in vite.config */
function publicAsset(relativeFromRoot) {
  const path = relativeFromRoot.replace(/^\//, '')
  const base = import.meta.env.BASE_URL || '/'
  return base.endsWith('/') ? `${base}${path}` : `${base}/${path}`
}

const GALLERY_PLACEHOLDER = publicAsset('images/projects/snapshot-placeholder.svg')

/** Stack mount aspect; use the same 16:10 pixel size for every gallery file (e.g. 1920×1200) so layers align. */
const GALLERY_STACK_ASPECT = '16 / 10'

const TABS = ['DESIGN', 'STORY', 'SKILLS']
const PROJECTS = [
  { id: 'sailup', name: 'SailUp' },
  { id: 'cpphe', name: 'CPPHE' },
  { id: 'simdin', name: 'SimDin' },
  { id: 'tivvy', name: 'Tivvy' },
]

const SKILLS = [
  { name: 'Machine Learning', level: 90 },
  { name: 'TypeScript', level: 88 },
  { name: 'System Design', level: 85 },
  { name: 'UX Research', level: 82 },
  { name: 'Data Pipelines', level: 80 },
  { name: 'APIs & Integrations', level: 92 },
]

const STORY_INTRO =
  'From code to canvas, strategy to systems — I build bridges between disciplines. Not a specialist. A connector.'

const STORY_TAGLINE = 'engineer · designer · storyteller'

const PROJECT_TEASERS = [
  {
    id: 'sailup',
    name: 'SailUp',
    tag: 'Real-time sailing performance',
    gallery: [
      {
        kind: 'image',
        src: publicAsset('images/projects/sailup/snapshot-1.png'),
        explore:
          'Primary dashboard where coaches see live boat metrics and crew state during practice.',
        tech: 'Telemetry ingest · responsive dashboards · low-latency UI',
      },
      {
        kind: 'image',
        src: publicAsset('images/projects/sailup/snapshot-2.png'),
        explore:
          'Session review: translating raw legs into decisions crews can rehearse on the water.',
        tech: 'Analytics views · voice-linked timelines',
      },
      publicAsset('images/projects/sailup/snapshot-3.png'),
      {
        kind: 'video',
        src: publicAsset('images/projects/sailup/sailup.mkv'),
        caption: 'Product walkthrough',
        explore:
          'End-to-end flow: from live session capture to debrief — how the product keeps teams aligned.',
        tech: 'Streaming media · coaching workflows',
      },
    ],
  },
  {
    id: 'cpphe',
    name: 'CPPHE',
    tag: 'Codebase transformation & AI',
    gallery: [
      publicAsset('images/projects/cpphe/snapshot-1.png'),
      // publicAsset('images/projects/cpphe/snapshot-2.png'),
      // publicAsset('images/projects/cpphe/snapshot-3.png'),
      // publicAsset('images/projects/cpphe/snapshot-4.png'),
    ],
  },
  {
    id: 'simdin',
    name: 'SimDin',
    tag: 'Grocery planning & agents',
    gallery: [
      publicAsset('images/projects/simdin/snapshot-1.png'),
      publicAsset('images/projects/simdin/snapshot-2.png'),
      publicAsset('images/projects/simdin/snapshot-3.png'),
    ],
  },
  {
    id: 'tivvy',
    name: 'Tivvy',
    tag: 'Solana compliance platform',
    gallery: [
      publicAsset('images/projects/tivvy/photo_2026-04-24_06-00-33.jpg'),
      publicAsset('images/projects/tivvy/photo_2026-04-24_06-00-45.jpg'),
    ],
  },
]

/** Normalize: string = image URL; objects use `kind`, `src`, optional `caption`, `explore`, `tech` */
function normalizeGalleryEntry(entry) {
  if (typeof entry === 'string')
    return { kind: 'image', src: entry, caption: null, explore: null, tech: null }
  const kind = entry.kind ?? 'image'
  return {
    kind,
    src: entry.src,
    caption: entry.caption ?? null,
    explore: entry.explore ?? null,
    tech: entry.tech ?? null,
  }
}

function defaultGalleryExplore(item, title, index, total, projectBody) {
  if (item.explore) return item.explore
  if (item.kind === 'video' && item.caption) {
    return `${item.caption} — a focused look inside ${title}.`
  }
  const frame = `Frame ${index + 1} of ${total}`
  if (projectBody) {
    const short = projectBody.length > 160 ? `${projectBody.slice(0, 160)}…` : projectBody
    return `${frame}. ${short}`
  }
  return `${frame} from ${title}.`
}

function galleryForProjectId(id) {
  return PROJECT_TEASERS.find((t) => t.id === id)?.gallery ?? []
}

/** Copy for the DESIGN canvas when a project is selected */
const PROJECT_DETAILS = {
  sailup: {
    link: { href: 'https://sailup.ai', label: 'sailup.ai' },
    headline:
      'Real-time performance system for competitive sailing teams',
    body: 'SailUp is a data-driven coaching and communication platform that transforms sailing practices into measurable performance through live telemetry, voice coaching, and post-session analytics.',
  },
  cpphe: {
    headline:
      'End-to-End Platform for Codebase Transformation, Refactoring, and Intelligent Program Creation (Cloud + Local)',
    body: 'AI system that takes existing codebases, rebuilds them into new applications, and continuously improves them across environments',
  },
  simdin: {
    link: { href: 'https://simdin.ai/', label: 'simdin.ai' },
    headline:
      'Autonomous AI system for personalized grocery planning and execution',
    body: 'SimDin is an agent-driven platform that transforms how individuals plan, shop, and manage food by combining conversational AI, preference learning, and real-world integrations into a seamless, continuously optimizing grocery and meal system.',
  },
  tivvy: {
    link: { href: 'https://tivvy.ai', label: 'tivvy.ai' },
    headline: 'Compliance Platform (Solana, Rust, Smart Contracts)',
    body: 'Tivvy is a decentralized workplace compliance platform that automates drug testing, background checks, physical exams, and respirator fit testing for employers and collection sites.',
  },
}

function NavButton({ label, onClick, isActive }) {
  return (
    <button
      type="button"
      className={`nav-btn ${isActive ? 'nav-btn-active' : ''}`}
      data-animation="both"
      onClick={onClick}
    >
      <span className="nav-btn-text">
        <span className="nav-btn-text-track">
          <span>{label}</span>
          <span aria-hidden="true">{label}</span>
        </span>
      </span>
    </button>
  )
}

/** Mobile: project chips (hidden on desktop via .nav-bottom base rule) */
function MobileProjectNav({
  onSelectProject,
  currentProjectId = null,
  hideCurrent = false,
  className = '',
}) {
  const projects =
    hideCurrent && currentProjectId
      ? PROJECTS.filter((p) => p.id !== currentProjectId)
      : PROJECTS

  return (
    <div
      className={`nav-bottom nav-bottom--project-switch${className ? ` ${className}` : ''}`}
      role="navigation"
      aria-label="Projects"
    >
      {projects.map((p) => (
        <NavButton
          key={p.id}
          label={p.name}
          isActive={!hideCurrent && currentProjectId === p.id}
          onClick={() => onSelectProject(p.id)}
        />
      ))}
    </div>
  )
}

function GalleryCarouselModal({
  gallery,
  detail,
  title,
  isOpen,
  slideIndex,
  onSlideChange,
  titleId,
  dialogId,
  closeBtnRef,
  onClose,
}) {
  const total = gallery.length
  if (!isOpen || total === 0) return null

  const idx = Math.min(Math.max(0, slideIndex), total - 1)
  const entry = gallery[idx]
  if (!entry) return null
  const item = normalizeGalleryEntry(entry)

  const modalTitle =
    item.kind === 'video' && item.caption
      ? item.caption
      : `${title} · snapshot ${idx + 1} of ${total}`
  const exploreText = defaultGalleryExplore(
    item,
    title,
    idx,
    total,
    detail.body,
  )

  const goPrev = () => onSlideChange(Math.max(0, idx - 1))
  const goNext = () => onSlideChange(Math.min(total - 1, idx + 1))

  return (
    <div
      className="gallery-lightbox-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        id={dialogId}
        className="gallery-lightbox gallery-lightbox--carousel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="gallery-lightbox-close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          Close
        </button>

        <div className="gallery-carousel-main">
          <button
            type="button"
            className="gallery-carousel-nav gallery-carousel-nav--prev"
            onClick={goPrev}
            disabled={idx <= 0}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <div className="gallery-lightbox-media gallery-carousel-media">
            {item.kind === 'video' ? (
              <video
                key={item.src}
                className="gallery-lightbox-video"
                controls
                playsInline
                preload="metadata"
                aria-label={item.caption ?? `${title} video`}
              >
                <source src={item.src} type="video/x-matroska" />
                <source src={item.src} />
              </video>
            ) : (
              <img
                key={item.src}
                src={item.src}
                alt={modalTitle}
                className="gallery-lightbox-img"
                decoding="async"
                onError={(e) => {
                  const el = e.currentTarget
                  if (el.dataset.fallback === '1') return
                  el.dataset.fallback = '1'
                  el.removeAttribute('srcset')
                  el.src = GALLERY_PLACEHOLDER
                }}
              />
            )}
          </div>
          <button
            type="button"
            className="gallery-carousel-nav gallery-carousel-nav--next"
            onClick={goNext}
            disabled={idx >= total - 1}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        <div
          className="gallery-carousel-toolbar"
          role="group"
          aria-label="Gallery position"
        >
          <span className="gallery-carousel-count" aria-live="polite">
            {idx + 1} / {total}
          </span>
          <div
            className="gallery-carousel-dots"
            role="group"
            aria-label="Slides"
          >
            {gallery.map((_, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === idx ? 'true' : undefined}
                className={`gallery-carousel-dot${i === idx ? ' gallery-carousel-dot--active' : ''}`}
                onClick={() => onSlideChange(i)}
              />
            ))}
          </div>
        </div>

        <div className="gallery-lightbox-copy">
          <h3 id={titleId} className="gallery-lightbox-title">
            {modalTitle}
          </h3>
          <p className="gallery-lightbox-explore">{exploreText}</p>
          {item.tech ? (
            <p className="gallery-lightbox-tech">
              <span className="gallery-lightbox-tech-label">Context</span>
              {item.tech}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ProjectDetailPanel({
  detail,
  title,
  gallery = [],
  onBack,
  projectId,
  onSelectProject,
}) {
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const closeBtnRef = useRef(null)
  const modalTitleId = useId()
  const galleryDialogId = useId()
  const total = gallery.length

  const openGalleryModal = () => {
    setCarouselIndex(0)
    setGalleryModalOpen(true)
  }

  useEffect(() => {
    if (!galleryModalOpen) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0)
    const onKey = (e) => {
      if (e.key === 'Escape') setGalleryModalOpen(false)
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCarouselIndex((i) => Math.max(0, i - 1))
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setCarouselIndex((i) => Math.min(total - 1, i + 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [galleryModalOpen, total])

  const stackCards = useMemo(
    () =>
      gallery.map((entry, i) => {
        const item = normalizeGalleryEntry(entry)
        const key = `${item.kind}-${item.src}-${i}`
        if (item.kind === 'video') {
          return (
            <div key={key} className="stack-card-fill stack-card-fill--gallery-slot">
              <video
                className="card-image"
                muted
                playsInline
                preload="metadata"
                aria-hidden
                tabIndex={-1}
              >
                <source src={item.src} type="video/x-matroska" />
                <source src={item.src} />
              </video>
            </div>
          )
        }
        return (
          <div key={key} className="stack-card-fill stack-card-fill--gallery-slot">
            <img
              src={item.src}
              alt={`${title} preview ${i + 1}`}
              className="card-image"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const el = e.currentTarget
                if (el.dataset.fallback === '1') return
                el.dataset.fallback = '1'
                el.removeAttribute('srcset')
                el.src = GALLERY_PLACEHOLDER
              }}
            />
          </div>
        )
      }),
    [gallery, title],
  )

  if (!detail) return null

  return (
    <div className="project-detail-panel">
      <button
        type="button"
        className="branding-project-back"
        onClick={onBack}
      >
        Overview
      </button>
      <h2 className="branding-project-title">{title}</h2>
      {detail.link ? (
        <a
          className="branding-project-link"
          href={detail.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {detail.link.label}
        </a>
      ) : null}
      <p className="branding-project-headline">{detail.headline}</p>
      <p className="branding-project-body">{detail.body}</p>
      {gallery.length ? (
        <div className="project-detail-gallery-shell project-detail-gallery-shell--stack">
          <div
            className="project-detail-gallery-stack-mount"
            style={{ aspectRatio: GALLERY_STACK_ASPECT }}
          >
            <Stack
              randomRotation
              sensitivity={180}
              sendToBackOnClick
              mobileClickOnly
              cards={stackCards}
            />
          </div>
          <button
            type="button"
            className="project-detail-gallery-open"
            onClick={openGalleryModal}
            aria-haspopup="dialog"
            aria-expanded={galleryModalOpen}
            aria-controls={galleryDialogId}
            aria-label={`View gallery: ${title}, ${total} screenshots and media`}
          >
            View full gallery
          </button>
        </div>
      ) : null}
      {onSelectProject && projectId ? (
        <MobileProjectNav
          onSelectProject={onSelectProject}
          currentProjectId={projectId}
          hideCurrent
          className="nav-bottom--after-gallery"
        />
      ) : null}
      <GalleryCarouselModal
        gallery={gallery}
        detail={detail}
        title={title}
        isOpen={galleryModalOpen}
        slideIndex={carouselIndex}
        onSlideChange={setCarouselIndex}
        titleId={modalTitleId}
        dialogId={galleryDialogId}
        closeBtnRef={closeBtnRef}
        onClose={() => setGalleryModalOpen(false)}
      />
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('DESIGN')
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  const selectProject = (id) => {
    setActiveTab('DESIGN')
    setSelectedProjectId(id)
  }

  const clearProject = () => setSelectedProjectId(null)

  const setTab = (label) => {
    if (
      label === 'DESIGN' &&
      activeTab === 'DESIGN' &&
      selectedProjectId
    ) {
      setSelectedProjectId(null)
      return
    }
    setActiveTab(label)
    if (label !== 'DESIGN') setSelectedProjectId(null)
  }

  const projectDetail =
    selectedProjectId && PROJECT_DETAILS[selectedProjectId]
      ? PROJECT_DETAILS[selectedProjectId]
      : null

  const selectedProjectTitle =
    PROJECTS.find((x) => x.id === selectedProjectId)?.name ??
    selectedProjectId

  return (
    <div className="app">
      <div className="layout">
        <nav className="sidebar">
          {TABS.map((label) => (
            <NavButton
              key={label}
              label={label}
              isActive={activeTab === label}
              onClick={() => setTab(label)}
            />
          ))}
          {PROJECTS.map((p) => (
            <NavButton
              key={p.id}
              label={p.name}
              isActive={
                activeTab === 'DESIGN' && selectedProjectId === p.id
              }
              onClick={() => selectProject(p.id)}
            />
          ))}
        </nav>
        <div className="mobile-layout">
          <div className="nav-tabs">
            {TABS.map((label) => (
              <NavButton
                key={label}
                label={label}
                isActive={activeTab === label}
                onClick={() => setTab(label)}
              />
            ))}
          </div>

          <main
            className={`canvas canvas-${activeTab.toLowerCase()}${
              activeTab === 'DESIGN' && projectDetail
                ? ' canvas-design--project'
                : ''
            }`}
          >
            {activeTab === 'DESIGN' && (
              <>
                {!projectDetail && (
                  <img
                    src="/images/stephen.png"
                    alt="Stephen"
                    className="portrait"
                  />
                )}
                {projectDetail ? (
                  <ProjectDetailPanel
                    detail={projectDetail}
                    title={selectedProjectTitle}
                    gallery={galleryForProjectId(selectedProjectId)}
                    onBack={clearProject}
                    projectId={selectedProjectId}
                    onSelectProject={selectProject}
                  />
                ) : (
                  <aside className="branding">
                    <img
                      src="/images/sign.png"
                      alt="Signature"
                      className="branding-signature"
                    />
                  </aside>
                )}
              </>
            )}
          </main>

          <section className="tab-content">
            {activeTab === 'DESIGN' && !projectDetail && (
              <div className="tab-design">
                <div className="project-teasers">
                  {PROJECT_TEASERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="project-teaser"
                      onClick={() => selectProject(p.id)}
                    >
                      <span className="project-teaser-name">{p.name}</span>
                      <span className="project-teaser-tag">{p.tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'STORY' && (
              <div className="tab-story">
                <img
                  src="/images/sign.png"
                  alt="Signature"
                  className="tab-story-signature"
                />
                <p className="tab-story-intro">{STORY_INTRO}</p>
                <p className="tab-story-tagline">{STORY_TAGLINE}</p>
                <button type="button" className="tab-story-btn">
                  Dive deeper
                </button>
              </div>
            )}

            {activeTab === 'SKILLS' && (
              <div className="tab-skills">
                <SkillsPage />
              </div>
            )}
          </section>

          {activeTab !== 'DESIGN' ? (
            <MobileProjectNav onSelectProject={selectProject} />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default App
