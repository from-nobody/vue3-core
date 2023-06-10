import { publicInstanceProxyHandlers } from "./componentPublicInstance"


export function createComponentInstance (vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    }

    return component
}

export function setupComponent (instance) {
    // TODO init props & slots

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
        const setupResult = setup()
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