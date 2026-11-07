export const inquiryServices = ['rental', 'consulting', 'purchase'] as const;
export const inquirySpaces = [
  'office',
  'healthcare',
  'hospitality',
  'retail',
  'other',
] as const;
export const inquiryStages = [
  'new',
  'contacted',
  'proposed',
  'closed',
] as const;
export const knownArtworkIds = [
  'art-01',
  'art-02',
  'art-03',
  'art-04',
] as const;
export const consentVersion = '2026-11-07-v1';

export type InquiryService = (typeof inquiryServices)[number];
export type InquirySpace = (typeof inquirySpaces)[number];
export type InquiryStage = (typeof inquiryStages)[number];

export interface InquiryInput {
  company: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  service: InquiryService;
  space: InquirySpace;
  budget: string;
  timing: string;
  message: string;
  artworkIds: string[];
  consent: true;
  website: string;
}

export interface InquiryConfig {
  enabled: boolean;
  operator: string;
  privacyContact: string;
  retentionDays: number | null;
}

export interface InquiryRecord extends Omit<
  InquiryInput,
  'website' | 'consent' | 'service' | 'space'
> {
  // Preserve labels recorded at submission even if the public options change.
  service: string;
  space: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  stage: InquiryStage;
  notes: string;
  consentVersion: string;
  expiresAt?: string;
}

export type InquiryValidation =
  | { success: true; value: InquiryInput }
  | { success: false; fields: Record<string, string> };

export function validateInquiry(input: unknown): InquiryValidation {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { success: false, fields: { form: '입력 내용을 확인해 주세요.' } };
  }
  const source = input as Record<string, unknown>;
  const fields: Record<string, string> = {};
  const text = (key: string, max: number, required = false): string => {
    const raw = source[key];
    if (raw !== undefined && typeof raw !== 'string') {
      fields[key] = '올바른 형식으로 입력해 주세요.';
      return '';
    }
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (required && !value) fields[key] = '필수 항목을 입력해 주세요.';
    if (value.length > max) fields[key] = `${max}자 이내로 입력해 주세요.`;
    if (value.includes(String.fromCharCode(0)))
      fields[key] = '입력할 수 없는 문자가 있습니다.';
    return value;
  };
  const company = text('company', 120, true);
  const name = text('name', 80, true);
  const email = text('email', 254);
  const phone = text('phone', 32);
  const region = text('region', 160, true);
  const budget = text('budget', 100);
  const timing = text('timing', 100);
  const message = text('message', 2000);
  const website = text('website', 200);

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fields.email = '이메일 주소를 확인해 주세요.';
  }
  if (
    phone &&
    (!/^[+\d\s()-]+$/.test(phone) ||
      phone.replace(/\D/g, '').length < 8 ||
      phone.replace(/\D/g, '').length > 15)
  ) {
    fields.phone = '연락 가능한 전화번호를 입력해 주세요.';
  }
  if (!email && !phone) {
    fields.email = '이메일 또는 전화번호 중 하나를 입력해 주세요.';
    fields.phone = '이메일 또는 전화번호 중 하나를 입력해 주세요.';
  }
  const service = inquiryServices.find((item) => item === source.service);
  const space = inquirySpaces.find((item) => item === source.space);
  if (!service) fields.service = '관심 서비스를 선택해 주세요.';
  if (!space) fields.space = '공간 유형을 선택해 주세요.';
  if (source.consent !== true) {
    fields.consent = '상담을 위한 개인정보 수집·이용에 동의해 주세요.';
  }
  const rawIds: unknown = source.artworkIds;
  const artworkIds: string[] = [];
  if (!Array.isArray(rawIds) || rawIds.length > 20) {
    fields.artworkIds = '관심 작품을 다시 선택해 주세요.';
  } else {
    for (const candidate of rawIds as unknown[]) {
      const id = knownArtworkIds.find((item) => item === candidate);
      if (!id) fields.artworkIds = '현재 목록에 없는 작품이 포함되어 있습니다.';
      else if (!artworkIds.includes(id)) artworkIds.push(id);
    }
  }
  if (website) fields.form = '요청을 처리할 수 없습니다.';
  if (Object.keys(fields).length > 0 || !service || !space) {
    return { success: false, fields };
  }
  return {
    success: true,
    value: {
      company,
      name,
      email,
      phone,
      region,
      service,
      space,
      budget,
      timing,
      message,
      artworkIds,
      consent: true,
      website: '',
    },
  };
}
