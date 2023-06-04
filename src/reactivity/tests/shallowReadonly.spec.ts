import { isReadonly, shallowReadonly } from "../reactive"

describe('shallowReadonly', () => {
    it('basic', () => {
        const origin = {
            foo: {
                bar: 100
            }
        }

        const proxied = shallowReadonly(origin)

        expect(isReadonly(proxied)).toBe(true)
        expect(isReadonly(proxied.foo)).toBe(false)
    })
})