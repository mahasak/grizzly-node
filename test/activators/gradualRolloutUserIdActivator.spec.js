import { GradualRolloutUserIdActivator } from '../../lib/activators/gradualRolloutUserIdActivator';
import { normalizedValue } from '../../lib/utils/';

test('gradual-rollout-user-id Activator should have correct name', () => {
    const activator = new GradualRolloutUserIdActivator();

    expect(activator.name).toEqual('gradualRolloutUserId');
});

test('should be enabled when percentage is 100', () => {
    const activator = new GradualRolloutUserIdActivator();
    const params = { percentage: '100', groupId: 'gr1' };
    const context = { userId: '123' };

    expect(activator.isEnabled(params, context)).toBeTruthy();
});

test('should be disabled when percentage is 0', () => {
    const activator = new GradualRolloutUserIdActivator();
    const params = { percentage: '0', groupId: 'gr1' };
    const context = { userId: '123' };

    expect(activator.isEnabled(params, context)).toBeFalsy();
});

test('should be enabled when percentage is exactly same', () => {
    const activator = new GradualRolloutUserIdActivator();
    const userId = '123123';
    const groupId = 'group1';

    const percentage = normalizedValue(userId, groupId);
    const params = { percentage: `${percentage}`, groupId };
    const context = { userId };

    expect(activator.isEnabled(params, context)).toBeTruthy();
});

test('should be disabled when percentage is just below required value', () => {
    const activator = new GradualRolloutUserIdActivator();
    const userId = '123123';
    const groupId = 'group1';

    const percentage = normalizedValue(userId, groupId) - 1;
    const params = { percentage: `${percentage}`, groupId };
    const context = { userId };

    expect(activator.isEnabled(params, context)).toBeFalsy();
});

test('should only at most miss by one percent', () => {
    const activator = new GradualRolloutUserIdActivator();

    const percentage = 10;
    const groupId = 'groupId';

    const rounds = 200000;
    let enabledCount = 0;

    for (let i = 0; i < rounds; i++) {
        let params = { percentage, groupId };
        let context = { userId: i };
        if (activator.isEnabled(params, context)) {
            enabledCount++;
        }
    }
    const actualPercentage = Math.round((enabledCount / rounds) * 100);
    const highMark = percentage + 1;
    const lowMark = percentage - 1;

    expect(lowMark <= actualPercentage).toBeTruthy();
    expect(highMark >= actualPercentage).toBeTruthy();
});