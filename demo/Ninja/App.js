import { h } from "../../lib/vue-ninja.esm.js"


export default {
    setup () {
        return {
            msg: 'Orochimaru is a real scentist!!'
        }
    },

    render () {
        return h(
            'div', 
            {
                id: 'root',
                class: ['cc'],
                onMousedown: () => {
                    console.log('down')
                },
                onClick: () => { console.log('key down') }
            }, 
            // [
            //     h('div', {id: 'haha', class: ['size']}, 'Orochimaru is a scientist!!'),
            //     h('div', {id: 'hehe', class: ['style']}, 'Madara is a fool')
            // ] 
            'You know what,'+this.msg
        )
    }
}