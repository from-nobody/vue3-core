class ReactiveEffect {
    private fn: any

    constructor(fn: any) {
        this.fn = fn
    }

    run () {
        this.fn()
    }
}


export function effect (fn: Function) {
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}