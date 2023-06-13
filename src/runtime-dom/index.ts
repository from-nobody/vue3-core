import { createRenderer } from "../runtime-core";
import { isOnEvent } from "../share"; 

export * from '../runtime-core'


export function createApp (...args) {
    return renderer.createApp(...args)
}


const renderer: any = createRenderer({
    createElement,
    patchProp,
    insert
})


function createElement (type) {
    return document.createElement(type)
}


function patchProp (el, key, preValue, nextValue) {
    if (isOnEvent(key)) {
        const event = key.slice(2).toLowerCase()
        el.addEventListener(event, nextValue)
    } else {
        if (nextValue === undefined || nextValue === null) {
            el.removeAttribute(key)
        } else {
            el.setAttribute(key, nextValue)
        }
    }
}


function insert (el, parent_container) {
    parent_container.append(el)
}