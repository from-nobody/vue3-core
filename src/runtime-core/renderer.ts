import { ShapeFlags } from "../share/ShapeFlags"
import { isOnEvent } from "../share/index"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"


export function render (vnode, container, parentCcomponent) {
    patch(vnode, container, parentCcomponent)
}

function patch (vnode, container, parentCcomponent) {
    const { type, shapeFlags } = vnode

    switch (type) {
        case Fragment:                                  // avoid rendering wrapper div of slots children node 
            processFragment(vnode, container, parentCcomponent)
            break

        case Text: 
            processText(vnode, container)
            break

        default: 
            if (shapeFlags & ShapeFlags.ELEMENT) {        // vnode type is an element (string)
                processElement(vnode, container, parentCcomponent)
            } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {        // vnode type is a component (object)
                processComponent(vnode, container, parentCcomponent)
            }
            break
    }
}

function processFragment (vnode, container, parentCcomponent) {
    mountChildren(vnode.children, container, parentCcomponent)
}

function processText (vnode, container) {
    const { children } = vnode      // children must be a text node
    const text_node = document.createTextNode(children)
    container.append(text_node)
}

function processElement (vnode, container, parentCcomponent) {
    mountElement(vnode, container, parentCcomponent)
}

function mountElement (vnode, container, parentCcomponent) { 
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
        mountChildren(children, el, parentCcomponent)
    }
    
    // append element
    container.append(el)
}

function mountChildren (children, parent_container, parentCcomponent) {
    children.forEach(item => {
        patch(item, parent_container, parentCcomponent)
    })
}

function processComponent (vnode, container, parentCcomponent) {
    mountComponent(vnode, container, parentCcomponent)
}

function mountComponent (initialVNode, container, parentCcomponent) {
    const instance = createComponentInstance(initialVNode, parentCcomponent)
    setupComponent(instance)
    setupRenderEffect(instance, container, initialVNode)
}

function setupRenderEffect (instance, container, vnode) {
    
    //subTree is a vnode tree returned from the component instance render function 
    const subTree = instance.render.call(instance.proxy)

    patch(subTree, container, instance)

    vnode.el = subTree.el
}