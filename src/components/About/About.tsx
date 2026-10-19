import { about } from '../../content'
import styles from './About.module.css'

export function About() {
  return (
    <section className={styles.section} id="about">
      <div className={styles.copy}>
        <p className={styles.kicker}>Մրցույթի մասին</p>
        <h2>Ի՞նչ է IQ ARENA-ն</h2>
      </div>
      <div className={styles.text}>
        {about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}
