class ReactiveEffect {
    private _fn: any

    constructor(fn, public scheduler?) {
        this._fn = fn
    }

    run () {
        activeEffect = this
        return this._fn()
    }
}

export function effect (fn, option: any={}) {
    const _effect = new ReactiveEffect(fn, option.scheduler)
    _effect.run()
    return _effect.run.bind(_effect)
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
            if (effect.scheduler) {
                effect.scheduler()
            }else {
                effect.run()
            }
        });
    }
}


