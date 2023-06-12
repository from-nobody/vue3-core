import { getCurrentInstance } from "./component";


export function provide (key, value) {
    const currentInstance: any = getCurrentInstance()
    if (currentInstance) {
        let { providers } = currentInstance 
        
        const parentProviders = currentInstance.parent?.providers

        if (parentProviders === providers) {
            providers = currentInstance.providers = Object.create(parentProviders)
        }
        
        providers[key] = value
    }
}


export function inject (key, defaultValue) {
    const currentInstance: any = getCurrentInstance()
    if (currentInstance) {
        const { parent } = currentInstance

        const parentProviders = parent.providers

        if (key in parentProviders) {
            return parentProviders[key]
        } else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue()
            }
            return defaultValue
        }  
    }
}