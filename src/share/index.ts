export const extend = Object.assign

export const isObject = (raw) => {
    return raw !== null && typeof raw === 'object'
}

export const isOnEvent = (key: string) => /^on[A-Z]/.test(key)