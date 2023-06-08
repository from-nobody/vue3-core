import { createComponentInstance, setupComponent } from "./component"

export function render (vnode, container) {
    patch(vnode, container)
}


function patch (vnode, container) {
    // TODO determine vnode is an element or a component

    // opt 1: vnode === component 
    processComponent(vnode, container)

    // TODO opt 2: vnode === element
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