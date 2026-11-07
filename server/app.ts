import { createHash, timingSafeEqual } from 'node:crypto';
import express from 'express';
import type { ErrorRequestHandler, Request, RequestHandler } from 'express';
import { inquiryStages, validateInquiry } from '../shared/inquiry.ts';
import { readInquiryConfig } from './config.ts';
import type { ServerConfig } from './config.ts';
import { InquiryStore } from './store.ts';

interface InquiryAppOptions {
  config?: ServerConfig;
  databasePath?: string;
  now?: () => Date;
  rateLimitMax?: number;
}

function rateLimiter(max: number, now: () => Date): RequestHandler {
  const windowMs = 15 * 60 * 1000;
  const attempts = new Map<string, { count: number; until: number }>();
  return (req, res, next) => {
    const key = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const timestamp = now().getTime();
    for (const [ip, record] of attempts) {
      if (record.until <= timestamp) attempts.delete(ip);
    }
    const current = attempts.get(key) ?? {
      count: 0,
      until: timestamp + windowMs,
    };
    if (current.count >= max) {
      res.setHeader(
        'Retry-After',
        Math.ceil((current.until - timestamp) / 1000),
      );
      res
        .status(429)
        .json({ error: '요청이 많습니다. 잠시 후 다시 시도해 주세요.' });
      return;
    }
    if (attempts.size >= 10000 && !attempts.has(key)) {
      res.status(503).json({ error: '잠시 후 다시 시도해 주세요.' });
      return;
    }
    current.count += 1;
    attempts.set(key, current);
    next();
  };
}

function authorized(req: Request, token: string): boolean {
  if (token.length < 32) return false;
  const candidate = req.get('Authorization') ?? '';
  if (!candidate.startsWith('Bearer ')) return false;
  const actual = createHash('sha256').update(candidate.slice(7)).digest();
  const expected = createHash('sha256').update(token).digest();
  return timingSafeEqual(actual, expected);
}

export function createInquiryApp(options: InquiryAppOptions = {}) {
  const config = options.config ?? readInquiryConfig();
  const now = options.now ?? (() => new Date());
  const store = new InquiryStore(
    options.databasePath ??
      process.env.INQUIRY_DATABASE_PATH ??
      '.data/inquiries.sqlite',
  );
  store.purgeExpired(config.retentionDays, now());
  const retentionTimer = setInterval(
    () => {
      try {
        store.purgeExpired(config.retentionDays, now());
      } catch {
        console.error(
          'Inquiry retention cleanup failed; operator review required.',
        );
      }
    },
    60 * 60 * 1000,
  );
  retentionTimer.unref();
  const app = express();
  app.disable('x-powered-by');
  app.set(
    'trust proxy',
    config.trustedProxyIps?.length ? config.trustedProxyIps : false,
  );
  app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });
  app.use('/api', express.json({ limit: '24kb', strict: true }));
  app.get('/api/inquiry-config', (_req, res) => {
    res.json({
      enabled: config.enabled,
      operator: config.operator,
      privacyContact: config.privacyContact,
      retentionDays: config.retentionDays,
    });
  });

  app.post(
    '/api/inquiries',
    rateLimiter(options.rateLimitMax ?? 20, now),
    (req, res, next) => {
      if (!config.enabled) {
        res.status(503).json({ error: '상담 접수를 준비하고 있습니다.' });
        return;
      }
      if (!req.is('application/json')) {
        res.status(415).json({ error: '요청 형식을 확인해 주세요.' });
        return;
      }
      const origin = req.get('Origin');
      const allowedOrigin =
        config.allowedOrigin || `${req.protocol}://${req.get('host') ?? ''}`;
      if (origin && origin !== allowedOrigin) {
        res.status(403).json({ error: '요청을 처리할 수 없습니다.' });
        return;
      }
      const key = req.get('Idempotency-Key') ?? '';
      if (!/^[a-zA-Z0-9_-]{16,128}$/.test(key)) {
        res
          .status(400)
          .json({ error: '접수 키를 확인하고 다시 시도해 주세요.' });
        return;
      }
      const payload: unknown = req.body;
      const validation = validateInquiry(payload);
      if (!validation.success) {
        res.status(400).json({
          error: '입력 내용을 확인해 주세요.',
          fields: validation.fields,
        });
        return;
      }
      try {
        store.purgeExpired(config.retentionDays, now());
        const result = store.save(
          validation.value,
          key,
          now(),
          config.retentionDays ?? 1,
        );
        if (result.result === 'conflict') {
          res.status(409).json({
            error:
              '이전 요청과 내용이 다릅니다. 접수 화면에서 다시 시도해 주세요.',
          });
          return;
        }
        res.status(result.result === 'created' ? 201 : 200).json({
          id: result.id,
          createdAt: result.createdAt,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  app.use('/api/admin', rateLimiter(100, now), (req, res, next) => {
    if (!authorized(req, config.adminToken)) {
      res.status(401).json({ error: '운영자 인증을 확인해 주세요.' });
      return;
    }
    next();
  });
  app.get('/api/admin/inquiries', (_req, res, next) => {
    try {
      store.purgeExpired(config.retentionDays, now());
      res.json({ inquiries: store.list() });
    } catch (error) {
      next(error);
    }
  });
  app.patch('/api/admin/inquiries/:id', (req, res, next) => {
    const payload: unknown = req.body;
    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload)
    ) {
      res.status(400).json({ error: '변경 내용을 확인해 주세요.' });
      return;
    }
    const record = payload as Record<string, unknown>;
    const stage = inquiryStages.find((item) => item === record.stage);
    const notes = record.notes;
    if (
      !stage ||
      (notes !== undefined &&
        (typeof notes !== 'string' || notes.length > 4000))
    ) {
      res.status(400).json({ error: '상태와 메모를 확인해 주세요.' });
      return;
    }
    try {
      store.purgeExpired(config.retentionDays, now());
      const inquiry = store.update(req.params.id, stage, notes, now());
      if (!inquiry) {
        res.status(404).json({ error: '상담 기록을 찾을 수 없습니다.' });
        return;
      }
      res.json({ inquiry });
    } catch (error) {
      next(error);
    }
  });
  app.delete('/api/admin/inquiries/:id', (req, res, next) => {
    try {
      if (!store.delete(req.params.id)) {
        res.status(404).json({ error: '상담 기록을 찾을 수 없습니다.' });
        return;
      }
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: '요청한 기능을 찾을 수 없습니다.' });
  });
  const handleError: ErrorRequestHandler = (
    error: unknown,
    _req,
    res,
    next,
  ) => {
    if (res.headersSent) {
      next(error);
      return;
    }
    const isBodyError =
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      (error.type === 'entity.parse.failed' ||
        error.type === 'entity.too.large');
    res.status(isBodyError ? 400 : 500).json({
      error: isBodyError
        ? '요청 내용의 형식과 크기를 확인해 주세요.'
        : '접수를 처리하지 못했습니다. 입력 내용은 유지됩니다. 다시 시도해 주세요.',
    });
  };
  app.use(handleError);
  return {
    app,
    close: () => {
      clearInterval(retentionTimer);
      store.close();
    },
  };
}
