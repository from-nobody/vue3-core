import { ReactiveEffect } from "./effect"

class ComputedRefImpl {
    private _effect
    private _value
    private _dirty: boolean = false

    constructor(getter) {
        this._effect = new ReactiveEffect(getter, () => {
            this._dirty = false
        })
    }

    get value() {
        if (!this._dirty) { 
            this._value = this._effect.run()
            this._dirty = true
        }
        
        return this._value
    }
}


export function computed (getter) {
    return new ComputedRefImpl(getter)
} 