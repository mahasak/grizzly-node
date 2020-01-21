import { hostname } from 'os';

import { HostnameActivator } from '../../lib/activators/hostnameActivator';

test('activator should have correct name', () => {
    const activator = new HostnameActivator();

    expect(activator.name).toEqual('hostname');
});

test('activator should be disabled when no hostname defined', () => {
    const activator = new HostnameActivator();
    const context = { hostNames: '' };

    expect(activator.isEnabled(context)).toBeFalsy();
});

test('activator should be enabled when hostname is defined', () => {
    process.env.HOSTNAME = '';
    const activator = new HostnameActivator();
    const context = { hostNames: hostname() };

    expect(activator.isEnabled(context)).toBeTruthy();
});

test('activator should be enabled when hostname is defined in list', () => {
    process.env.HOSTNAME = '';
    const activator = new HostnameActivator();
    const context = { hostNames: `localhost, ${hostname()}` };

    expect(activator.isEnabled(context));
});

test('activator should be enabled when hostname is defined via env', () => {
    process.env.HOSTNAME = 'some-random-name';
    const activator = new HostnameActivator();
    const context = { hostNames: 'localhost, some-random-name' };

    expect(activator.isEnabled(context));
});

test('activator should handle wierd casing', () => {
    process.env.HOSTNAME = 'some-random-NAME';
    const activator = new HostnameActivator();
    const context = { hostNames: 'localhost, some-random-name' };
    
    expect(activator.isEnabled(context)).toBeTruthy();
});