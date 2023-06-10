const publicPropsMap = {
    $el: (ins) => ins.vnode.el
    // TODO $data/$props/...
};
const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const propsGetter = publicPropsMap[key];
        if (propsGetter) {
            return propsGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    // TODO init props & slots
    // TODO determine stateful component OR non stateful
    setupStatefulComponent(instance);
    const proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    instance.proxy = proxy;
}
function setupStatefulComponent(instance) {
    const { setup } = instance.type;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO determine result type, an object or a function
    // opt 1: object
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
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
    patch(vnode, container);
}
function patch(vnode, container) {
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (typeof vnode.type === 'object') {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children } = vnode;
    //  get element 
    const el = (vnode.el = document.createElement(type));
    // set props
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const attrs = props[key];
            el.setAttribute(key, attrs);
        }
    }
    // handle children
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(children, el);
    }
    // append element
    container.append(el);
}
function mountChildren(children, parent_container) {
    children.forEach(item => {
        patch(item, parent_container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, container, initialVNode);
}
function setupRenderEffect(instance, container, vnode) {
    //subTree is a vnode tree returned from the component instance render function 
    const subTree = instance.render.call(instance.proxy);
    patch(subTree, container);
    vnode.el = subTree.el;
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
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
