// @ts-ignore
const hooks = wp.hooks

export const applyFilters = (hookName: string, value: any, ...args: any[]) => {
    return hooks.applyFilters(hookName, value, ...args)
}

export const addFilter = (hookName: string, namespace: string, callback: any, priority: number = 10) => {
    return hooks.addFilter(hookName, namespace, callback, priority)
}

export const removeFilter = (hookName: string, namespace: string) => {
    return hooks.removeFilter(hookName, namespace)
}

export const doAction = (hookName: string, ...args: any[]) => {
    return hooks.doAction(hookName, ...args)
}

export const addAction = (hookName: string, namespace: string, callback: any, priority: number = 10) => {
    return hooks.addAction(hookName, namespace, callback, priority)
}
