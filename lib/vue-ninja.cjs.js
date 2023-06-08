'use strict';

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    };
    return component;
}
function setupComponent(instance) {
    // TODO init props & slots
    // TODO determine stateful component OR non stateful
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const { setup } = instance.type;
    if (setup) {
        const result = setup();
        handleSetupResult(instance, result);
    }
}
function handleSetupResult(instance, result) {
    // TODO determine result type, an object or a function
    // opt 1: object
    if (typeof result === 'object') {
        instance.setupState = result;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const { render } = instance.type;
    if (render) {
        instance.render = render;
    }
}

function render(vnode, container) {
    patch(vnode);
}
function patch(vnode, container) {
    // TODO determine vnode is an element or a component
    // opt 1: vnode === component 
    processComponent(vnode);
    // TODO opt 2: vnode === element
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    //subTree is a vnode tree returned from the component instance render function 
    const subTree = instance.render();
    patch(subTree);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const vnode = createVNode(rootComponent);
            render(vnode);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
