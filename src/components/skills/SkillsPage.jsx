import { useRevealOnScroll } from '../useRevealOnScroll'
import {
  CORE_STRENGTHS,
  SKILL_SECTIONS,
  SKILLS_PAGE_SUBTITLE,
} from '../../data/skillsPageData'
import { SkillIcon } from './iconMap'
import { SkillCard } from './SkillCard'
import './SkillsPage.css'

function CoreStrengthCard({ title, blurb, iconKey }) {
  return (
    <article className="core-strength-card" data-reveal="">
      <div className="core-strength-card__glow" aria-hidden />
      <div className="core-strength-card__inner">
        <span className="core-strength-card__icon" aria-hidden>
          <SkillIcon iconKey={iconKey} className="core-strength-card__icon-svg" />
        </span>
        <h3 className="core-strength-card__title">{title}</h3>
        <p className="core-strength-card__blurb">{blurb}</p>
      </div>
    </article>
  )
}

export function SkillsPage() {
  useRevealOnScroll()

  return (
    <div className="skills-page">
      <header className="skills-page__header" data-reveal="">
        <h1 className="skills-page__title">Skills &amp; Expertise</h1>
        <p className="skills-page__subtitle">{SKILLS_PAGE_SUBTITLE}</p>
      </header>

      <section className="skills-page__section skills-page__section--core" aria-labelledby="core-strengths-heading">
        <h2
          id="core-strengths-heading"
          className="skills-page__section-title"
          data-reveal=""
        >
          Core Strengths
        </h2>
        <div className="skills-page__core-grid">
          {CORE_STRENGTHS.map((s) => (
            <CoreStrengthCard key={s.id} {...s} />
          ))}
        </div>
      </section>

      {SKILL_SECTIONS.map((section) => (
        <section
          key={section.id}
          className="skills-page__section"
          aria-labelledby={`section-${section.id}`}
        >
          <div className="skills-page__section-head" data-reveal="">
            <span className="skills-page__section-icon" aria-hidden>
              <SkillIcon iconKey={section.iconKey} className="skills-page__section-icon-svg" />
            </span>
            <h2 id={`section-${section.id}`} className="skills-page__section-title">
              {section.title}
            </h2>
          </div>
          <div className="skills-page__skill-grid">
            {section.items.map((item) => (
              <div key={item.name} className="skills-page__skill-cell">
                <SkillCard
                  name={item.name}
                  iconKey={item.iconKey}
                  level={item.level}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
