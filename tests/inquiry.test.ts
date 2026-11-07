import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { createInquiryApp } from '../server/app.ts';
import { readInquiryConfig } from '../server/config.ts';
import type { ServerConfig } from '../server/config.ts';
import type { InquiryInput } from '../shared/inquiry.ts';

const token = 'test-only-' + 'a'.repeat(40);
const config: ServerConfig = {
  enabled: true,
  operator: '테스트 운영자',
  privacyContact: 'privacy@example.test',
  retentionDays: 30,
  adminToken: token,
  allowedOrigin: '',
};
const payload: InquiryInput = {
  company: '테스트 기업',
  name: '테스트 담당자',
  email: 'sample@example.test',
  phone: '',
  region: '서울',
  service: 'rental',
  space: 'office',
  budget: '상담 후 결정',
  timing: '다음 분기',
  message: '작품 두 점 상담',
  artworkIds: ['art-01', 'art-02'],
  consent: true,
  website: '',
};

async function start(
  databasePath: string,
  overrides: Partial<Parameters<typeof createInquiryApp>[0]> = {},
) {
  const instance = createInquiryApp({ config, databasePath, ...overrides });
  const server = await new Promise<Server>((resolve) => {
    const running = instance.app.listen(0, '127.0.0.1', () => resolve(running));
  });
  const address = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${address.port}`,
    async close() {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
      instance.close();
    },
  };
}

async function json(response: Response): Promise<Record<string, unknown>> {
  const body: unknown = await response.json();
  assert.equal(typeof body, 'object');
  assert.ok(body !== null && !Array.isArray(body));
  return body as Record<string, unknown>;
}

function submit(url: string, body: unknown = payload, key = randomUUID()) {
  return fetch(url + '/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify(body),
  });
}

const adminHeaders = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

await test('inquiry is persisted, duplicate-safe, private, and can be triaged', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'artseoul-inquiry-'));
  const path = join(directory, 'records.sqlite');
  let api = await start(path);
  try {
    const key = randomUUID();
    const first = await submit(api.url, payload, key);
    assert.equal(first.status, 201);
    const receipt = await json(first);
    assert.match(String(receipt.id), /^AS-[0-9a-f-]{36}$/);
    assert.equal(receipt.company, undefined);
    assert.equal(receipt.email, undefined);
    const repeat = await submit(api.url, payload, key);
    assert.equal(repeat.status, 200);
    assert.deepEqual(await json(repeat), receipt);
    const conflict = await submit(
      api.url,
      { ...payload, company: '다른 기업' },
      key,
    );
    assert.equal(conflict.status, 409);

    const unauthorized = await fetch(api.url + '/api/admin/inquiries');
    assert.equal(unauthorized.status, 401);
    const unauthText = await unauthorized.text();
    assert.ok(!unauthText.includes(payload.email));
    assert.equal(
      (await fetch(api.url + '/api/inquiries/' + String(receipt.id))).status,
      404,
    );
    const metadata = await json(await fetch(api.url + '/api/inquiry-config'));
    assert.equal(metadata.enabled, true);
    assert.equal(metadata.adminToken, undefined);
    assert.ok(!JSON.stringify(metadata).includes(token));

    await api.close();
    api = await start(path);
    const listResponse = await fetch(api.url + '/api/admin/inquiries', {
      headers: adminHeaders,
    });
    assert.equal(listResponse.status, 200);
    assert.equal(listResponse.headers.get('cache-control'), 'no-store');
    const list = await json(listResponse);
    assert.ok(Array.isArray(list.inquiries));
    assert.equal(list.inquiries.length, 1);
    const record = list.inquiries[0] as Record<string, unknown>;
    assert.equal(record.id, receipt.id);
    assert.equal(record.company, payload.company);
    assert.deepEqual(record.artworkIds, payload.artworkIds);
    assert.equal(
      Date.parse(String(record.expiresAt)) -
        Date.parse(String(record.createdAt)),
      30 * 86400000,
    );

    const patch = await fetch(
      api.url + '/api/admin/inquiries/' + String(receipt.id),
      {
        method: 'PATCH',
        headers: adminHeaders,
        body: JSON.stringify({ stage: 'proposed', notes: '배치안 전달 예정' }),
      },
    );
    assert.equal(patch.status, 200);
    const updated = (await json(patch)).inquiry as Record<string, unknown>;
    assert.equal(updated.stage, 'proposed');
    assert.equal(updated.notes, '배치안 전달 예정');
    assert.equal(
      (
        await fetch(api.url + '/api/admin/inquiries/' + String(receipt.id), {
          method: 'PATCH',
          headers: adminHeaders,
          body: JSON.stringify({ stage: 'arbitrary-state' }),
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await fetch(api.url + '/api/admin/inquiries/' + String(receipt.id), {
          method: 'DELETE',
          headers: adminHeaders,
        })
      ).status,
      204,
    );
    const empty = await json(
      await fetch(api.url + '/api/admin/inquiries', { headers: adminHeaders }),
    );
    assert.deepEqual(empty.inquiries, []);
  } finally {
    await api.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

await test('missing contacts, consent, unknown artwork, and bot fields never save', async () => {
  const api = await start(':memory:');
  try {
    const badInputs = [
      { ...payload, email: '', phone: '' },
      { ...payload, consent: false },
      { ...payload, artworkIds: ['unlisted-art'] },
      { ...payload, service: 'investment' },
      { ...payload, space: 'unknown' },
      { ...payload, company: '' },
      { ...payload, website: 'spam' },
      { ...payload, email: 'not-an-email' },
      { ...payload, message: 'a'.repeat(2001) },
      { ...payload, name: 1234 },
    ];
    for (const input of badInputs) {
      assert.equal((await submit(api.url, input)).status, 400);
    }
    assert.equal(
      (
        await fetch(api.url + '/api/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': randomUUID(),
            Origin: 'https://untrusted.example',
          },
          body: JSON.stringify(payload),
        })
      ).status,
      403,
    );
    const list = await json(
      await fetch(api.url + '/api/admin/inquiries', { headers: adminHeaders }),
    );
    assert.deepEqual(list.inquiries, []);
    const phoneOnly = await submit(api.url, {
      ...payload,
      email: '',
      phone: '010-1234-5678',
    });
    assert.equal(phoneOnly.status, 201);
  } finally {
    await api.close();
  }
});

await test('default setup fails closed and an absent admin credential grants no access', async () => {
  const disabled = readInquiryConfig({});
  assert.equal(disabled.enabled, false);
  const api = await start(':memory:', { config: disabled });
  try {
    assert.equal((await submit(api.url)).status, 503);
    assert.equal(
      (await fetch(api.url + '/api/admin/inquiries', { headers: adminHeaders }))
        .status,
      401,
    );
    const metadata = await json(await fetch(api.url + '/api/inquiry-config'));
    assert.equal(metadata.retentionDays, null);
    assert.equal(metadata.enabled, false);
    assert.equal(
      readInquiryConfig({
        INQUIRY_ENABLED: 'true',
        INQUIRY_OPERATOR: '사업자',
        INQUIRY_PRIVACY_CONTACT: 'not-valid',
        INQUIRY_RETENTION_DAYS: '30',
        ADMIN_TOKEN: token,
      }).enabled,
      false,
    );
  } finally {
    await api.close();
  }
});

await test('rate limits and retention are enforced on the server', async () => {
  let timestamp = new Date('2026-11-07T00:00:00Z');
  const api = await start(':memory:', {
    now: () => timestamp,
    rateLimitMax: 2,
  });
  try {
    assert.equal((await submit(api.url)).status, 201);
    assert.equal((await submit(api.url)).status, 201);
    const limited = await submit(api.url);
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get('Retry-After'), '900');
    timestamp = new Date('2026-12-08T00:00:00Z');
    const list = await json(
      await fetch(api.url + '/api/admin/inquiries', { headers: adminHeaders }),
    );
    assert.deepEqual(list.inquiries, []);
    assert.equal((await submit(api.url)).status, 201);
  } finally {
    await api.close();
  }
});

await test('changing retention settings does not extend previously promised retention', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'artseoul-retention-'));
  const path = join(directory, 'records.sqlite');
  let api = await start(path, { now: () => new Date('2026-11-07T00:00:00Z') });
  try {
    assert.equal((await submit(api.url)).status, 201);
    await api.close();
    api = await start(path, {
      config: { ...config, retentionDays: 365 },
      now: () => new Date('2026-12-08T00:00:00Z'),
    });
    const list = await json(
      await fetch(api.url + '/api/admin/inquiries', { headers: adminHeaders }),
    );
    assert.deepEqual(list.inquiries, []);
  } finally {
    await api.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

await test('forwarded IP spoofing is ignored unless the connecting proxy is trusted', async () => {
  async function forwardedSubmit(url: string, client: string) {
    return fetch(url + '/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': randomUUID(),
        'X-Forwarded-For': client,
      },
      body: JSON.stringify(payload),
    });
  }
  const direct = await start(':memory:', { rateLimitMax: 1 });
  try {
    assert.equal(
      (await forwardedSubmit(direct.url, '198.51.100.10')).status,
      201,
    );
    assert.equal(
      (await forwardedSubmit(direct.url, '198.51.100.11')).status,
      429,
    );
  } finally {
    await direct.close();
  }
  const proxy = await start(':memory:', {
    config: { ...config, trustedProxyIps: ['127.0.0.1'] },
    rateLimitMax: 1,
  });
  try {
    assert.equal(
      (await forwardedSubmit(proxy.url, '198.51.100.10')).status,
      201,
    );
    assert.equal(
      (await forwardedSubmit(proxy.url, '198.51.100.11')).status,
      201,
    );
    assert.equal(
      (await forwardedSubmit(proxy.url, '198.51.100.10')).status,
      429,
    );
  } finally {
    await proxy.close();
  }
  assert.deepEqual(
    readInquiryConfig({ TRUSTED_PROXY_IPS: '127.0.0.1, ::1, 127.0.0.1' })
      .trustedProxyIps,
    ['127.0.0.1', '::1'],
  );
  for (const invalid of ['*', 'true', '127.0.0.0/8', 'proxy.example.test']) {
    assert.throws(
      () => readInquiryConfig({ TRUSTED_PROXY_IPS: invalid }),
      /explicit IPv4 or IPv6/,
    );
  }
});

await test('historical catalog and form references remain readable and editable', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'artseoul-history-'));
  const path = join(directory, 'records.sqlite');
  let api = await start(path);
  try {
    const receipt = await json(await submit(api.url));
    await api.close();
    const db = new DatabaseSync(path);
    db.prepare('UPDATE inquiries SET data = ? WHERE id = ?').run(
      JSON.stringify({
        ...payload,
        artworkIds: ['retired-art-1998'],
        service: 'archived-service',
        space: 'archived-space',
      }),
      String(receipt.id),
    );
    db.close();
    api = await start(path);
    const response = await fetch(api.url + '/api/admin/inquiries', {
      headers: adminHeaders,
    });
    assert.equal(response.status, 200);
    const list = await json(response);
    assert.ok(Array.isArray(list.inquiries));
    const record = list.inquiries[0] as Record<string, unknown>;
    assert.deepEqual(record.artworkIds, ['retired-art-1998']);
    assert.equal(record.service, 'archived-service');
    const patch = await fetch(
      api.url + '/api/admin/inquiries/' + String(receipt.id),
      {
        method: 'PATCH',
        headers: adminHeaders,
        body: JSON.stringify({ stage: 'closed' }),
      },
    );
    assert.equal(patch.status, 200);
    assert.deepEqual(
      ((await json(patch)).inquiry as Record<string, unknown>).artworkIds,
      ['retired-art-1998'],
    );
    assert.equal(
      (await submit(api.url, { ...payload, artworkIds: ['retired-art-1998'] }))
        .status,
      400,
    );
  } finally {
    await api.close();
    rmSync(directory, { recursive: true, force: true });
  }
});
