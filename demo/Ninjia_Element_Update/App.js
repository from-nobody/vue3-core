import { h, ref, proxyRefs } from "../../lib/vue-ninja.esm.js"


export default {
    name: 'App',
    setup () {
        const count = ref(0)

        function setCount() {
            // console.log(count)
            count.value++
        }

        const props = ref({
            foo: 'foo',
            bar: 'bar'
        })

        function changeProps_1 () {
            props.value.foo = 'new-foo'
        }

        function changeProps_2 () {
            props.value.foo = undefined
        }

        function changeProps_3 () {
            props.value = {
                foo: 'foo'
            }
        }


        return {
            count,
            setCount,
            props,
            changeProps_1,
            changeProps_2,
            changeProps_3
        }
    },

    render () {
        return h(
            'div', 
            {
                id: 'root',
                ...this.props
            },
            [
                h('div', {}, 'count: ' + this.count),
                h('button', { onClick: this.setCount }, 'click' ),
                h('button', { onClick: this.changeProps_1 }, 'assign a new value'),
                h('button', { onClick: this.changeProps_2 }, 'new value is undefined'),
                h('button', { onClick: this.changeProps_3 }, 'delete a prop')
            ]
        )
    }
}