import { h } from "../../lib/vue-ninja.esm.js"
import { provide, inject } from "../../lib/vue-ninja.esm.js"


const second = {
    name: 'second_component',
    setup () {
        console.log('i am second')
        provide('second_1', 'Info from second_1')
        provide('second_2', 'Info from second_2')
    },
    render () {
        return h(
            'div',
            {},
            [
                h('div',{},'second component:'),
                h(third)
            ]
        )
    }
}


const third = {
    name: 'third_component',
    setup () {
        console.log('i am shird')
        const info = inject('second_1')
        return {
            info
        }
    },
    render () {
        return h(
            'div',
            {},
            [
                h('div', {}, 'third component:'),
                h('div',{}, 'inject info: ' + this.info)
            ]
        )
    }
}


export default {
    name: 'root_component',
    setup () {
        console.log('i am App')
    },
    render () {
        return h('div', {}, [h(second)])
    }
}