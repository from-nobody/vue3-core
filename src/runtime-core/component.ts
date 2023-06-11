import { initProps } from "./componentProps"
import { publicInstanceProxyHandlers } from "./componentPublicInstance"
import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initSlots } from "./componentSlots"


export function createComponentInstance (vnode) {
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => {},
        slots: {}
    }

    instance.emit = emit.bind(null, instance) as any

    return instance
}

export function setupComponent (instance) {
    // init slots
    initSlots(instance, instance.vnode.children)

    // init props
    initProps(instance, instance.vnode.props)


    // TODO determine stateful component OR non stateful

    setupStatefulComponent(instance)

    const proxy = new Proxy(
        {_: instance}, 
        publicInstanceProxyHandlers
    )

    instance.proxy = proxy
}

function setupStatefulComponent (instance) {
    const { setup } = instance.type

    setCurrentInstance(instance)

    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit })
        handleSetupResult(instance, setupResult)
    }

    setCurrentInstance(null)
}

function handleSetupResult (instance, setupResult) {
    // TODO determine result type, an object or a function

    // opt 1: object
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult
    }

    finishComponentSetup(instance)
}

function finishComponentSetup (instance) {
    const { render } = instance.type

    if (render) {
        instance.render = render
    }
}


let currentInstance = null

export function getCurrentInstance () {
    return currentInstance
}
function setCurrentInstance (instance) {
    currentInstance = instance
}