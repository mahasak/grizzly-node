import { Activator } from './activator';
import { DefaultActivator } from './defaultActivator';

export { Activator } from './activator';
export const defaultActivators: Array<Activator> = [
    new DefaultActivator()
]