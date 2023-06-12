export const extend = Object.assign

export const isObject = (raw) => {
    return raw !== null && typeof raw === 'object'
}

export const isOnEvent = (key: string) => /^on[A-Z]/.test(key)

export const hasItInside = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

export const toHandlerKey = (str: string) => {
    return str ? 'on' + capitalize(str) : ''
} 
const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const camelize = (str: string) => {
    return str.replace(/-(\w)/g, (_, c: string) => {
        return c ? c.toUpperCase() : ''
    })
}