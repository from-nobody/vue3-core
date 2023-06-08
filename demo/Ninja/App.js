export default {
    setup () {
        return {
            msg: 'Orochimaru is a real scentist!!'
        }
    },

    render () {
        h('div', 'Seriously ' + msg)
    }
}