import { isReactive, reactive } from "../reactive"


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
})