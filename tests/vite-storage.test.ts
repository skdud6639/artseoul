import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createServer as createHttpServer, request } from 'node:http';
import { createServer as createViteServer, resolveConfig } from 'vite';

const marker = 'ARTSEOUL_SYNTHETIC_PRIVATE_STORAGE_FIXTURE';
const fixture = `SQLite format 3\0${marker}`;

async function readSocket(socketPath: string, path: string) {
  return new Promise<{ status: number | undefined; body: string }>(
    (resolveResponse, reject) => {
      request({ socketPath, path, method: 'GET' }, (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.on('error', reject);
        response.on('end', () => {
          resolveResponse({
            status: response.statusCode,
            body: Buffer.concat(chunks).toString(),
          });
        });
      })
        .on('error', reject)
        .end();
    },
  );
}

await test('Vite cannot expose inquiry storage or standard secret files', async (context) => {
  const directory = await mkdtemp(join(tmpdir(), 'as-vite-'));
  const configFile = resolve('vite.config.ts');
  const originalDatabase = process.env.INQUIRY_DATABASE_PATH;
  try {
    for (const scenario of [
      {
        name: 'default storage',
        relative: '.data/inquiries.sqlite',
        explicit: false,
      },
      {
        name: 'custom filename',
        relative: 'private/consultations[2026].backup',
        explicit: true,
      },
    ]) {
      await context.test(scenario.name, async () => {
        const database = join(directory, scenario.relative);
        const sidecars = ['', '-wal', '-shm', '-journal'];
        await mkdir(dirname(database), { recursive: true });
        for (const suffix of sidecars) {
          await writeFile(database + suffix, fixture);
        }
        // An explicit empty value also overrides a developer's local .env.
        process.env.INQUIRY_DATABASE_PATH = scenario.explicit ? database : '';
        const configured = await resolveConfig(
          { root: directory, configFile, logLevel: 'silent' },
          'serve',
        );
        // Apply the real config's access rules without its API plugin, so the
        // test never opens a real database. Allow the fixture root explicitly
        // to ensure protection comes from deny rules, not an unrelated allowlist.
        const vite = await createViteServer({
          configFile: false,
          root: directory,
          cacheDir: join(directory, '.vite'),
          logLevel: 'silent',
          server: {
            middlewareMode: true,
            hmr: false,
            fs: { ...configured.server.fs, allow: [directory] },
          },
        });
        const server = createHttpServer(vite.middlewares);
        const socketPath = join(directory, 'test.sock');
        try {
          // A Unix socket keeps this test independent of the required app port.
          await new Promise<void>((resolveListening, reject) => {
            server.once('error', reject);
            server.listen(socketPath, resolveListening);
          });
          await writeFile(
            join(directory, 'public-check.txt'),
            'public fixture',
          );
          const publicFile = await readSocket(socketPath, '/public-check.txt');
          assert.equal(publicFile.status, 200);
          assert.equal(publicFile.body, 'public fixture');

          for (const suffix of sidecars) {
            for (const path of [
              `/${scenario.relative}${suffix}`,
              `/@fs${database}${suffix}`,
            ]) {
              for (const query of ['', '?raw']) {
                const response = await readSocket(
                  socketPath,
                  encodeURI(path) + query,
                );
                assert.equal(
                  response.status,
                  403,
                  `${path}${query} must be denied`,
                );
                assert.ok(
                  !response.body.includes(marker),
                  'private fixture must not be returned',
                );
                assert.ok(
                  !response.body.includes('SQLite format 3'),
                  'SQLite bytes must not be returned',
                );
              }
            }
          }

          for (const secret of [
            '.env',
            '.env.local',
            'private.pem',
            'private.crt',
            '.git/config',
          ]) {
            await mkdir(dirname(join(directory, secret)), { recursive: true });
            await writeFile(join(directory, secret), marker);
            for (const path of [
              `/${secret}`,
              `/@fs${join(directory, secret)}`,
            ]) {
              const response = await readSocket(socketPath, `${path}?raw`);
              assert.equal(
                response.status,
                403,
                `${secret} must remain denied`,
              );
              assert.ok(
                !response.body.includes(marker),
                'secret fixture must not be returned',
              );
            }
          }
        } finally {
          if (server.listening) {
            await new Promise<void>((resolveClosed, reject) => {
              server.close((error) =>
                error ? reject(error) : resolveClosed(),
              );
            });
          }
          await vite.close();
        }
      });
    }
  } finally {
    if (originalDatabase === undefined)
      delete process.env.INQUIRY_DATABASE_PATH;
    else process.env.INQUIRY_DATABASE_PATH = originalDatabase;
    await rm(directory, { recursive: true, force: true });
  }
});
