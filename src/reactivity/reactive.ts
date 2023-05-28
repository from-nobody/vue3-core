import { reactiveHandler, readonlyHandler } from "./baseHandler"

export function reactive (target: any) {
    return createProxiedObject(target, reactiveHandler)
}

export function readonly (target: any) {
    return createProxiedObject(target, readonlyHandler)
}


function createProxiedObject (raw_object, baseHandler) {
    return new Proxy(raw_object, baseHandler)
}