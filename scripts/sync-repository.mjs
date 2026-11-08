import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execute = promisify(execFile);
async function git(cwd, args) {
  const { stdout } = await execute('git', args, {
    cwd,
    timeout: 20000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });
  return stdout.trim();
}

export async function currentBranch(cwd) {
  return git(cwd, ['symbolic-ref', '--short', 'HEAD']);
}

export async function syncRepository(cwd, branch) {
  if ((await currentBranch(cwd)) !== branch) return { state: 'branch-changed' };
  if (await git(cwd, ['status', '--porcelain']))
    return { state: 'local-changes' };
  const remoteRef = `refs/remotes/origin/${branch}`;
  await git(cwd, [
    'fetch',
    '--no-tags',
    'origin',
    `refs/heads/${branch}:${remoteRef}`,
  ]);
  // Check again after network I/O, before modifying the checkout.
  if ((await currentBranch(cwd)) !== branch) return { state: 'branch-changed' };
  if (await git(cwd, ['status', '--porcelain']))
    return { state: 'local-changes' };
  const head = await git(cwd, ['rev-parse', 'HEAD']);
  const remote = await git(cwd, ['rev-parse', remoteRef]);
  if (head === remote) return { state: 'current' };
  const base = await git(cwd, ['merge-base', head, remote]);
  if (base !== head) return { state: 'local-commits' };
  const files = (await git(cwd, ['diff', '--name-only', head, remote])).split(
    '\n',
  );
  await git(cwd, ['merge', '--ff-only', remote]);
  return {
    state: 'updated',
    needsInstall: files.some((file) =>
      ['package.json', 'package-lock.json'].includes(file),
    ),
    revision: remote.slice(0, 7),
  };
}
