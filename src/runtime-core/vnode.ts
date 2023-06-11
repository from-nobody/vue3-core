import { ShapeFlags } from "../share/ShapeFlags"


export function createVNode (type, props?, children?) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlags: getFlags(type)
    }

    if (typeof children === 'string') {
        vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.TEXT_CHILDREN
    } else if (Array.isArray(children)) {
        vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.ARRAY_CHILDREN
    }

    if (vnode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        if ( typeof children === 'object' ) {
            vnode.shapeFlags |= ShapeFlags.SLOT_CHILDREN
        }
    }

    return vnode
}


function getFlags (type) {
    return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT 
}