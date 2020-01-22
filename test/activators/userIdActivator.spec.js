import { UserIdActivator } from '../../lib/activators/userIdActivator';

test('default activator should have correct name', () => {
    const activator = new UserIdActivator();

    expect(activator.name).toEqual('userId');
});

test('user-with-id-activator should be enabled for userId', () => {
    const activator = new UserIdActivator();
    const params = { userIds: '123' };
    const context = { userId: '123' };
    expect(activator.isEnabled(context, params)).toBeTruthy();
});

test('user-with-id-activator should be enabled for userId in list (spaced commas)', () => {
    const activator = new UserIdActivator();
    const params = { userIds: '123, 122, 12312312' };
    const context = { userId: '12312312' };
    expect(activator.isEnabled(context, params)).toBeTruthy();
});

test('user-with-id-activator should not be enabled for userId NOT in list', () => {
    const activator = new UserIdActivator();
    const params = { userIds: '123, 122, 122' };
    const context = { userId: '12' };
    expect(activator.isEnabled(context, params)).toBeFalsy();
});

test('user-with-id-activator should be enabled for userId in list', () => {
    const activator = new UserIdActivator();
    const params = { userIds: '123,122,12312312' };
    const context = { userId: '122' };
    expect(activator.isEnabled(context, params)).toBeTruthy();
});