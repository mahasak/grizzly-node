import { Activator } from './activator';
import { Context } from '../interfaces/';

export class UserIdActivator extends Activator {
    constructor() {
        super('userId');
    }

    isEnabled(context: Context, parameters: any,) {
        const userIdList = parameters.userIds.split(/\s*,\s*/);
        return userIdList.includes(context.userId);
    }
}