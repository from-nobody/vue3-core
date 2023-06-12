import { getCurrentInstance } from "./component";

export function provide (key, value) {
    const currentInstance: any = getCurrentInstance()
    console.log(currentInstance)
    if (currentInstance) {
        const { providers } = currentInstance 
        providers[key] = value
    }
}


export function inject (key) {
    const currentInstance: any = getCurrentInstance()
    if (currentInstance) {
        const { parent } = currentInstance
        return parent.providers[key]
    }
}