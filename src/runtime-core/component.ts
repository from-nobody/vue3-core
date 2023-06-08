export function createComponentInstance (vnode) {
    const component = {
        vnode,
        type: vnode.type
    }

    return component
}

export function setupComponent (instance) {
    // TODO init props & slots

    // TODO determine stateful component OR non stateful

    setupStatefulComponent(instance)
}

function setupStatefulComponent (instance) {
    const { setup } = instance.type

    if (setup) {
        const result = setup()
        handleSetupResult(instance, result)
    }
}

function handleSetupResult (instance, result) {
    // TODO determine result type, an object or a function

    // opt 1: object
    if (typeof result === 'object') {
        instance.setupState = result
    }

    finishComponentSetup(instance)
}

function finishComponentSetup (instance) {
    const { render } = instance.type

    if (render) {
        instance.render = render
    }
}