import { DefaultActivator } from '../../lib/activators/defaultActivator'

test('default strategy should be enabled', () => {
    const activator = new DefaultActivator();

    expect(activator.isEnabled()).toBeTruthy();
});

test('default strategy should have correct name', () => {
    const activator = new DefaultActivator();

    expect(activator.name).toEqual('default');
});