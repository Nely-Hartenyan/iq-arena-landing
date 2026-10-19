import styles from './Format.module.css'

const steps = [
  { n: '01', title: 'Չորս թիմ', text: 'Յուրաքանչյուր խաղում միաժամանակ պայքարում են 4 թիմ։' },
  { n: '02', title: 'Հինգ փուլ', text: 'Գիտելիք, տեսողական գուշակություն, տրամաբանություն, արագություն և գաղտնի կոդ։' },
  { n: '03', title: 'Միավորներ', text: 'Հինգ փուլերի միավորների գումարը որոշում է խաղի հաղթողին։' },
  { n: '04', title: 'Եզրափակիչ', text: 'Չորս խաղերի հաղթողները հանդիպում են մեծ եզրափակչում։' },
]

export function Format() {
  return (
    <section className={styles.section} id="format">
      <div className={styles.head}>
        <p className={styles.kicker}>Ընթացքը</p>
        <h2>Մրցույթի ձևաչափը</h2>
      </div>
      <ol className={styles.steps}>
        {steps.map((step) => (
          <li key={step.n}>
            <span>{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
