import { isReadonly, readonly, isProxy } from "../reactive"

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

    it('deep readonly', () => {
        const origin = {
            happy: {
                haha: 'giggle'
            },
            sad: [
                { sorror: 'cry' }
            ]
        }

        const proxied = readonly(origin)

        expect(isReadonly(proxied.happy)).toBe(true)
        expect(isReadonly(proxied.sad)).toBe(true)
        expect(isReadonly(proxied.sad[0])).toBe(true)
    })

    it('isProxy', () => {
        const origin = {
            happy: {
                haha: 'giggle'
            },
            sad: [
                { sorror: 'cry' }
            ]
        }

        const proxied = readonly(origin)

        expect(isProxy(proxied)).toBe(true)
        expect(isProxy(proxied.happy)).toBe(true)
        expect(isProxy(proxied.sad[0])).toBe(true)
    })
})