import { Activator } from '../../lib/activators/activator';

test('Should be enabled when it assigned true as default value', () => {
    const activator = new Activator("test", true);
    
    expect(activator.isEnabled()).toBeTruthy();
})

test('should be enabled for environment=dev', () => {
    const activator = new Activator('test', true);
    const params = {};
    const conditions = [{ contextName: 'environment', operator: 'IN', values: ['stage', 'dev'] }];
    const context = { environment: 'dev' };

    expect(activator.isEnabledWithConditions(context, conditions, params)).toBeTruthy();
});

test('should NOT be enabled for environment=prod', () => {
    const activator = new Activator('test', true);
    const params = {};
    const conditions = [{ contextName: 'environment', operator: 'IN', values: ['dev'] }];
    const context = { environment: 'prod' };

    expect(activator.isEnabledWithConditions(context, conditions, params)).toBeFalsy();
});

test('should NOT be enabled for environment=prod AND userId=123', () => {
    const activator = new Activator('test', true);
    const params = {};
    const conditions = [
        { contextName: 'environment', operator: 'IN', values: ['dev'] },
        { contextName: 'userId', operator: 'IN', values: ['123'] },
    ];
    const context = { environment: 'prod', userId: '123' };

    expect(activator.isEnabledWithConditions(context, conditions, params)).toBeFalsy();
});

test('should NOT be enabled for environment=dev and activator return false', () => {
    const activator = new Activator('test', false);
    const params = {};
    const conditions = [{ contextName: 'environment', operator: 'IN', values: ['dev'] }];
    const context = { environment: 'dev', userId: '123' };

    expect(activator.isEnabledWithConditions(context, conditions, params)).toBeFalsy();
});

test('should be enabled when conditions is empty list', () => {
    const activator = new Activator('test', true);
    const params = {};
    const conditions = [];
    const context = { environment: 'dev', userId: '123' };

    expect(activator.isEnabledWithConditions(context, conditions, params)).toBeTruthy();
});

test('should be enabled when conditions is undefined', () => {
    const activator = new Activator('test', true);
    const params = {};
    const conditions = undefined;
    const context = { environment: 'dev', userId: '123' };
    expect(activator.isEnabledWithConditions(context, conditions, params)).toBeTruthy();
});

test('should be enabled when environment NOT_IN constaints', () => {
    const activator = new Activator('test', true);
    const params = {};
    const conditions = [
        { contextName: 'environment', operator: 'NOT_IN', values: ['dev', 'stage'] },
    ];
    const context = { environment: 'local', userId: '123' };

    expect(activator.isEnabledWithConditions(context, conditions, params)).toBeTruthy();
});

test('should not enabled for multiple conditions where last one is not satisfied', () => {
    const activator = new Activator('test', true);
    const params = {};
    const conditions = [
        { contextName: 'environment', operator: 'NOT_IN', values: ['dev', 'stage'] },
        { contextName: 'environment', operator: 'IN', values: ['prod'] },
    ];
    const context = { environment: 'local', userId: '123' };
    
    expect(activator.isEnabledWithConditions(context, conditions, params)).toBeFalsy();
});

test('should enabled for multiple conditions where all are satisfied', () => {
    const activator = new Activator('test', true);
    const params = {};
    const conditions = [
        { contextName: 'environment', operator: 'NOT_IN', values: ['dev', 'stage'] },
        { contextName: 'environment', operator: 'IN', values: ['prod'] },
        { contextName: 'userId', operator: 'IN', values: ['123', '223'] },
        { contextName: 'appName', operator: 'IN', values: ['web'] },
    ];
    const context = { environment: 'prod', userId: '123', appName: 'web' };
    
    expect(activator.isEnabledWithConditions(context, conditions, params)).toBeTruthy();
});

test('should be enabled when cosutomerId is in constraint', () => {
    const activator = new Activator('test', true);
    const params = {};
    const conditions = [
        { contextName: 'environment', operator: 'IN', values: ['dev', 'stage'] },
        { contextName: 'customer', operator: 'IN', values: ['12', '13'] },
    ];
    const context = {
        environment: 'dev',
        properties: { customer: '13' },
    };

    expect(activator.isEnabledWithConditions(context, conditions, params)).toBeTruthy();
});