import { createComponentInstance, setupComponent } from "./component"


export function render (vnode, container) {
    patch(vnode, container)
}

function patch (vnode, container) {
    if (typeof vnode.type === 'string') {
        processElement(vnode, container)
    } else if (typeof vnode.type === 'object') {            
        processComponent(vnode, container)
    }
}

function processElement (vnode, container) {
    mountElement(vnode, container)
}

function mountElement (vnode, container) { 
    const { type, props, children } = vnode
    
    //  get element 
    const el = document.createElement(type)

    // set props
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const attrs = props[key]
            el.setAttribute(key, attrs)
        }
    }

    // handle children
    if (typeof children === 'string') {
        el.textContent = children
    } else if (Array.isArray(children)) {
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

function mountComponent (vnode, container) {
    const instance = createComponentInstance(vnode)
    setupComponent(instance)
    setupRenderEffect(instance, container)
}

function setupRenderEffect (instance, container) {
    
    //subTree is a vnode tree returned from the component instance render function 
    const subTree = instance.render()

    patch(subTree, container)
}