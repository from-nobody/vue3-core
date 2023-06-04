import { extend } from "../share"
import { reactiveHandler, readonlyHandler, shallowReadonlyHandler } from "./baseHandler"


export enum ReactiveFlags {
    IS_REACTIVE = 'is_reactive',
    IS_READONLY = 'is_readonly'
}


export function reactive (target: any) {
    return createProxiedObject(target, reactiveHandler)
}

export function readonly (target: any) {
    return createProxiedObject(target, readonlyHandler)
}

export function shallowReadonly (target) {
    return createProxiedObject(target, extend(
        {}, 
        readonlyHandler, 
        {get: shallowReadonlyHandler.get}
    ))
}

export function isReactive (target) {
    return !!target[ReactiveFlags.IS_REACTIVE] 
}


export function isReadonly (target) {
    return !!target[ReactiveFlags.IS_READONLY]
}


function createProxiedObject (raw_object, baseHandler) {
    return new Proxy(raw_object, baseHandler)
}