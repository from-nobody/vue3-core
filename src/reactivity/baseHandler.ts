import { isObject } from "../share"
import { track, trigger } from "./effect"
import { ReactiveFlags, reactive, readonly } from "./reactive"


const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)


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

export const shallowReadonlyHandler = {
    get: shallowReadonlyGet
}

function createGetter (isReadonly: boolean = false, isShallow: boolean = false) {
    return function get (target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }

        const res = Reflect.get(target, key, receiver)

        if (isShallow) {
            return res
        }

        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }

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