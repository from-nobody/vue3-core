import { reactive } from "../reactive"
import { effect } from "../effect"


describe('effect', () => {

    it('smooth', () => {
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
        // person.age++
        
        // expect(new_age).toBe(31)
    })
})