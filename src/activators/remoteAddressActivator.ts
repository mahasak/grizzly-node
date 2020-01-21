import { Activator } from './activator';
import { Context } from '../interfaces/';
import * as ip from 'ip';

export class RemoteAddressActivator extends Activator {
    constructor() {
        super('remoteAddress');
    }

    isEnabled(context: Context, parameters: any, ) {
        if (!parameters.IPs) {
            return false;
        }

        const remoteAddr = context?.remoteAddress?.toString() ?? '';

        for (const range of parameters.IPs.split(/\s*,\s*/)) {
            try {
                if (range === context.remoteAddress) {
                    return true;
                } else if (!ip.isV6Format(range)) {
                    if (ip.cidrSubnet(range).contains(remoteAddr)) {
                        return true;
                    }
                }
            } catch (e) {
                continue;
            }
        }
        return false;
    }
}