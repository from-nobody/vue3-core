import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)


export const reactiveHandler = {
    get,
    set
}


export const readonlyHandler = {
    get: readonlyGet,
    set (target, key, newValue, receiver) {
        console.warn(`property ${key} value of readonly object cannot be set`)

        return true
    }
}


function createGetter (isReadonly: boolean = false) {
    return function get (target, key, receiver) {
        const res = Reflect.get(target, key, receiver)

        // deps collection
        if (!isReadonly) {
            track(target, key)
        }

        return res
    }
}

function createSetter () {
    return function set (target, key, newValue, receiver) {
        const res = Reflect.set(target,key,newValue, receiver)

        // deps trigger
        trigger(target, key)

        return res
    }
}