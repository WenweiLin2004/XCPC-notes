import DefaultTheme from 'vitepress/theme'
import PostMeta from './components/PostMeta.vue'
import './style.css'

function initInteractions() {
  if (typeof window === 'undefined') return
  const w = window as unknown as { __xcpcFx?: boolean }
  if (w.__xcpcFx) return
  w.__xcpcFx = true

  // ---- animated background ----
  if (!document.querySelector('.xcpc-bg')) {
    const bg = document.createElement('div')
    bg.className = 'xcpc-bg'
    bg.innerHTML = '<span></span><span></span><span></span>'
    document.body.appendChild(bg)
  }

  // ---- feature card spotlight (home) ----
  window.addEventListener('pointermove', (e) => {
    const card = (e.target as HTMLElement)?.closest?.('.VPFeature') as HTMLElement | null
    if (card) {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }
  })

  // ---- click burst (博客园 style) ----
  const colors = ['#2563eb', '#7c3aed', '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#06b6d4']
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce) return

  window.addEventListener('pointerdown', (e) => {
    const x = e.clientX
    const y = e.clientY

    const ripple = document.createElement('span')
    ripple.className = 'xcpc-ripple'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    document.body.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove())

    const n = 9
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span')
      p.className = 'xcpc-particle'
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5
      const dist = 38 + Math.random() * 34
      p.style.left = `${x}px`
      p.style.top = `${y}px`
      p.style.setProperty('--dx', `${Math.cos(ang) * dist}px`)
      p.style.setProperty('--dy', `${Math.sin(ang) * dist}px`)
      p.style.background = colors[(Math.random() * colors.length) | 0]
      document.body.appendChild(p)
      p.addEventListener('animationend', () => p.remove())
    }
  })
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
