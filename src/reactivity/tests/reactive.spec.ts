import { reactive } from "../reactive"


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
})