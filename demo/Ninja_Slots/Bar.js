import { h, renderSlots } from "../../lib/vue-ninja.esm.js"


export default {
    setup () {

    },

    render () {
        console.log(this.$slots)
        const msg = ' hello'

        // const slots = renderSlots(this.$slots)
        const slot_1 = renderSlots(this.$slots, 'header', {msg})
        const slot_2 = renderSlots(this.$slots, 'footer', {msg})

        return h(
            'div',
            {},
            [ 
                slot_1,
                h('div',{},'Bar'),
                slot_2,
                // slots
            ]
        )
    }
}