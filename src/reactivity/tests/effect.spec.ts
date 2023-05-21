import { reactive } from "../reactive"
import { effect } from "../effect"


describe('effect', () => {

    it('basic', () => {
        const person = reactive({
            age: 10
        })

        // initialization
        let new_age 
    
        effect(() => {
            new_age = person.age + 20
        })

        expect(new_age).toBe(30)

        // update age
        person.age++
        
        expect(new_age).toBe(31)
    })


    it('effect return runner function', () => {
        let count = 0
        const runner = effect(() => {
            count++
            return 'I am a value from effect fn'
        })

        expect(count).toBe(1)
        const r = runner()
        expect(count).toBe(2)
        expect(r).toBe('I am a value from effect fn')
    })
})