import { createApp } from '../../lib/vue-ninja.esm'
import App from './App';


const app = createApp(App)

// TODO put this into runtime-core package 
const rootComponent = document.querySelector('#app')

app.mount(rootComponent)