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

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

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
const EMPTY_OBJECT = {};

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

let activeEffect;
let shouldTrack = false;
class ReactiveEffect {
    constructor(fn, scheduler) {
        this.deps = [];
        this.active = true;
        this._fn = fn;
        this.scheduler = scheduler;
    }
    run() {
        if (!this.active) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        const result = this._fn();
        shouldTrack = false;
        return result;
    }
    stop() {
        if (this.active) {
            cleanupDeps(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
function cleanupDeps(effect_instance) {
    effect_instance.deps.forEach((dep) => {
        dep.delete(effect_instance);
    });
}
function effect(fn, option = {}) {
    const _effect = new ReactiveEffect(fn, option.scheduler);
    extend(_effect, option);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}
const targetMap = new WeakMap();
function track(target, key) {
    if (!isTracking())
        return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}
function trackEffects(dep) {
    if (!isTracking())
        return;
    if (dep.has(activeEffect))
        return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
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
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
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
        // deps collection
        if (!isReadonly) {
            track(target, key);
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

class RefImpl {
    constructor(raw) {
        this._v_isRef = true;
        this._value = convert(raw);
        this._RawValue = raw;
        this.dep = new Set();
    }
    get value() {
        trackEffects(this.dep);
        return this._value;
    }
    set value(newValue) {
        if (Object.is(newValue, this._RawValue))
            return;
        this._RawValue = newValue;
        this._value = convert(newValue);
        triggerEffects(this.dep);
    }
}
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function ref(raw) {
    const _Ref = new RefImpl(raw);
    return _Ref;
}
function isRef(value) {
    return !!value._v_isRef;
}
function unRef(raw) {
    return isRef(raw) ? raw.value : raw;
}
function proxyRefs(obj) {
    return new Proxy(obj, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },
        set(target, key, newValue) {
            if (isRef(target[key]) && !isRef(newValue)) {
                return (target[key].value = newValue);
            }
            else {
                return Reflect.set(target, key, newValue);
            }
        }
    });
}

function createComponentInstance(vnode, parent) {
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        providers: parent ? parent.providers : {},
        parent,
        isMounted: false,
        subTree: {},
        emit: () => { },
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
    setCurrentInstance(instance);
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
        handleSetupResult(instance, setupResult);
    }
    setCurrentInstance(null);
}
function handleSetupResult(instance, setupResult) {
    // TODO determine result type, an object or a function
    // opt 1: object
    if (typeof setupResult === 'object') {
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const { render } = instance.type;
    if (render) {
        instance.render = render;
    }
}
let currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

function provide(key, value) {
    var _a;
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { providers } = currentInstance;
        const parentProviders = (_a = currentInstance.parent) === null || _a === void 0 ? void 0 : _a.providers;
        if (parentProviders === providers) {
            providers = currentInstance.providers = Object.create(parentProviders);
        }
        providers[key] = value;
    }
}
function inject(key, defaultValue) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const { parent } = currentInstance;
        const parentProviders = parent.providers;
        if (key in parentProviders) {
            return parentProviders[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

// import { render } from "./renderer"
function createAppApi(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                const vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            }
        };
    };
}

function createRenderer(options) {
    const { createElement, patchProp: hostPatchProp, insert } = options;
    function render(vnode, container) {
        patch(null, vnode, container, null);
    }
    function patch(vn1, vn2, container, parentComponent) {
        const { type, shapeFlags } = vn2;
        switch (type) {
            case Fragment: // avoid rendering wrapper div of slots children node 
                processFragment(vn1, vn2, container, parentComponent);
                break;
            case Text:
                processText(vn1, vn2, container);
                break;
            default:
                if (shapeFlags & 1 /* ShapeFlags.ELEMENT */) { // vnode type is an element (string)
                    processElement(vn1, vn2, container, parentComponent);
                }
                else if (shapeFlags & 2 /* ShapeFlags.STATEFUL_COMPONENT */) { // vnode type is a component (object)
                    processComponent(vn1, vn2, container, parentComponent);
                }
                break;
        }
    }
    function processFragment(vn1, vn2, container, parentComponent) {
        mountChildren(vn2.children, container, parentComponent);
    }
    function processText(vn1, vn2, container) {
        const { children } = vn2; // children must be a text node
        const text_node = (vn2.el = document.createTextNode(children));
        container.append(text_node);
    }
    function processElement(vn1, vn2, container, parentComponent) {
        if (!vn1) {
            mountElement(vn2, container, parentComponent); // init element in the beginning
        }
        else {
            patchElement(vn1, vn2); // update element afterwards
        }
    }
    function patchElement(vn1, vn2, container) {
        console.log('patch element');
        console.log('vn1: ', vn1);
        console.log('vn2: ', vn2);
        const oldProps = vn1.props || EMPTY_OBJECT;
        const newProps = vn2.props || EMPTY_OBJECT;
        const el = (vn2.el = vn1.el);
        patchProps(el, oldProps, newProps);
    }
    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                const preProp = oldProps[key];
                const nextProp = newProps[key];
                if (preProp !== nextProp) {
                    hostPatchProp(el, key, preProp, nextProp);
                }
            }
            if (oldProps !== EMPTY_OBJECT) {
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null);
                    }
                }
            }
        }
    }
    function mountElement(vnode, container, parentComponent) {
        const { type, props, children, shapeFlags } = vnode;
        //  get element 
        const el = (vnode.el = createElement(type));
        // set props
        for (const key in props) {
            const val = props[key];
            hostPatchProp(el, key, null, val);
        }
        // handle children
        if (shapeFlags & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlags & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
            mountChildren(children, el, parentComponent);
        }
        // append element
        insert(el, container);
    }
    function mountChildren(children, parent_container, parentComponent) {
        children.forEach(item => {
            patch(null, item, parent_container, parentComponent);
        });
    }
    function processComponent(vn1, vn2, container, parentComponent) {
        mountComponent(vn2, container, parentComponent);
    }
    function mountComponent(initialVNode, container, parentComponent) {
        const instance = createComponentInstance(initialVNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, container, initialVNode);
    }
    function setupRenderEffect(instance, container, initialVNode) {
        effect(() => {
            if (!instance.isMounted) {
                // init 
                const subTree = (instance.subTree = instance.render.call(instance.proxy));
                patch(null, subTree, container, instance);
                initialVNode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
                // update
                const preSubTree = instance.subTree;
                const subTree = instance.render.call(instance.proxy);
                instance.subTree = subTree;
                patch(preSubTree, subTree, container, instance);
            }
        });
    }
    return {
        createApp: createAppApi(render)
    };
}

function createApp(...args) {
    return renderer.createApp(...args);
}
const renderer = createRenderer({
    createElement,
    patchProp,
    insert
});
function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, preValue, nextValue) {
    if (isOnEvent(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, nextValue);
    }
    else {
        if (nextValue === undefined || nextValue === null) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, nextValue);
        }
    }
}
function insert(el, parent_container) {
    parent_container.append(el);
}

export { createApp, createRenderer, createTextVNode, effect, getCurrentInstance, h, inject, provide, proxyRefs, ref, renderSlots };
