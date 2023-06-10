import { h } from "../../lib/vue-ninja.esm.js"

window.self = null
export default {
    setup () {
        return {
            msg: 'Orochimaru is a real scentist!!'
        }
    },

    render () {
        window.self = this
        return h(
            'div', 
            {
                id: 'root',
                class: ['cc']
            }, 
            // [
            //     h('div', {id: 'haha', class: ['size']}, 'Orochimaru is a scientist!!'),
            //     h('div', {id: 'hehe', class: ['style']}, 'Madara is a fool')
            // ] 
            'You know what,'+this.msg
        )
    }
}