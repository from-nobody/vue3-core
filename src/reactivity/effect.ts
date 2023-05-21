class ReactiveEffect {
    private _fn: any

    constructor(fn: any) {
        this._fn = fn
    }

    run () {
        activeEffect = this
        this._fn()
    }
}

export function effect (fn: any) {
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}


const targetMap = new WeakMap()

let activeEffect: any

export function track (target: object, key: string | symbol) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }

    dep.add(activeEffect)
}


export function trigger (target: object, key: string | symbol) {
    const depsMap = targetMap.get(target)
    if (!depsMap) { return }
    const dep = depsMap.get(key)
    if (dep) {
        dep.forEach((effect: any) => {
            effect.run()
        });
    }
}


