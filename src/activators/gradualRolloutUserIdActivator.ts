import { Activator } from './activator';
import { Context } from '../interfaces/'; 
import { normalizedValue } from '../utils/';


export class GradualRolloutUserIdActivator extends Activator {
    constructor() {
        super('gradualRolloutUserId');
    }

    isEnabled(parameters: any, context: Context) {
        const userId = context.userId;
        if (!userId) {
            return false;
        }

        const percentage = Number(parameters.percentage);
        const groupId = parameters.groupId || '';

        const normalizedUserId = normalizedValue(userId, groupId);

        return percentage > 0 && normalizedUserId <= percentage;
    }
}