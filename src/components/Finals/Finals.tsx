import { finalParagraphs } from '../../content'
import styles from './Finals.module.css'

const path = [
  { value: '4', label: 'խաղ' },
  { value: '4', label: 'հաղթող' },
  { value: '1', label: 'չեմպիոն' },
]

export function Finals() {
  return (
    <section className={styles.section} id="final">
      <div className={styles.card}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Ավարտը</p>
          <h2>Մեծ եզրափակիչ</h2>
          {finalParagraphs.map((paragraph) => (
            <p key={paragraph} className={styles.text}>
              {paragraph}
            </p>
          ))}
          <ol className={styles.path}>
            {path.map((step) => (
              <li key={step.label}>
                <strong>{step.value}</strong>
                <span>{step.label}</span>
              </li>
            ))}
          </ol>
        </div>
        <img src="/rounds/grand-final.jpg" alt="IQ ARENA — մեծ եզրափակիչ" />
      </div>
    </section>
  )
}
