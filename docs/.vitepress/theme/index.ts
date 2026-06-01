import DefaultTheme from 'vitepress/theme'
import PostMeta from './components/PostMeta.vue'
import './style.css'

function initInteractions() {
  if (typeof window === 'undefined') return
  if (document.querySelector('.cursor-glow')) return

  const glow = document.createElement('div')
  glow.className = 'cursor-glow'
  document.body.appendChild(glow)

  let raf = 0
  let tx = window.innerWidth / 2
  let ty = window.innerHeight / 2
  let cx = tx
  let cy = ty

  const render = () => {
    cx += (tx - cx) * 0.18
    cy += (ty - cy) * 0.18
    glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
    raf = requestAnimationFrame(render)
  }
  render()

  window.addEventListener('pointermove', (e) => {
    tx = e.clientX
    ty = e.clientY
    glow.classList.add('is-visible')

    const card = (e.target as HTMLElement)?.closest?.('.VPFeature') as HTMLElement | null
    if (card) {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }
  })

  window.addEventListener('pointerleave', () => glow.classList.remove('is-visible'))
  window.addEventListener('blur', () => glow.classList.remove('is-visible'))
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PostMeta', PostMeta)
    if (typeof window !== 'undefined') {
      if (document.readyState !== 'loading') initInteractions()
      else window.addEventListener('DOMContentLoaded', initInteractions)
    }
  }
}
