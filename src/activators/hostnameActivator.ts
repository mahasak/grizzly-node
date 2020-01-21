import { Activator } from './activator';
import { hostname } from 'os';

export class HostnameActivator extends Activator {
    private hostname: string;

    constructor() {
        super('hostname');
        this.hostname = (process.env.HOSTNAME || hostname() || 'undefined').toLowerCase();
    }

    isEnabled(parameters: any) {
        if (!parameters.hostNames) {
            return false;
        }

        return parameters.hostNames
            .toLowerCase()
            .split(/\s*,\s*/)
            .includes(this.hostname);
    }
}