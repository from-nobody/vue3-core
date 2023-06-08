import { computed } from "../computed"
import { reactive } from "../reactive"


describe('computed', () => {
    it('basic', () => {
        const obj = reactive({
            foo: 100
        })

        const cValue = computed(() => {
            return obj.foo
        })

        expect(cValue.value).toBe(100)
    })

    it('lazy execution', () => {
        const obj = reactive({
            foo: 100
        })

        const getter = jest.fn(() => {
            return obj.foo
        })

        const cValue = computed(getter)

        // just defie cValue, no reading it
        expect(getter).not.toHaveBeenCalledTimes

        // read cValue
        expect(cValue.value).toBe(100)
        expect(getter).toHaveBeenCalledTimes(1)

        // should not compute again while reading cValue again
        cValue.value
        expect(getter).toHaveBeenCalledTimes(1)   
        
        // should not compute unless read cValue
        obj.foo = 200
        expect(getter).toHaveBeenCalledTimes(1)

        // read cValue and compute
        expect(cValue.value).toBe(200)
        expect(getter).toHaveBeenCalledTimes(2)

        // should not compute
        cValue.value
        expect(getter).toHaveBeenCalledTimes(2)
    })
})