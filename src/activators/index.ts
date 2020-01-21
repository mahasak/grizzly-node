import { Activator } from './activator';
import { DefaultActivator } from './defaultActivator';
import { HostnameActivator } from './hostnameActivator'
export { Activator } from './activator';
export const defaultActivators: Array<Activator> = [
    new DefaultActivator()
]