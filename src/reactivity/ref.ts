import { isObject } from "../share"
import { trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"

class RefImpl {
    
    private _value: any
    public dep
    private _RawValue: any
    public _v_isRef = true
    
    constructor (raw) {
        this._value = convert(raw)
        this._RawValue = raw
        this.dep = new Set()
    }

    get value() {
        trackEffects(this.dep)
        return this._value
    }

    set value(newValue) {
        if (Object.is(newValue, this._RawValue)) return
        this._RawValue = newValue
        this._value = convert(newValue)
        triggerEffects(this.dep)
    }
} 

function convert (value) {
    return isObject(value) ? reactive(value) : value
}

export function ref (raw) {
    const _Ref = new RefImpl(raw)
    return _Ref
}

export function isRef (value) {
    return !!value._v_isRef
} 

export function unRef (raw) {
    return isRef(raw) ? raw.value : raw
}