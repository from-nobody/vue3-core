import { effect } from "../effect";
import { ref } from "../ref";


describe('ref', () => {
    it('basic primitive', () => {
        const a = ref(0)
        expect(a.value).toBe(0)
    })

    it('reactive', () => {
        let foo 
        const a = ref(1)
        let count = 0

        effect(() => {
            count++
            foo = a.value
        })

        expect(count).toBe(1)
        expect(foo).toBe(1)

        a.value = 2
        expect(count).toBe(2)
        expect(foo).toBe(2)

        // if assign a same value, won't trigger effect 
        a.value = 2
        expect(count).toBe(2)
        expect(foo).toBe(2)
    })

    it('ref a object type', () => {
        const fun = ref({
            foo: 0
        })

        let bar

        effect(() => {
            bar = fun.value.foo
        })

        expect(fun.value.foo).toBe(0)

        fun.value.foo = 100
        expect(fun.value.foo).toBe(100)
    })
})