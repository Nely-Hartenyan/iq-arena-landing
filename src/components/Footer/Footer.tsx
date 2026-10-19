import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <img src="/brand/eca.png" alt="" width={92} height={49} />
      <p>Organized by AI Department</p>
      <p className={styles.college}>European College of Armenia</p>
    </footer>
  )
}
