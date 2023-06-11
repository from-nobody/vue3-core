import { createApp } from '../../lib/vue-ninja.esm.js'
import App from './App.js'

const app = createApp(App)

const rootComponent = document.querySelector('#app')
app.mount(rootComponent)