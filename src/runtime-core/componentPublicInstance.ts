import { hasItInside } from "../share/index"

const publicPropsMap = {
    $el: (ins) => ins.vnode.el
    // TODO $data/$props/...
}


export const publicInstanceProxyHandlers = {
    get({_: instance}, key) {

        const { setupState, props } = instance

        if (hasItInside(setupState, key)) {
            return setupState[key]
        } else if (hasItInside(props, key)) {
            return props[key]
        }

        const propsGetter = publicPropsMap[key]

        if (propsGetter) {
            return propsGetter(instance)
        } 
    }
}