import { RemoteAddressActivator } from '../../lib/activators/remoteAddressActivator';

test('activator should have correct name', () => {
    const activator = new RemoteAddressActivator();

    expect(activator.name).toEqual('remoteAddress');
});

test('RemoteAddressActivator should not crash for missing params', () => {
    const activator = new RemoteAddressActivator();
    const params = {};
    const context = { remoteAddress: '123' };

    expect(activator.isEnabled(context, params)).toBeFalsy();
});

test('RemoteAddressActivator should be enabled for ip in list (localhost)', () => {
    const activator = new RemoteAddressActivator();
    const params = { IPs: '127.0.0.1' };
    const context = { remoteAddress: '127.0.0.1' };

    expect(activator.isEnabled(context, params)).toBeTruthy();
});

test('RemoteAddressActivator should not be enabled for ip NOT in list', () => {
    const activator = new RemoteAddressActivator();
    const params = { IPs: '127.0.1.1, 127.0.1.2, 127.0.1.3' };
    const context = { remoteAddress: '127.0.1.5' };

    expect(activator.isEnabled(context, params)).toBeFalsy();
});

test('RemoteAddressActivator should be enabled for ip in list', () => {
    const activator = new RemoteAddressActivator();
    const params = { IPs: '127.0.1.1, 127.0.1.2,127.0.1.3' };
    const context = { remoteAddress: '127.0.1.2' };

    expect(activator.isEnabled(context, params)).toBeTruthy();
});

test('RemoteAddressActivator should be enabled for ip inside range in a list', () => {
    const activator = new RemoteAddressActivator();
    const params = { IPs: '127.0.1.1, 127.0.1.2,127.0.1.3, 160.33.0.0/16' };
    const context = { remoteAddress: '160.33.0.33' };

    expect(activator.isEnabled(context, params)).toBeTruthy();
});

test('RemoteAddressActivator should handle invalid IPs', () => {
    const activator = new RemoteAddressActivator();
    const params = { IPs: '127.invalid' };
    const context = { remoteAddress: '127.0.0.1' };

    expect(activator.isEnabled(context, params)).toBeFalsy();
});

test('RemoteAddressActivator should ignore invalid IPs', () => {
    const activator = new RemoteAddressActivator();
    const params = { IPs: '127.0.0.2, 127.invalid, 127.0.0.1' };
    const context = { remoteAddress: '127.0.0.1' };

    expect(activator.isEnabled(context, params)).toBeTruthy();
});