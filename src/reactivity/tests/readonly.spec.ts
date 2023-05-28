import { isReadonly, readonly } from "../reactive"

describe('redonly', () => {
    it('basic', () => {
        const origin = {
            haha: 'smile'
        }

        const proxied = readonly(origin)

        expect(proxied).not.toBe(origin)
        expect(proxied.haha).toBe('smile')
    })

    it('warning message while triggering set', () => {
        const wrapped = readonly({
            haha: 'smile'
        })

        console.warn = jest.fn()

        wrapped.haha = 'not happay'

        expect(console.warn).toBeCalled()
    }) 

    it('isReadonly', () => {
        const origin = {
            haha: 'smile'
        }

        const proxy = readonly(origin)

        expect(isReadonly(proxy)).toBe(true)
        expect(isReadonly(origin)).toBe(false)
    })
})