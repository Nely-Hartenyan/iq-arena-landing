import { stats } from '../../content'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} id="top">
      <p className={styles.kicker}>Intellectual Championship</p>
      <img className={styles.wordmark} src="/brand/wordmark.png" alt="IQ ARENA" />
      <h1 className={styles.tagline}>Այստեղ հաղթում է միտքը</h1>
      <p className={styles.lead}>
        Գիտելիք, տրամաբանություն և արագություն՝ մեկ թիմային մրցույթում։ Հինգ փուլ, և հաղթում է նա, ով
        ավելի արագ է կողմնորոշվում։
      </p>
      <div className={styles.actions}>
        <a className={styles.primary} href="#register">
          Գրանցել թիմը
        </a>
        <a className={styles.ghost} href="#rounds">
          Տեսնել փուլերը
        </a>
      </div>
      <p className={styles.organized}>Organized by AI Department</p>
      <ul className={styles.stats}>
        {stats.map((stat) => (
          <li key={stat.value}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
