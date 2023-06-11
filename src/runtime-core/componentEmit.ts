import { camelize, toHandlerKey } from "../share/index"

export function emit (instance, event, ...args) {
    const { props } = instance

    const handlerName = toHandlerKey(event)
    const handler = props[camelize(handlerName)]
    
    handler && handler(...args)
}