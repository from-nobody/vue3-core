import { track, trigger } from "./effect"

export function reactive (target: any) {
    return new Proxy(target, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver)

            // deps collection
            track(target, key)

            return res
        },
        set(target, key, newValue, receiver) {
            const res = Reflect.set(target,key,newValue, receiver)

            // deps trigger
            trigger(target, key)

            return res
        },
    })
}