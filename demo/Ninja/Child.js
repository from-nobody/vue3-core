import { h } from "../../lib/vue-ninja.esm.js"


export default {
    setup(props) {
        console.log(props)
    },

    render() {
        return h('div', {}, 'prop from App: ' + this.count)
    }
}