import { h } from "../../lib/vue-ninja.esm.js"


export default {
    setup (props, { emit }) {
        function emitEvent() {
            console.log('emit an event')
            emit('happyDay', 1, 2)
        }

        return {
            emitEvent
        }
    },

    render () {

        const btn = h('button', {
           onClick: this.emitEvent 
        }, 'emit')

        const foo = h('p', {}, 'foo')

        return h(
            'div', 
            {}, 
            [
                foo, 
                btn, 
                h('div', {}, 'oooo')
            ])
    }
}