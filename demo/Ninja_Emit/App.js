import { h } from "../../lib/vue-ninja.esm.js"
import Foo from "./Foo.js"


export default {
    setup () {

    },

    render () {
        return h(
            'div',
            {

            },
            [ 
                h( Foo, {
                    onHappyDay: (a, b) => { console.log(a, b) }
                } ) 
            ]
        )
    }
}