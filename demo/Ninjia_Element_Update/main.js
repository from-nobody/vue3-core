import { createApp } from '../../lib/vue-ninja.esm.js'   
import App from './App.js';


// TODO put this into runtime-core package 
const rootContainer = document.querySelector('#app')

createApp(App).mount(rootContainer)

