import { h } from "../../lib/vue-ninja.esm.js"
import { provide, inject } from "../../lib/vue-ninja.esm.js"


const second = {
    name: 'second_component',
    setup () {
        // console.log('i am second')
        provide('foo', 'Info from second')
    },
    render () {
        return h(
            'div',
            {},
            [
                h('div',{},'second component:'),
                h(second_semi)
            ]
        )
    }
}


const second_semi = {
    name: 'second_semi',
    setup () {
        provide('foo', 'Info from second-semi')
        const info = inject('foo')
        const info_1 = inject('haha', () => 'function')

        return {
            info,
            info_1
        }
    },
    render () {
        return h(
            'div',
            {},
            [
                h('div', {}, 'semi component:'),
                h('div', {}, 'semi inject: ' + this.info),
                h('div',{},this.info_1),
                h(third)
            ]
        )
    }
}


const third = {
    name: 'third_component',
    setup () {
        // console.log('i am third')
        const info = inject('foo')
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
                h('div',{}, ' third inject info: ' + this.info)
            ]
        )
    }
}


export default {
    name: 'root_component',
    setup () {
        // console.log('i am App')
    },
    render () {
        return h('div', {}, [h(second)])
    }
}