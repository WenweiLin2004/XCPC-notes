import DefaultTheme from 'vitepress/theme'
import PostMeta from './components/PostMeta.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PostMeta', PostMeta)
  }
}
