import { createRenderer } from "../runtime-core";
import { isOnEvent } from "../share"; 

export * from '../runtime-core'


export function createApp (...args) {
    return renderer.createApp(...args)
}


const renderer: any = createRenderer({
    createElement,
    patchPros,
    insert
})


function createElement (type) {
    return document.createElement(type)
}


function patchPros (el, key, value) {
    if (isOnEvent(key)) {
        const event = key.slice(2).toLowerCase()
        el.addEventListener(event, value)
    } else {
        el.setAttribute(key, value)
    }
}


function insert (el, parent_container) {
    parent_container.append(el)
}


