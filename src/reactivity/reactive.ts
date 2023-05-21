export function reactive (target: any) {
    return new Proxy(target, {
        get(target, key) {
            const res = Reflect.get(target, key)

            // TODO: deps collection

            return res
        },
        set(target, key, newValue) {
            const res = Reflect.set(target,key,newValue)

            // TODO: deps trigger

            return res
        },
    })
}