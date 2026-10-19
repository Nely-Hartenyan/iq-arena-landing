import { About } from './components/About/About'
import { Finals } from './components/Finals/Finals'
import { Footer } from './components/Footer/Footer'
import { Format } from './components/Format/Format'
import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { Register } from './components/Register/Register'
import { Rounds } from './components/Rounds/Rounds'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Format />
        <Rounds />
        <Finals />
        <Register />
      </main>
      <Footer />
    </>
  )
}
