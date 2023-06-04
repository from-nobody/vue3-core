import { isReactive, reactive, isProxy } from "../reactive"


describe('reactive', () => {
    it('basic', () => {
        const person_origin = {
            name: 'Peter',
            age: 18
        }
        const person = reactive(person_origin)
        
        expect(person).not.toBe(person_origin)
        expect(person.name).toBe('Peter')
    }) 

    it('isReactive', () => {
        const origin = {
            haha: 'laugh'
        }

        const proxy = reactive(origin)

        expect(isReactive(proxy)).toBe(true)
        expect(isReactive(origin)).toBe(false)
    })

    it('deep reactive', () => {
        const origin = {
            happy: {
                haha: 'giggle'
            },
            sad: [
                { sorror: 'cry' }
            ]
        }

        const proxied = reactive(origin)

        expect(isReactive(proxied.happy)).toBe(true)
        expect(isReactive(proxied.sad)).toBe(true)
        expect(isReactive(proxied.sad[0])).toBe(true)
    })

    it('isProxy', () => {
        const origin = {
            foo: 56,
            bar: { a: 78 }
        }

        const proxied = reactive(origin)

        expect(isProxy(proxied)).toBe(true)
        expect(isProxy(proxied.bar)).toBe(true)
    })
})