import { chmodSync, mkdirSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createHash, randomUUID } from 'node:crypto';
import { consentVersion, inquiryStages } from '../shared/inquiry.ts';
import type {
  InquiryInput,
  InquiryRecord,
  InquiryStage,
} from '../shared/inquiry.ts';

interface StoredRow {
  id: string;
  data: string;
  created_at: string;
  updated_at: string;
  stage: InquiryStage;
  notes: string;
  consent_version: string;
  fingerprint: string;
  expires_at: string | null;
}

function decodeRow(row: Record<string, unknown>): StoredRow {
  const text = (key: string): string => {
    if (typeof row[key] !== 'string') throw new Error('Invalid inquiry record');
    return row[key];
  };
  const stage = inquiryStages.find((item) => item === row.stage);
  if (!stage) throw new Error('Invalid inquiry stage');
  return {
    id: text('id'),
    data: text('data'),
    created_at: text('created_at'),
    updated_at: text('updated_at'),
    stage,
    notes: text('notes'),
    consent_version: text('consent_version'),
    fingerprint: text('fingerprint'),
    expires_at: typeof row.expires_at === 'string' ? row.expires_at : null,
  };
}

function publicRecord(row: StoredRow): InquiryRecord {
  const payload: unknown = JSON.parse(row.data);
  if (
    typeof payload !== 'object' ||
    payload === null ||
    Array.isArray(payload)
  ) {
    throw new Error('Invalid stored inquiry');
  }
  const stored = payload as Record<string, unknown>;
  const text = (key: string): string => {
    const value = stored[key];
    if (typeof value !== 'string')
      throw new Error('Invalid stored inquiry field');
    return value;
  };
  const ids: unknown = stored.artworkIds;
  if (
    !Array.isArray(ids) ||
    !ids.every((id: unknown) => typeof id === 'string')
  ) {
    throw new Error('Invalid stored artwork references');
  }
  // Historical references remain valid after catalog items or form options retire.
  // Validate their persisted shape without applying today's submission allowlists.
  return {
    company: text('company'),
    name: text('name'),
    email: text('email'),
    phone: text('phone'),
    region: text('region'),
    service: text('service'),
    space: text('space'),
    budget: text('budget'),
    timing: text('timing'),
    message: text('message'),
    artworkIds: ids,
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    stage: row.stage,
    notes: row.notes,
    consentVersion: row.consent_version,
    ...(row.expires_at ? { expiresAt: row.expires_at } : {}),
  };
}

export class InquiryStore {
  private readonly db: DatabaseSync;

  constructor(databasePath: string) {
    if (databasePath !== ':memory:') {
      const file = resolve(databasePath);
      for (const folder of ['dist', 'public']) {
        const blocked = resolve(folder);
        if (file === blocked || file.startsWith(blocked + sep)) {
          throw new Error(
            'Inquiry database must not be stored in public assets',
          );
        }
      }
      mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
      this.db = new DatabaseSync(file);
      chmodSync(file, 0o600);
    } else {
      this.db = new DatabaseSync(':memory:');
    }
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        request_key TEXT NOT NULL UNIQUE,
        fingerprint TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        stage TEXT NOT NULL DEFAULT 'new',
        notes TEXT NOT NULL DEFAULT '',
        consent_version TEXT NOT NULL,
        data TEXT NOT NULL,
        expires_at TEXT
      );
      CREATE INDEX IF NOT EXISTS inquiry_created_at ON inquiries(created_at);
    `);
    const columns = this.db.prepare('PRAGMA table_info(inquiries)').all();
    if (!columns.some((column) => column.name === 'expires_at')) {
      this.db.exec('ALTER TABLE inquiries ADD COLUMN expires_at TEXT');
    }
  }

  save(
    input: InquiryInput,
    requestKey: string,
    now: Date,
    retentionDays: number,
  ):
    | { result: 'created' | 'existing'; id: string; createdAt: string }
    | { result: 'conflict' } {
    const data = JSON.stringify(input);
    const fingerprint = createHash('sha256').update(data).digest('hex');
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const existing = this.db
        .prepare('SELECT * FROM inquiries WHERE request_key = ?')
        .get(requestKey);
      if (existing) {
        const row = decodeRow(existing);
        this.db.exec('COMMIT');
        return row.fingerprint === fingerprint
          ? { result: 'existing', id: row.id, createdAt: row.created_at }
          : { result: 'conflict' };
      }
      const id = 'AS-' + randomUUID();
      const createdAt = now.toISOString();
      const expiresAt = new Date(
        now.getTime() + retentionDays * 86400000,
      ).toISOString();
      this.db
        .prepare(
          'INSERT INTO inquiries (id, request_key, fingerprint, created_at, updated_at, consent_version, data, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        )
        .run(
          id,
          requestKey,
          fingerprint,
          createdAt,
          createdAt,
          consentVersion,
          data,
          expiresAt,
        );
      this.db.exec('COMMIT');
      return { result: 'created', id, createdAt };
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  list(): InquiryRecord[] {
    return this.db
      .prepare(
        'SELECT * FROM inquiries ORDER BY created_at DESC, id DESC LIMIT 500',
      )
      .all()
      .map((row) => publicRecord(decodeRow(row)));
  }

  update(
    id: string,
    stage: InquiryStage,
    notes: string | undefined,
    now: Date,
  ): InquiryRecord | null {
    this.db
      .prepare(
        'UPDATE inquiries SET stage = ?, notes = COALESCE(?, notes), updated_at = ? WHERE id = ?',
      )
      .run(stage, notes ?? null, now.toISOString(), id);
    const row = this.db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);
    return row ? publicRecord(decodeRow(row)) : null;
  }

  delete(id: string): boolean {
    return (
      this.db.prepare('DELETE FROM inquiries WHERE id = ?').run(id).changes > 0
    );
  }

  purgeExpired(retentionDays: number | null, now: Date): void {
    const cutoff =
      retentionDays === null
        ? '0000-01-01T00:00:00.000Z'
        : new Date(now.getTime() - retentionDays * 86400000).toISOString();
    this.db
      .prepare(
        'DELETE FROM inquiries WHERE expires_at <= ? OR (expires_at IS NULL AND created_at < ?)',
      )
      .run(now.toISOString(), cutoff);
  }

  close(): void {
    this.db.close();
  }
}
