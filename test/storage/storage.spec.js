import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { Storage } from '../../lib/storage/';
import * as mkdirp from 'mkdirp';

function setup(name) {
    const tmp = join(tmpdir(), name + Math.round(10000 * Math.random()));
    mkdirp.sync(tmp);
    const storage = new Storage({ backupPath: tmp, appName: 'test' });

    storage.on('error', err => {
        throw err;
    });
    return storage;
}

test('should load content from backup file', () =>
    new Promise((resolve, reject) => {
        const tmp = join(tmpdir(), 'backup-file-test');
        mkdirp.sync(tmp);
        const storage = new Storage({ backupPath: tmp, appName: 'test' });
        const data = { random: Math.random() };
        storage.on('error', reject);

        storage.once('persisted', () => {
            expect(storage.get('random')).toEqual(data.random);

            const storage2 = new Storage({ backupPath: tmp, appName: 'test' });
            storage2.on('error', reject);
            storage2.on('ready', () => {
                expect(storage2.get('random') === data.random).toBeTruthy();
                resolve();
            });
        });
        storage.reset(data);
    }));

test('should handle complex appNames', () =>
    new Promise((resolve, reject) => {
        const tmp = join(tmpdir(), 'backup-file-test');
        mkdirp.sync(tmp);
        const appName = '@namspace-dash/slash-some-app';
        const storage = new Storage({ backupPath: tmp, appName });
        const data = { random: Math.random() };
        storage.on('error', reject);

        storage.once('persisted', () => {
            expect(storage.get('random') === data.random).toBeTruthy();

            const storage2 = new Storage({ backupPath: tmp, appName });
            storage2.on('error', reject);
            storage2.on('ready', () => {
                expect(storage2.get('random') === data.random).toBeTruthy();
                resolve();
            });
        });
        storage.reset(data);
    }));

test('should emit error when non-existent target backupPath', () => {
    const storage = new Storage({
        backupPath: join(tmpdir(), `random-${Math.round(Math.random() * 10000)}`),
        appName: 'test',
    });
    storage.reset({ random: Math.random() });

    return new Promise((resolve, reject) => {
        storage.on('error', err => {
            expect.assertions(2)
            expect(err).toBeTruthy();
            expect(err.code).toEqual('ENOENT');
            resolve();
        });
    });
});

test('should emit error when stored data is invalid', () => {
    const dir = join(tmpdir(), `random-${Math.round(Math.random() * 10123000)}`);
    mkdirp.sync(dir);
    writeFileSync(join(dir, 'experiment-repo-schema-v1-test.json'), '{invalid: json, asd}', 'utf8');
    const storage = new Storage({
        backupPath: dir,
        appName: 'test',
    });
    storage.on('persisted', console.log);
    return new Promise((resolve, reject) => {

        storage.on('error', err => {
            expect(err).toBeTruthy();
            expect(err.message).toContain('Unexpected token');
            resolve();
        });
    })
});

test('should not write content from backup file if ready has been fired', () =>
    new Promise((resolve, reject) => {
        const tmp = join(tmpdir(), 'ignore-backup-file-test');
        mkdirp.sync(tmp);
        const storage = new Storage({
            backupPath: tmp,
            appName: 'test',
        });
        const data = { random: Math.random() };
        storage.on('error', reject);

        storage.once('persisted', () => {
            expect(storage.get('random')).toEqual(data.random);

            const storage2 = new Storage({
                backupPath: tmp,
                appName: 'test',
            });
            const overwrite = { random: Math.random() };

            storage2.on('error', reject);
            storage2.on('ready', () => {
                expect(storage2.get('random') !== data.random).toBeTruthy();
                expect(storage2.get('random')).toEqual(overwrite.random);
                resolve();
            });

            // Lets pretend "server" finished read first
            storage2.reset(overwrite);
        });
        storage.reset(data);
    }));

test('should provide Get method from data', () => {
    const storage = setup('get-method');
    const result = storage.get('some-key');

    expect(result).toEqual(undefined);

    storage.reset({ 'some-key': 'some-value' });

    const result2 = storage.get('some-key');

    expect(result2).toEqual('some-value');
});

test('should provide getAll method for data object', () => {
    const storage = setup('get-all-method');
    const result = storage.getAll();

    expect(result).toEqual({});

    storage.reset({ 'some-key': 'some-value' });

    const result2 = storage.getAll();

    expect(result2).toEqual({ 'some-key': 'some-value' });
});

test('should persist data on reset', () =>
    new Promise(resolve => {
        const storage = setup('persist');
        const data = { random: Math.random() };

        storage.once('persisted', () => {
            expect(storage.get('random')).toEqual(data.random);
            resolve();
        });

        expect(storage.get('random') !== data.random).toBeTruthy();
        storage.reset(data);
        expect(storage.get('random')).toEqual(data.random);
    }));

test('should persist again after data reset', () =>
    new Promise(resolve => {
        const storage = setup('persist2');
        const data = { random: Math.random() };

        storage.once('persisted', () => {
            expect(storage.get('random')).toEqual(data.random);
            const data2 = { random: Math.random() };

            storage.once('persisted', () => {
                expect(storage.get('random')).toEqual(data2.random);
                resolve();
            });

            storage.reset(data2);
        });

        expect(storage.get('random') !== data.random).toBeTruthy();
        storage.reset(data);
        expect(storage.get('random')).toEqual(data.random);
    }));