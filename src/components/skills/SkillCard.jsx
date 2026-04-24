import { SkillIcon } from './iconMap'

export function SkillCard({ name, iconKey, level }) {
  return (
    <article className="skill-card" data-reveal="">
      <div className="skill-card__row">
        <span className="skill-card__icon-wrap" aria-hidden>
          <SkillIcon iconKey={iconKey} className="skill-card__icon" />
        </span>
        <div className="skill-card__body">
          <h3 className="skill-card__name">{name}</h3>
          {level != null && (
            <div
              className="skill-card__meter"
              role="presentation"
              aria-hidden
            >
              <span
                className="skill-card__meter-fill"
                style={{ width: `${level}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
