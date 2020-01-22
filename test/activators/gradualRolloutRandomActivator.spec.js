import { GradualRolloutRandomActivator } from '../../lib/activators/gradualRolloutRandomActivator';

test('should have correct name', () => {
    const activator = new GradualRolloutRandomActivator();

    expect(activator.name).toEqual('gradualRolloutRandom');
});

test('should only at most miss by one percent', () => {
    const activator = new GradualRolloutRandomActivator();

    const percentage = 25;
    const groupId = 'groupId';

    const rounds = 200000;
    let enabledCount = 0;

    for (let i = 0; i < rounds; i++) {
        let params = { percentage, groupId };
        let context = { sessionId: i };
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

test('should be disabled when percentage is lower than random', () => {
    const activator = new GradualRolloutRandomActivator(() => 50);
    let params = { percentage: '20', groupId: 'test' };

    expect(activator.isEnabled(params)).toBeFalsy();
});

test('should be disabled when percentage=0', () => {
    const activator = new GradualRolloutRandomActivator(() => 1);
    let params = { percentage: '0', groupId: 'test' };

    expect(activator.isEnabled(params)).toBeFalsy();
});

test('should be disabled when percentage=0 and random is not zero', () => {
    const activator = new GradualRolloutRandomActivator(() => 50);
    let params = { percentage: '0', groupId: 'test' };

    expect(activator.isEnabled(params)).toBeFalsy();
});

test('should be enabled when percentage is greater than random', () => {
    const activator = new GradualRolloutRandomActivator(() => 10);
    let params = { percentage: '20', groupId: 'test' };

    expect(activator.isEnabled(params)).toBeTruthy();
});

test('should be enabled when percentage=100', () => {
    const activator = new GradualRolloutRandomActivator(() => 90);
    let params = { percentage: '100', groupId: 'test' };

    expect(activator.isEnabled(params)).toBeTruthy();
});

test('should be enabled when percentage and random are the same', () => {
    const activator = new GradualRolloutRandomActivator(() => 55);
    let params = { percentage: '55', groupId: 'test' };

    expect(activator.isEnabled(params)).toBeTruthy();
});