import { Activator } from '../../lib/activators/activator';

test('Should be enabled when it assigned true as default value', () => {
    const activator = new Activator("test", true);
    expect(activator.isEnabled()).toBeTruthy();
})