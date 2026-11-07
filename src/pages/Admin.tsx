import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, LogOut, RefreshCw, ShieldCheck } from 'lucide-react';
import type { InquiryRecord, InquiryStage } from '../../shared/inquiry';
import '../styles/inquiry.css';

const stages: { value: InquiryStage; label: string }[] = [
  { value: 'new', label: '신규 접수' },
  { value: 'contacted', label: '상담 중' },
  { value: 'proposed', label: '제안 완료' },
  { value: 'closed', label: '종료' },
];
const serviceLabels: Record<string, string> = {
  rental: '작품 렌탈',
  consulting: '공간 컨설팅',
  purchase: '구매 상담',
};
const spaceLabels: Record<string, string> = {
  office: '오피스',
  healthcare: '병원·클리닉',
  hospitality: '호텔·숙박',
  retail: '매장·브랜드 공간',
  other: '그 외 공간',
};

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isInquiry(value: unknown): value is InquiryRecord {
  return (
    object(value) &&
    typeof value.id === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    typeof value.company === 'string' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.phone === 'string' &&
    typeof value.region === 'string' &&
    typeof value.service === 'string' &&
    typeof value.space === 'string' &&
    typeof value.budget === 'string' &&
    typeof value.timing === 'string' &&
    typeof value.message === 'string' &&
    typeof value.notes === 'string' &&
    typeof value.consentVersion === 'string' &&
    stages.some((stage) => stage.value === value.stage) &&
    Array.isArray(value.artworkIds) &&
    value.artworkIds.every((id: unknown) => typeof id === 'string')
  );
}

function InquiryEditor({
  inquiry,
  onSave,
  busy,
}: {
  inquiry: InquiryRecord;
  onSave: (id: string, stage: InquiryStage, notes: string) => Promise<void>;
  busy: boolean;
}) {
  const [stage, setStage] = useState(inquiry.stage);
  const [notes, setNotes] = useState(inquiry.notes);
  return (
    <details className="admin-record">
      <summary>
        <div>
          <span className="eyebrow">{inquiry.id}</span>
          <h2>
            {inquiry.company} <span>{inquiry.name}</span>
          </h2>
          <p>
            {serviceLabels[inquiry.service] ?? inquiry.service} ·{' '}
            {spaceLabels[inquiry.space] ?? inquiry.space} · {inquiry.region}
          </p>
        </div>
        <div className="admin-record-date">
          <span className="tag">
            {stages.find((item) => item.value === inquiry.stage)?.label}
          </span>
          <time dateTime={inquiry.createdAt}>
            {new Date(inquiry.createdAt).toLocaleDateString('ko-KR', {
              timeZone: 'Asia/Seoul',
            })}
          </time>
        </div>
      </summary>
      <div className="admin-record-body">
        <dl className="admin-details">
          <div>
            <dt>이메일</dt>
            <dd>{inquiry.email || '미입력'}</dd>
          </div>
          <div>
            <dt>전화번호</dt>
            <dd>{inquiry.phone || '미입력'}</dd>
          </div>
          <div>
            <dt>월 예산</dt>
            <dd>{inquiry.budget || '상담 후 결정'}</dd>
          </div>
          <div>
            <dt>설치 희망 시기</dt>
            <dd>{inquiry.timing || '일정 협의'}</dd>
          </div>
          <div>
            <dt>관심 작품</dt>
            <dd>
              {inquiry.artworkIds.length
                ? inquiry.artworkIds.join(', ')
                : '미선택'}
            </dd>
          </div>
          <div>
            <dt>개인정보 동의 버전</dt>
            <dd>{inquiry.consentVersion}</dd>
          </div>
        </dl>
        <div className="admin-message">
          <h3>고객 요청</h3>
          <p>{inquiry.message || '추가 요청 내용이 없습니다.'}</p>
        </div>
        <div className="admin-update">
          <label className="form-field">
            상담 단계
            <select
              value={stage}
              disabled={busy}
              onChange={(event) => {
                const next = stages.find(
                  (item) => item.value === event.target.value,
                );
                if (next) setStage(next.value);
              }}
            >
              {stages.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            운영 메모
            <textarea
              value={notes}
              maxLength={2000}
              rows={3}
              disabled={busy}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="후속 연락, 고객 요청, 다음 진행 사항을 기록해 주세요."
            />
          </label>
          <button
            type="button"
            className="button button-dark"
            disabled={busy}
            onClick={() => {
              void onSave(inquiry.id, stage, notes);
            }}
          >
            {busy ? '저장 중…' : '변경 저장'}
          </button>
        </div>
      </div>
    </details>
  );
}

export function AdminPage() {
  const [credential, setCredential] = useState('');
  const [token, setToken] = useState('');
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState('');
  const [filter, setFilter] = useState('');
  const requestGeneration = useRef(0);

  function logout() {
    requestGeneration.current += 1;
    setLoading(false);
    setSavingId('');
    setToken('');
    setCredential('');
    setInquiries([]);
    setStatus('');
    setError('');
  }

  async function load(accessToken: string) {
    if (!accessToken.trim() || loading || savingId) return;
    const generation = requestGeneration.current;
    setLoading(true);
    setError('');
    setStatus('');
    try {
      const response = await fetch('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${accessToken.trim()}` },
        cache: 'no-store',
      });
      const body: unknown = await response.json().catch(() => null);
      if (generation !== requestGeneration.current) return;
      if (response.status === 401) {
        logout();
        setError(
          '접근 권한을 확인하지 못했습니다. 운영자 토큰을 다시 확인해 주세요.',
        );
        return;
      }
      if (
        !response.ok ||
        !object(body) ||
        !Array.isArray(body.inquiries) ||
        !body.inquiries.every(isInquiry)
      )
        throw new Error(
          object(body) && typeof body.error === 'string'
            ? body.error
            : '상담 목록을 불러오지 못했습니다.',
        );
      setInquiries(body.inquiries);
      setToken(accessToken.trim());
      setCredential('');
    } catch (cause) {
      if (generation === requestGeneration.current)
        setError(
          cause instanceof Error && !(cause instanceof TypeError)
            ? cause.message
            : '서버에 연결하지 못했습니다.',
        );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await load(credential);
  }

  async function save(id: string, stage: InquiryStage, notes: string) {
    if (savingId || loading || !token) return;
    const generation = requestGeneration.current;
    setSavingId(id);
    setError('');
    setStatus('');
    try {
      const response = await fetch(
        `/api/admin/inquiries/${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stage, notes }),
        },
      );
      const body: unknown = await response.json().catch(() => null);
      if (generation !== requestGeneration.current) return;
      if (response.status === 401) {
        logout();
        setError(
          '운영자 인증이 만료되었거나 변경되었습니다. 다시 로그인해 주세요.',
        );
        return;
      }
      if (!response.ok || !object(body) || !isInquiry(body.inquiry))
        throw new Error(
          object(body) && typeof body.error === 'string'
            ? body.error
            : '변경사항을 저장하지 못했습니다.',
        );
      const updated = body.inquiry;
      setInquiries((current) =>
        current.map((inquiry) =>
          inquiry.id === updated.id ? updated : inquiry,
        ),
      );
      setStatus('상담 단계와 메모를 저장했습니다.');
    } catch (cause) {
      if (generation === requestGeneration.current)
        setError(
          cause instanceof Error && !(cause instanceof TypeError)
            ? cause.message
            : '연결이 원활하지 않습니다. 다시 시도해 주세요.',
        );
    } finally {
      if (generation === requestGeneration.current) setSavingId('');
    }
  }

  const visible = inquiries.filter(
    (inquiry) => !filter || inquiry.stage === filter,
  );
  return (
    <div className="container admin-page">
      <header className="page-intro">
        <p className="eyebrow">ART SEOUL OPERATIONS</p>
        <h1>상담 관리</h1>
        <p className="muted">접수된 문의와 다음 진행 사항을 관리합니다.</p>
      </header>
      {!token ? (
        <div className="admin-login">
          <ShieldCheck size={30} strokeWidth={1.3} />
          <h2>운영자 로그인</h2>
          <p>
            관리용 접근 토큰을 입력해 주세요.
            <br />
            토큰은 이 페이지의 메모리에만 보관되며 새로고침하면 해제됩니다.
          </p>
          <form
            onSubmit={(event) => {
              void login(event);
            }}
          >
            <label className="form-field">
              운영자 토큰
              <input
                type="password"
                name="admin-token"
                value={credential}
                autoComplete="off"
                required
                onChange={(event) => setCredential(event.target.value)}
                disabled={loading || Boolean(savingId)}
              />
            </label>
            <button
              type="submit"
              className="button button-dark"
              disabled={loading || !credential.trim()}
            >
              {loading ? '확인 중…' : '상담 목록 열기'} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="admin-toolbar">
            <p>
              최근 접수 <b>{inquiries.length}</b>건{' '}
              <span className="muted">(최대 500건)</span>
            </p>
            <label>
              상담 단계
              <select
                aria-label="상담 단계로 필터"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="">전체</option>
                {stages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <button
                type="button"
                className="button button-outline"
                onClick={() => {
                  void load(token);
                }}
                disabled={loading || Boolean(savingId)}
              >
                <RefreshCw size={15} /> 새로고침
              </button>
              <button
                type="button"
                className="button button-outline"
                onClick={logout}
              >
                <LogOut size={15} /> 로그아웃
              </button>
            </div>
          </div>
          {loading && <p role="status">상담 목록을 불러오고 있습니다.</p>}
          {status && (
            <p className="admin-notice" role="status">
              {status}
            </p>
          )}
          {!loading && !visible.length ? (
            <div className="inquiry-status">
              <h2>
                {inquiries.length
                  ? '해당 단계의 문의가 없습니다.'
                  : '아직 접수된 문의가 없습니다.'}
              </h2>
              <p>웹사이트에서 저장된 상담 요청이 이곳에 표시됩니다.</p>
            </div>
          ) : (
            <div>
              {visible.map((inquiry) => (
                <InquiryEditor
                  key={`${inquiry.id}-${inquiry.updatedAt}`}
                  inquiry={inquiry}
                  onSave={save}
                  busy={savingId === inquiry.id}
                />
              ))}
            </div>
          )}
        </>
      )}
      {error && (
        <p className="inquiry-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
