import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Check, ArrowLeft } from 'lucide-react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { artworks } from '../catalog';
import { projectConcepts } from '../content/services';
import { useSelection } from '../state/selection';
import { validateInquiry } from '../../shared/inquiry';
import type { InquiryConfig, InquiryInput } from '../../shared/inquiry';
import '../styles/inquiry.css';

type Draft = Omit<InquiryInput, 'consent'> & { consent: boolean };
type Receipt = { id: string; createdAt: string };

const services = [
  ['rental', '작품 렌탈'],
  ['consulting', '공간 컨설팅'],
  ['purchase', '작품 구매 상담'],
] as const;
const spaces = [
  ['office', '오피스'],
  ['healthcare', '병원·클리닉'],
  ['hospitality', '호텔·숙박'],
  ['retail', '매장·브랜드 공간'],
  ['other', '그 외 공간'],
] as const;

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isConfig(value: unknown): value is InquiryConfig {
  return (
    object(value) &&
    typeof value.enabled === 'boolean' &&
    typeof value.operator === 'string' &&
    typeof value.privacyContact === 'string' &&
    (value.retentionDays === null || typeof value.retentionDays === 'number')
  );
}

function isReceipt(value: unknown): value is Receipt {
  return (
    object(value) &&
    typeof value.id === 'string' &&
    typeof value.createdAt === 'string'
  );
}

export function InquiryPage() {
  const [params] = useSearchParams();
  const sourceProject = projectConcepts.find(
    (project) => project.slug === params.get('project'),
  );
  const { ids: selectionIds } = useSelection();
  const navigate = useNavigate();
  const [config, setConfig] = useState<InquiryConfig | null>(null);
  const [configError, setConfigError] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => ({
    company: '',
    name: '',
    email: '',
    phone: '',
    region: '',
    service:
      params.get('service') === 'consulting'
        ? 'consulting'
        : params.get('service') === 'purchase'
          ? 'purchase'
          : 'rental',
    space:
      spaces.find(([value]) => value === params.get('space'))?.[0] ?? 'office',
    budget: '',
    timing: '',
    message: sourceProject ? `[공간 제안 문의] ${sourceProject.title}\n\n` : '',
    artworkIds: [
      ...new Set(
        params.has('artworks')
          ? (params.get('artworks') ?? '').split(',')
          : selectionIds,
      ),
    ].filter((id) => artworks.some((artwork) => artwork.id === id)),
    consent: false,
    website: '',
  }));
  const retry = useRef<{ payload: string; key: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const pendingInvalidFocus = useRef<string | null>(null);

  useEffect(() => {
    const name = pendingInvalidFocus.current;
    if (!name) return;
    pendingInvalidFocus.current = null;
    const control = formRef.current?.elements.namedItem(name);
    if (control instanceof HTMLElement) control.focus();
  }, [fields]);

  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/inquiry-config', { signal: controller.signal })
      .then(async (response) => {
        const value: unknown = await response.json().catch(() => null);
        if (!response.ok || !isConfig(value))
          throw new Error('설정 정보를 읽지 못했습니다.');
        setConfig(value);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setConfigError(
            '상담 접수 상태를 확인하지 못했습니다. 잠시 후 다시 방문해 주세요.',
          );
      });
    return () => controller.abort();
  }, []);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setFields((current) => ({ ...current, [key]: '' }));
    setError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !config?.enabled) return;
    const result = validateInquiry(draft);
    if (!result.success) {
      const order = [
        'company',
        'name',
        'email',
        'phone',
        'service',
        'space',
        'region',
        'budget',
        'timing',
        'message',
        'consent',
      ];
      pendingInvalidFocus.current =
        order.find(
          (name) =>
            result.fields[name] || (name === 'email' && result.fields.contact),
        ) ?? null;
      setFields(result.fields);
      setError('입력한 내용을 확인해 주세요.');
      return;
    }
    const payload = JSON.stringify(result.value);
    setSubmitting(true);
    setError('');
    try {
      if (retry.current?.payload !== payload) {
        if (typeof crypto.randomUUID !== 'function') {
          throw new Error(
            '이 연결에서는 안전한 접수를 시작할 수 없습니다. HTTPS 주소의 최신 브라우저에서 다시 시도해 주세요.',
          );
        }
        retry.current = { payload, key: crypto.randomUUID() };
      }
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': retry.current.key,
        },
        body: payload,
      });
      const value: unknown = await response.json().catch(() => null);
      if (!response.ok || !isReceipt(value)) {
        if (object(value) && object(value.fields)) {
          const nextFields: Record<string, string> = {};
          for (const [key, message] of Object.entries(value.fields)) {
            if (typeof message === 'string') nextFields[key] = message;
          }
          setFields(nextFields);
        }
        throw new Error(
          object(value) && typeof value.error === 'string'
            ? value.error
            : '문의가 저장되지 않았습니다. 다시 시도해 주세요.',
        );
      }
      void navigate('/inquiry/complete', {
        state: { id: value.id, createdAt: value.createdAt },
        replace: true,
      });
    } catch (cause) {
      setError(
        cause instanceof Error && !(cause instanceof TypeError)
          ? cause.message
          : '연결이 원활하지 않습니다. 입력 내용은 유지됩니다. 다시 시도해 주세요.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  const selected = artworks.filter((artwork) =>
    draft.artworkIds.includes(artwork.id),
  );
  return (
    <div className="container inquiry-page">
      <header className="page-intro inquiry-intro">
        <p className="eyebrow">START A CONVERSATION</p>
        <h1>
          당신의 공간에서
          <br />
          시작하는 예술.
        </h1>
        <p className="muted">
          공간의 쓰임과 원하는 분위기를 들려주세요.
          <br />
          작품을 정하지 않으셨다면 함께 찾아가겠습니다.
        </p>
      </header>
      <div className="inquiry-layout">
        <aside className="inquiry-aside">
          <p className="eyebrow">WHAT COMES NEXT</p>
          <ol className="inquiry-steps">
            <li>
              <span>01</span>
              <div>
                <b>공간과 방향 확인</b>
                <p>공간 유형, 예산, 시기에 관한 이야기를 나눕니다.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <b>작품과 배치 제안</b>
                <p>목적에 맞는 후보와 진행 범위를 함께 검토합니다.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <b>견적과 설치 협의</b>
                <p>작품 일정과 현장 조건을 확인한 뒤 견적을 확정합니다.</p>
              </div>
            </li>
          </ol>
          {sourceProject && (
            <div className="inquiry-selection">
              <h2>선택한 공간 제안</h2>
              <Link
                to={`/projects/${sourceProject.slug}`}
                className="text-link"
              >
                {sourceProject.title} <ArrowRight size={16} />
              </Link>
              <p className="inquiry-small">
                이 공간 제안의 제목을 문의 내용에 함께 담았습니다.
              </p>
            </div>
          )}
          {selected.length > 0 && (
            <div className="inquiry-selection">
              <h2>
                함께 문의할 작품 <span>{selected.length}</span>
              </h2>
              {selected.map((artwork) => (
                <div className="inquiry-selected-work" key={artwork.id}>
                  <img src={artwork.image} alt="" />
                  <div>
                    <b>{artwork.title}</b>
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          'artworkIds',
                          draft.artworkIds.filter((id) => id !== artwork.id),
                        )
                      }
                    >
                      선택에서 빼기
                    </button>
                  </div>
                </div>
              ))}
              <p className="inquiry-small">
                관심 작품을 함께 전달합니다. 상담 신청은 작품 예약이나 계약
                확정이 아닙니다.
              </p>
            </div>
          )}
          <Link to="/selection" className="text-link">
            관심 작품 살펴보기 <ArrowRight size={16} />
          </Link>
        </aside>
        <div className="inquiry-form-panel">
          {configError ? (
            <div className="inquiry-status" role="alert">
              <h2>잠시 후 다시 확인해 주세요.</h2>
              <p>{configError}</p>
              <button
                className="button button-outline"
                type="button"
                onClick={() => window.location.reload()}
              >
                새로고침
              </button>
            </div>
          ) : !config ? (
            <div className="inquiry-status" role="status">
              상담 접수 상태를 확인하고 있습니다.
            </div>
          ) : !config.enabled ? (
            <div className="inquiry-status">
              <p className="eyebrow">COMING SOON</p>
              <h2>상담 접수 준비 중</h2>
              <p>
                상담 접수를 준비하고 있습니다. 관심 작품은 저장해 두실 수
                있어요.
                <br />
                작품과 공간 제안을 먼저 살펴보세요.
              </p>
              <div className="inquiry-action-row">
                <Link className="button button-dark" to="/artworks">
                  작품 찾기 <ArrowRight size={16} />
                </Link>
                <Link className="button button-outline" to="/consulting">
                  컨설팅 알아보기
                </Link>
              </div>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={(event) => {
                void submit(event);
              }}
              noValidate
              aria-busy={submitting}
            >
              <div className="inquiry-form-heading">
                <h2>상담·견적 요청</h2>
                <p>별표(*) 항목을 입력해 주세요.</p>
              </div>
              <fieldset disabled={submitting} className="inquiry-fields">
                <legend className="inquiry-sr-only">상담 정보</legend>
                <div className="inquiry-two">
                  <label className="form-field">
                    회사·기관명 *
                    <input
                      name="company"
                      aria-required="true"
                      autoComplete="organization"
                      value={draft.company}
                      maxLength={100}
                      onChange={(e) => update('company', e.target.value)}
                      aria-invalid={Boolean(fields.company)}
                      aria-describedby={
                        fields.company ? 'error-company' : undefined
                      }
                    />
                    <span className="inquiry-field-error" id="error-company">
                      {fields.company}
                    </span>
                  </label>
                  <label className="form-field">
                    담당자명 *
                    <input
                      name="name"
                      aria-required="true"
                      autoComplete="name"
                      value={draft.name}
                      maxLength={80}
                      onChange={(e) => update('name', e.target.value)}
                      aria-invalid={Boolean(fields.name)}
                      aria-describedby={fields.name ? 'error-name' : undefined}
                    />
                    <span className="inquiry-field-error" id="error-name">
                      {fields.name}
                    </span>
                  </label>
                </div>
                <div className="inquiry-contact-label">
                  연락처 *{' '}
                  <span id="inquiry-contact-help">
                    이메일 또는 전화번호를 하나 이상 입력해 주세요.
                  </span>
                </div>
                <div className="inquiry-two">
                  <label className="form-field">
                    이메일
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={draft.email}
                      maxLength={254}
                      onChange={(e) => update('email', e.target.value)}
                      aria-invalid={Boolean(fields.email || fields.contact)}
                      aria-describedby={[
                        'inquiry-contact-help',
                        fields.email && 'error-email',
                        fields.contact && 'error-contact',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />
                    <span className="inquiry-field-error" id="error-email">
                      {fields.email}
                    </span>
                  </label>
                  <label className="form-field">
                    전화번호
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={draft.phone}
                      maxLength={30}
                      onChange={(e) => update('phone', e.target.value)}
                      aria-invalid={Boolean(fields.phone || fields.contact)}
                      aria-describedby={[
                        'inquiry-contact-help',
                        fields.phone && 'error-phone',
                        fields.contact && 'error-contact',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />
                    <span className="inquiry-field-error" id="error-phone">
                      {fields.phone}
                    </span>
                  </label>
                </div>
                {fields.contact && (
                  <p
                    className="inquiry-field-error"
                    role="alert"
                    id="error-contact"
                  >
                    {fields.contact}
                  </p>
                )}
                <div className="inquiry-two">
                  <label className="form-field">
                    관심 서비스 *
                    <select
                      name="service"
                      aria-required="true"
                      value={draft.service}
                      aria-invalid={Boolean(fields.service)}
                      aria-describedby={
                        fields.service ? 'error-service' : undefined
                      }
                      onChange={(e) => {
                        const service = services.find(
                          ([value]) => value === e.target.value,
                        );
                        if (service) update('service', service[0]);
                      }}
                    >
                      {services.map(([value, label]) => (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <span className="inquiry-field-error" id="error-service">
                      {fields.service}
                    </span>
                  </label>
                  <label className="form-field">
                    공간 유형 *
                    <select
                      name="space"
                      aria-required="true"
                      value={draft.space}
                      aria-invalid={Boolean(fields.space)}
                      aria-describedby={
                        fields.space ? 'error-space' : undefined
                      }
                      onChange={(e) => {
                        const space = spaces.find(
                          ([value]) => value === e.target.value,
                        );
                        if (space) update('space', space[0]);
                      }}
                    >
                      {spaces.map(([value, label]) => (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <span className="inquiry-field-error" id="error-space">
                      {fields.space}
                    </span>
                  </label>
                </div>
                <label className="form-field">
                  설치 희망 지역 *
                  <input
                    name="region"
                    aria-required="true"
                    value={draft.region}
                    maxLength={120}
                    placeholder="예: 서울 성동구 · 여러 지점이면 함께 적어주세요"
                    onChange={(e) => update('region', e.target.value)}
                    aria-invalid={Boolean(fields.region)}
                    aria-describedby={
                      fields.region ? 'error-region' : undefined
                    }
                  />
                  <span className="inquiry-field-error" id="error-region">
                    {fields.region}
                  </span>
                </label>
                <div className="inquiry-two">
                  <label className="form-field">
                    월 예산 <span className="inquiry-optional">선택</span>
                    <select
                      name="budget"
                      value={draft.budget}
                      aria-invalid={Boolean(fields.budget)}
                      aria-describedby={
                        fields.budget ? 'error-budget' : undefined
                      }
                      onChange={(e) => update('budget', e.target.value)}
                    >
                      <option value="">상담 후 결정</option>
                      <option value="30만원 미만">30만원 미만</option>
                      <option value="30~100만원">30~100만원</option>
                      <option value="100~300만원">100~300만원</option>
                      <option value="300만원 이상">300만원 이상</option>
                    </select>
                    <span className="inquiry-field-error" id="error-budget">
                      {fields.budget}
                    </span>
                  </label>
                  <label className="form-field">
                    희망 설치 시기{' '}
                    <span className="inquiry-optional">선택</span>
                    <input
                      name="timing"
                      value={draft.timing}
                      aria-invalid={Boolean(fields.timing)}
                      aria-describedby={
                        fields.timing ? 'error-timing' : undefined
                      }
                      maxLength={100}
                      placeholder="예: 12월 중 / 일정 협의"
                      onChange={(e) => update('timing', e.target.value)}
                    />
                    <span className="inquiry-field-error" id="error-timing">
                      {fields.timing}
                    </span>
                  </label>
                </div>
                <label className="form-field">
                  공간에 대해 들려주세요{' '}
                  <span className="inquiry-optional">선택</span>
                  <textarea
                    name="message"
                    value={draft.message}
                    aria-invalid={Boolean(fields.message)}
                    aria-describedby={
                      fields.message ? 'error-message' : undefined
                    }
                    maxLength={2000}
                    rows={5}
                    placeholder="공간의 분위기, 작품 수, 고민하고 있는 점 등을 자유롭게 적어주세요."
                    onChange={(e) => update('message', e.target.value)}
                  />
                  <span className="inquiry-field-error" id="error-message">
                    {fields.message}
                  </span>
                </label>
                <label className="inquiry-honeypot" aria-hidden="true">
                  웹사이트
                  <input
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={draft.website}
                    onChange={(e) => update('website', e.target.value)}
                  />
                </label>
                <div className="inquiry-consent">
                  <label>
                    <input
                      type="checkbox"
                      name="consent"
                      aria-required="true"
                      checked={draft.consent}
                      onChange={(e) => update('consent', e.target.checked)}
                      aria-invalid={Boolean(fields.consent)}
                      aria-describedby={
                        fields.consent ? 'error-consent' : undefined
                      }
                    />
                    <span>상담을 위한 개인정보 수집·이용에 동의합니다. *</span>
                  </label>
                  <p>
                    {config.operator}에서 상담 응대 목적으로
                    이름·연락처·회사·상담 내용을 수집하며, 접수일로부터{' '}
                    {config.retentionDays}일간 보관합니다. 동의를 거부할 수
                    있으나 온라인 상담 접수가 제한됩니다.{' '}
                    <Link
                      to="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      자세히 보기 (새 창)
                    </Link>
                  </p>
                  <span className="inquiry-field-error" id="error-consent">
                    {fields.consent}
                  </span>
                </div>
                {error && (
                  <div className="inquiry-error" role="alert">
                    {error}
                  </div>
                )}
                <button
                  className="button button-dark inquiry-submit"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? '접수하고 있습니다…' : '상담 요청 보내기'}
                  <ArrowRight size={18} />
                </button>
                <p className="inquiry-small">
                  상담 신청 후 작품·일정·현장 조건을 확인합니다. 비용과 진행
                  범위는 견적 단계에서 안내합니다.
                </p>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function InquiryCompletePage() {
  const location = useLocation();
  const receipt: unknown = location.state;
  return (
    <div className="container inquiry-complete">
      {isReceipt(receipt) ? (
        <>
          <span className="inquiry-success-mark">
            <Check size={32} />
          </span>
          <p className="eyebrow">REQUEST RECEIVED</p>
          <h1>
            상담 요청이
            <br />
            접수되었습니다.
          </h1>
          <p className="muted">
            담당자가 내용을 확인한 뒤 남겨주신 연락처로 연락드립니다.
            <br />
            작품과 설치 일정은 상담을 통해 함께 확인합니다.
          </p>
          <div className="inquiry-receipt">
            <span>접수 번호</span>
            <strong>{receipt.id}</strong>
            <span>접수 일시</span>
            <strong>
              {new Date(receipt.createdAt).toLocaleString('ko-KR', {
                timeZone: 'Asia/Seoul',
              })}
            </strong>
          </div>
          <p className="inquiry-small">
            접수 번호를 보관해 주세요. 문의 내용은 서버에 저장되었습니다.
            <br />
            별도의 이메일 자동 발송이나 작품 예약 확정을 뜻하지 않습니다.
          </p>
        </>
      ) : (
        <>
          <p className="eyebrow">ART SEOUL</p>
          <h1>새로운 공간의 시작</h1>
          <p className="muted">
            이 화면에는 저장된 접수 정보가 없습니다.
            <br />
            새로운 상담은 상담·견적 요청에서 시작해 주세요.
          </p>
          <Link to="/inquiry" className="button button-dark">
            상담·견적 요청 <ArrowRight size={16} />
          </Link>
        </>
      )}
      <div className="inquiry-action-row">
        <Link to="/artworks" className="button button-outline">
          작품 계속 보기 <ArrowRight size={16} />
        </Link>
        <Link to="/" className="text-link">
          <ArrowLeft size={16} /> 처음으로
        </Link>
      </div>
    </div>
  );
}
