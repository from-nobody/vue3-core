const extend = Object.assign;
const isObject = (raw) => {
    return raw !== null && typeof raw === 'object';
};
const isOnEvent = (key) => /^on[A-Z]/.test(key);
const hasItInside = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const toHandlerKey = (str) => {
    return str ? 'on' + capitalize(str) : '';
};
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : '';
    });
};

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

const publicPropsMap = {
    $el: (ins) => ins.vnode.el,
    $slots: (ins) => ins.slots
    // TODO $data/$props/...
};
const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasItInside(setupState, key)) {
            return setupState[key];
        }
        else if (hasItInside(props, key)) {
            return props[key];
        }
        const propsGetter = publicPropsMap[key];
        if (propsGetter) {
            return propsGetter(instance);
        }
    }
};

const targetMap = new WeakMap();
function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    const dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    if (dep) {
        dep.forEach((effect) => {
            if (effect.scheduler) {
                effect.scheduler();
            }
            else {
                effect.run();
            }
        });
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const reactiveHandler = {
    get,
    set
};
const readonlyHandler = {
    get: readonlyGet,
    set(target, key, newValue, receiver) {
        console.warn(`property ${key} value of readonly object cannot be set`);
        return true;
    }
};
const shallowReadonlyHandler = {
    get: shallowReadonlyGet
};
function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }
        else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        const res = Reflect.get(target, key, receiver);
        if (isShallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, newValue, receiver) {
        const res = Reflect.set(target, key, newValue, receiver);
        // deps trigger
        trigger(target, key);
        return res;
    };
}

var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "is_reactive";
    ReactiveFlags["IS_READONLY"] = "is_readonly";
})(ReactiveFlags || (ReactiveFlags = {}));
function reactive(target) {
    return createProxiedObject(target, reactiveHandler);
}
function readonly(target) {
    return createProxiedObject(target, readonlyHandler);
}
function shallowReadonly(target) {
    return createProxiedObject(target, extend({}, readonlyHandler, { get: shallowReadonlyHandler.get }));
}
function createProxiedObject(raw_object, baseHandler) {
    return new Proxy(raw_object, baseHandler);
}

function emit(instance, event, ...args) {
    const { props } = instance;
    const handlerName = toHandlerKey(event);
    const handler = props[camelize(handlerName)];
    handler && handler(...args);
}

function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlags & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        const slots = {};
        for (const slotName in children) {
            const slotNode = children[slotName];
            slots[slotName] = (props) => normalizeSlot(slotNode(props));
        }
        instance.slots = slots;
    }
}
function normalizeSlot(slotNode) {
    return Array.isArray(slotNode) ? slotNode : [slotNode];
}

function createComponentInstance(vnode) {
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => { },
        slots: {}
    };
    instance.emit = emit.bind(null, instance);
    return instance;
}
function setupComponent(instance) {
    // init slots
    initSlots(instance, instance.vnode.children);
    // init props
    initProps(instance, instance.vnode.props);
    // TODO determine stateful component OR non stateful
    setupStatefulComponent(instance);
    const proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    instance.proxy = proxy;
}
function setupStatefulComponent(instance) {
    const { setup } = instance.type;
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
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

const Fragment = Symbol('fragment');
const Text = Symbol('text');
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlags: getFlags(type)
    };
    if (typeof children === 'string') {
        vnode.shapeFlags = vnode.shapeFlags | 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlags = vnode.shapeFlags | 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    if (vnode.shapeFlags & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        if (typeof children === 'object') {
            vnode.shapeFlags |= 16 /* ShapeFlags.SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getFlags(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    const { type, shapeFlags } = vnode;
    switch (type) {
        case Fragment: // avoid rendering wrapper div of slots children node 
            processFragment(vnode, container);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if (shapeFlags & 1 /* ShapeFlags.ELEMENT */) { // vnode type is an element (string)
                processElement(vnode, container);
            }
            else if (shapeFlags & 2 /* ShapeFlags.STATEFUL_COMPONENT */) { // vnode type is a component (object)
                processComponent(vnode, container);
            }
            break;
    }
}
function processFragment(vnode, container) {
    mountChildren(vnode.children, container);
}
function processText(vnode, container) {
    const { children } = vnode; // children must be a text node
    const text_node = document.createTextNode(children);
    container.append(text_node);
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children, shapeFlags } = vnode;
    //  get element 
    const el = (vnode.el = document.createElement(type));
    // set props
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const val = props[key];
            if (isOnEvent(key)) {
                const event = key.slice(2).toLowerCase();
                el.addEventListener(event, val);
            }
            else {
                el.setAttribute(key, val);
            }
        }
    }
    // handle children
    if (shapeFlags & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlags & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
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

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

export { createApp, createTextVNode, h, renderSlots };
