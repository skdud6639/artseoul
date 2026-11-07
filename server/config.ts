import { isIP } from 'node:net';
import type { InquiryConfig } from '../shared/inquiry.ts';

export interface ServerConfig extends InquiryConfig {
  adminToken: string;
  allowedOrigin: string;
  trustedProxyIps?: string[];
}

export function readInquiryConfig(
  environment: NodeJS.ProcessEnv = process.env,
): ServerConfig {
  const trustedProxyIps = [
    ...new Set(
      (environment.TRUSTED_PROXY_IPS ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
  if (trustedProxyIps.some((ip) => isIP(ip) === 0)) {
    throw new Error(
      'TRUSTED_PROXY_IPS must contain explicit IPv4 or IPv6 addresses only.',
    );
  }
  const operator = (environment.INQUIRY_OPERATOR ?? '').trim();
  const privacyContact = (environment.INQUIRY_PRIVACY_CONTACT ?? '').trim();
  const adminToken = environment.ADMIN_TOKEN ?? '';
  const rawDays = environment.INQUIRY_RETENTION_DAYS ?? '';
  const days = Number(rawDays);
  const retentionDays =
    rawDays && Number.isInteger(days) && days >= 1 && days <= 3650
      ? days
      : null;
  const ready =
    operator.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(privacyContact) &&
    retentionDays !== null &&
    adminToken.length >= 32;
  return {
    enabled: environment.INQUIRY_ENABLED === 'true' && ready,
    operator,
    privacyContact,
    retentionDays,
    adminToken,
    allowedOrigin: (environment.PUBLIC_ORIGIN ?? '').replace(/\/$/, ''),
    trustedProxyIps,
  };
}
