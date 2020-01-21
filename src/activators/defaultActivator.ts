import { Activator } from './activator'

export class DefaultActivator extends Activator {
    constructor() {
        super('default');
    }

    isEnabled() {
        return true;
    }
}