import { Activator } from './activator';
import { normalizedValue } from '../utils/';
import { Context } from '../interfaces';

export class GradualRolloutSessionIdActivator extends Activator {
    constructor() {
        super('gradualRolloutSessionId');
    }

    isEnabled(parameters: any, context: Context) {
        const sessionId = context.sessionId;
        if (!sessionId) {
            return false;
        }

        const percentage = Number(parameters.percentage);
        const groupId = parameters.groupId || '';

        const normalizedId = normalizedValue(sessionId, groupId);

        return percentage > 0 && normalizedId <= percentage;
    }
}