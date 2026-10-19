import { useState } from 'react'
import { rounds } from '../../content'
import styles from './Rounds.module.css'

export function Rounds() {
  const [activeId, setActiveId] = useState(rounds[0].id)
  const active = rounds.find((round) => round.id === activeId) ?? rounds[0]

  return (
    <section className={styles.section} id="rounds">
      <div className={styles.head}>
        <p className={styles.kicker}>Հինգ փուլ</p>
        <h2>Մրցույթի 5 փուլերը</h2>
      </div>

      <div className={styles.picker}>
        {rounds.map((round) => {
          const isActive = round.id === active.id
          return (
            <button
              key={round.id}
              type="button"
              className={styles.card}
              data-active={isActive}
              aria-pressed={isActive}
              onClick={() => setActiveId(round.id)}
            >
              <img src={round.image} alt="" />
              <span className={styles.caption}>
                <span className={styles.number}>{round.number}</span>
                {round.title}
              </span>
            </button>
          )
        })}
      </div>

      <article className={styles.detail} key={active.id} id={active.id}>
        <div className={styles.detailHead}>
          <p className={styles.subtitle}>{active.subtitle}</p>
          <h3>{active.title}</h3>
          <p className={styles.lead}>{active.intro}</p>
          <ul className={styles.facts}>
            {active.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        <div className={styles.columns}>
          <div>
            <h4>{active.groupTitle}</h4>
            <ul className={styles.chips}>
              {active.group.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Կանոնները</h4>
            <ul className={styles.rules}>
              {active.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </section>
  )
}
