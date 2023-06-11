import { h, createTextVNode } from "../../lib/vue-ninja.esm.js"
import Bar from './Bar.js'

export default {
    name: 'App',
    setup () {

    },

    render () {

        // const slotNode_1 = h('p',{},'slot111' + msg)
        // const slotNode_2 = h('p',{}, 'slot222' + msg)

        // const slotsArray = [slotNode_1, slotNode_2]
        const slotsObject = {
            header: ({msg}) => [ h('p',{},'slot111' + msg), createTextVNode('Hello from the outside!!') ],
            footer: ({msg}) => h('p',{}, 'slot222' + msg)
        }
    
        return h(
            'div',
            {},
            // [ h('div',{},'App'), h(Bar, {}, slotNode_1) ]
            [ h('div',{},'App'), h(Bar, {}, slotsObject) ]
        )
    }
}