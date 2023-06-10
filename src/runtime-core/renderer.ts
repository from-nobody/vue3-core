import { ShapeFlags } from "../share/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"


export function render (vnode, container) {
    patch(vnode, container)
}

function patch (vnode, container) {
    if (vnode.shapeFlags & ShapeFlags.ELEMENT) {        // vnode type is an element (string)
        processElement(vnode, container)
    } else if (vnode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {        // vnode type is a component (object)
        processComponent(vnode, container)
    }
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
            const attrs = props[key]
            el.setAttribute(key, attrs)
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