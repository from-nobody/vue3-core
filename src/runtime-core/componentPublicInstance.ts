const publicPropsMap = {
    $el: (ins) => ins.vnode.el
    // TODO $data/$props/...
}


export const publicInstanceProxyHandlers = {
    get({_: instance}, key) {
        const { setupState } = instance
        if (key in setupState) {
            return setupState[key]
        }

        const propsGetter = publicPropsMap[key]
        if (propsGetter) {
            return propsGetter(instance)
        } 
    }
}