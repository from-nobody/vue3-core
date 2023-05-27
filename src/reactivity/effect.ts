import { extend } from "../share"

class ReactiveEffect {

    private _fn: any
    public scheduler: Function | undefined

    deps = []
    active = true

    onStop?: () => void

    constructor(fn, scheduler?: Function) {
        this._fn = fn
        this.scheduler = scheduler
    }

    run () {
        activeEffect = this
        return this._fn()
    }

    stop () {
        if (this.active) {
            cleanupDeps(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}

function cleanupDeps (effect_instance) {
    effect_instance.deps.forEach((dep: any) => {
        dep.delete(effect_instance)
    })
}


export function effect (fn, option: any={}) {
    const _effect = new ReactiveEffect(fn, option.scheduler)
    extend(_effect, option)

    _effect.run()

    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect

    return runner
}

export function stop (runner) {
    runner.effect.stop()
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

    if (!activeEffect) return

    dep.add(activeEffect)
    activeEffect.deps.push(dep)
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