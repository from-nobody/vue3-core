import { readonly } from "../reactive"

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
})