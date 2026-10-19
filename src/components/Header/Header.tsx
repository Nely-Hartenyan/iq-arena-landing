import { useEffect, useState } from 'react'
import styles from './Header.module.css'

const links = [
  { href: '#about', label: 'Մրցույթը' },
  { href: '#format', label: 'Ձևաչափ' },
  { href: '#rounds', label: 'Փուլեր' },
  { href: '#final', label: 'Եզրափակիչ' },
  { href: '#register', label: 'Գրանցում' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={styles.header}>
      <a className={styles.brand} href="#top" onClick={() => setOpen(false)}>
        <img src="/brand/eca.png" alt="European College of Armenia" width={86} height={46} />
      </a>
      <button
        className={styles.menuButton}
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'Փակել' : 'Մենյու'}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.burger} />
      </button>
      <nav id="site-menu" className={styles.nav} data-open={open} aria-label="Բաժիններ">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
      {open && (
        <button className={styles.backdrop} type="button" aria-label="Փակել մենյուն" onClick={() => setOpen(false)} />
      )}
    </header>
  )
}
