import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
import test from 'node:test';
import { syncRepository } from './sync-repository.mjs';

function git(cwd, ...args) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'artseoul-sync-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const remote = join(root, 'remote.git');
  const producer = join(root, 'producer');
  const consumer = join(root, 'consumer');
  git(root, 'init', '--bare', '--initial-branch=main', remote);
  git(root, 'clone', remote, producer);
  git(producer, 'config', 'user.name', 'Sync Test');
  git(producer, 'config', 'user.email', 'sync@example.test');
  await writeFile(join(producer, 'source.txt'), 'original');
  await writeFile(join(producer, 'package.json'), '{}\n');
  git(producer, 'add', '.');
  git(producer, 'commit', '-m', 'Initial');
  git(producer, 'push', 'origin', 'main');
  git(root, 'clone', remote, consumer);
  git(consumer, 'config', 'user.name', 'Sync Test');
  git(consumer, 'config', 'user.email', 'sync@example.test');
  async function publish(file = 'source.txt', content = 'updated') {
    await writeFile(join(producer, file), content);
    git(producer, 'add', file);
    git(producer, 'commit', '-m', 'Update');
    git(producer, 'push', 'origin', 'main');
  }
  return { producer, consumer, publish };
}

test('fast-forwards a clean checkout to the new remote commit', async (t) => {
  const { producer, consumer, publish } = await fixture(t);
  await publish();
  assert.equal((await syncRepository(consumer, 'main')).state, 'updated');
  assert.equal(
    git(consumer, 'rev-parse', 'HEAD'),
    git(producer, 'rev-parse', 'HEAD'),
  );
  assert.equal(await readFile(join(consumer, 'source.txt'), 'utf8'), 'updated');
  assert.equal((await syncRepository(consumer, 'main')).state, 'current');
});

test('preserves unsaved local work without merging', async (t) => {
  const { consumer, publish } = await fixture(t);
  await publish();
  const before = git(consumer, 'rev-parse', 'HEAD');
  await writeFile(join(consumer, 'source.txt'), 'local work');
  assert.equal((await syncRepository(consumer, 'main')).state, 'local-changes');
  assert.equal(git(consumer, 'rev-parse', 'HEAD'), before);
  assert.equal(
    await readFile(join(consumer, 'source.txt'), 'utf8'),
    'local work',
  );
});

test('does not merge divergent local commits', async (t) => {
  const { consumer, publish } = await fixture(t);
  await writeFile(join(consumer, 'local.txt'), 'local commit');
  git(consumer, 'add', '.');
  git(consumer, 'commit', '-m', 'Local work');
  const before = git(consumer, 'rev-parse', 'HEAD');
  await publish();
  assert.equal((await syncRepository(consumer, 'main')).state, 'local-commits');
  assert.equal(git(consumer, 'rev-parse', 'HEAD'), before);
});

test('detects dependency updates for reinstallation', async (t) => {
  const { consumer, publish } = await fixture(t);
  await publish('package.json', '{"private":true}\n');
  const result = await syncRepository(consumer, 'main');
  assert.equal(result.state, 'updated');
  assert.equal(result.needsInstall, true);
});

test('does not update a checkout whose branch has changed', async (t) => {
  const { consumer, publish } = await fixture(t);
  await publish();
  git(consumer, 'switch', '-c', 'local-work');
  assert.equal(
    (await syncRepository(consumer, 'main')).state,
    'branch-changed',
  );
});
