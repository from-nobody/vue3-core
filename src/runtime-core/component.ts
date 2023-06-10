import { initProps } from "./componentProps"
import { publicInstanceProxyHandlers } from "./componentPublicInstance"
import { shallowReadonly } from "../reactivity/reactive"


export function createComponentInstance (vnode) {
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {}
    }

    return instance
}

export function setupComponent (instance) {
    // TODO init slots

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

    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props))
        handleSetupResult(instance, setupResult)
    }
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