import { reactive } from "../reactive"
import { effect, stop } from "../effect"


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

    it('scheduler', () => {
        let dummy
        let run: any

        const scheduler = jest.fn(() => {
            run = runner
        }) 

        const obj = reactive({ foo: 0 })

        const runner = effect(
            () => {
                dummy = obj.foo
            },
            { scheduler }
        )

        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(0)

        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(0)
        
        run()
        expect(dummy).toBe(1)
    })

    it('stop', () => {
        let dummy 
        const obj = reactive({ foo: 0 })
        
        const runner = effect(() => {
            dummy = obj.foo
        })

        obj.foo = 1
        expect(dummy).toBe(1)

        stop(runner)

        // effect no working after invoke stop()
        obj.foo = 2
        expect(dummy).toBe(1)

        // mannually invoke runner, still get reactive results
        runner()
        expect(dummy).toBe(2)
    })

    it('onStop', () => {
        let dummy
        const obj = reactive({ foo: 0 })

        const onStop = jest.fn()
        
        const runner = effect(
            () => {
                dummy = obj.foo
            },
            {
                onStop
            }
        )

        stop(runner)
        expect(onStop).toBeCalledTimes(1)
    })
})