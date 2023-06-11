import { ShapeFlags } from "../share/ShapeFlags"
import { isOnEvent } from "../share/index"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment } from "./vnode"


export function render (vnode, container) {
    patch(vnode, container)
}

function patch (vnode, container) {
    const { type, shapeFlags } = vnode

    switch (type) {
        case Fragment:                                  // avoid rendering wrapper div of slots children node 
            processFragment(vnode, container)
            break

        default: 
            if (shapeFlags & ShapeFlags.ELEMENT) {        // vnode type is an element (string)
                processElement(vnode, container)
            } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {        // vnode type is a component (object)
                processComponent(vnode, container)
            }
            break
    }
}

function processFragment (vnode, container) {
    mountChildren(vnode.children, container)
}

function processElement (vnode, container) {
    mountElement(vnode, container)
}

function mountElement (vnode, container) { 
    const { type, props, children, shapeFlags } = vnode
    
    //  get element 
    const el = (vnode.el = document.createElement(type))

    // set props
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {

            const val = props[key]

            if (isOnEvent(key)) {
                const event = key.slice(2).toLowerCase()
                el.addEventListener(event, val)
            } else {
                el.setAttribute(key, val)
            }
        }
    }

    // handle children
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(children, el)
    }
    
    // append element
    container.append(el)
}

function mountChildren (children, parent_container) {
    children.forEach(item => {
        patch(item, parent_container)
    })
}

function processComponent (vnode, container) {
    mountComponent(vnode, container)
}

function mountComponent (initialVNode, container) {
    const instance = createComponentInstance(initialVNode)
    setupComponent(instance)
    setupRenderEffect(instance, container, initialVNode)
}

function setupRenderEffect (instance, container, vnode) {
    
    //subTree is a vnode tree returned from the component instance render function 
    const subTree = instance.render.call(instance.proxy)

    patch(subTree, container)

    vnode.el = subTree.el
}