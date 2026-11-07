import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { InquiryConfig } from '../../shared/inquiry';
import '../styles/inquiry.css';

function isConfig(value: unknown): value is InquiryConfig {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'enabled' in value &&
    typeof value.enabled === 'boolean' &&
    'operator' in value &&
    typeof value.operator === 'string' &&
    'privacyContact' in value &&
    typeof value.privacyContact === 'string' &&
    'retentionDays' in value &&
    (value.retentionDays === null || typeof value.retentionDays === 'number')
  );
}

export function PolicyPage({ type }: { type: 'privacy' | 'terms' | 'rental' }) {
  const [config, setConfig] = useState<InquiryConfig | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/inquiry-config', { signal: controller.signal })
      .then(async (response) => {
        const value: unknown = await response.json().catch(() => null);
        if (!response.ok || !isConfig(value)) throw new Error('설정 확인 실패');
        setConfig(value);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, []);
  const title =
    type === 'privacy'
      ? '개인정보 처리 안내'
      : type === 'rental'
        ? '렌탈 이용 조건'
        : '웹사이트 이용 안내';
  return (
    <div className="container policy-page">
      <header className="page-intro">
        <p className="eyebrow">ART SEOUL INFORMATION</p>
        <h1>{title}</h1>
        <p className="muted">상담과 서비스 이용 전에 확인해 주세요.</p>
      </header>
      <nav className="policy-tabs" aria-label="이용 안내">
        <Link
          to="/privacy"
          aria-current={type === 'privacy' ? 'page' : undefined}
        >
          개인정보 처리 안내
        </Link>
        <Link to="/terms" aria-current={type === 'terms' ? 'page' : undefined}>
          웹사이트 이용 안내
        </Link>
        <Link
          to="/rental/terms"
          aria-current={type === 'rental' ? 'page' : undefined}
        >
          렌탈 이용 조건
        </Link>
      </nav>
      <article className="policy-body">
        {type === 'privacy' ? (
          <>
            <h2>온라인 상담 정보</h2>
            <p>
              상담 신청 시 회사·기관명, 담당자명, 이메일 또는 전화번호, 설치
              희망 지역, 관심 서비스와 공간 유형을 받습니다. 예산·시기·요청
              내용·관심 작품은 선택 입력입니다. 민감한 개인정보나 불필요한 개인
              식별 정보는 요청 내용에 작성하지 마세요.
            </p>
            <h2>이용 목적과 보관</h2>
            <p>
              수집한 정보는 상담 요청 확인, 연락, 작품과 서비스 제안 및 상담
              진행 관리에 사용합니다. 상담 신청은 마케팅 구독 동의를 포함하지
              않습니다.
            </p>
            {failed ? (
              <p className="inquiry-error" role="alert">
                현재 운영자와 보관기간 정보를 확인하지 못했습니다. 접수 전에
                다시 확인해 주세요.
              </p>
            ) : !config ? (
              <p role="status">운영 정보를 확인하고 있습니다.</p>
            ) : config.enabled ? (
              <dl className="policy-operator">
                <div>
                  <dt>운영자</dt>
                  <dd>{config.operator}</dd>
                </div>
                <div>
                  <dt>보관기간</dt>
                  <dd>접수일로부터 {config.retentionDays}일</dd>
                </div>
                <div>
                  <dt>개인정보 관련 문의</dt>
                  <dd>{config.privacyContact}</dd>
                </div>
              </dl>
            ) : (
              <p className="policy-note">
                현재 온라인 상담 접수 준비 중입니다. 운영자, 개인정보 문의처와
                보관기간을 확인할 수 있는 상태에서 접수를 시작합니다.
              </p>
            )}
            <h2>선택과 요청</h2>
            <p>
              상담 정보 수집·이용에 동의하지 않을 수 있으며, 이 경우 온라인 상담
              접수가 제한됩니다. 정보 열람·수정·삭제에 관한 요청은 위 개인정보
              문의처로 전달해 주세요. 처리 시 필요한 본인 확인을 안내합니다.
            </p>
            <h2>관심 작품 저장</h2>
            <p>
              관심 작품 기능은 현재 브라우저의 로컬 저장소에 작품 식별값을
              저장합니다. 이름이나 연락처를 저장하지 않으며, 관심 작품 화면에서
              삭제할 수 있습니다. 다른 브라우저나 기기로 자동 동기화하지
              않습니다.
            </p>
          </>
        ) : type === 'rental' ? (
          <>
            <h2>상담과 계약</h2>
            <p>
              웹사이트의 작품 탐색, 관심 저장, 상담 신청은 작품 예약이나 렌탈
              계약의 확정이 아닙니다. 작품의 렌탈 권한과 가용 일정, 현장 설치
              조건을 확인한 뒤 개별 견적과 계약을 안내합니다.
            </p>
            <h2>비용과 기간</h2>
            <p>
              작품별 월료, 계약 기간, 작품 수와 서비스 범위는 견적에서
              확인합니다. 운송·설치·철거·회수·벽면 작업·지역별 추가비와 세금
              포함 여부도 함께 확인해야 합니다. 견적 유효기간이 지난 경우 다시
              확인이 필요합니다.
            </p>
            <h2>설치와 이용</h2>
            <p>
              벽면 재질, 작품 중량, 동선, 일조, 반입 경로와 작업 가능 시간을
              확인합니다. 설치 이후 작품 위치 변경이나 외부 이동이 필요하면
              담당자와 먼저 협의합니다. 작품 관리 방법은 실제 작품과 설치 조건에
              맞춰 안내합니다.
            </p>
            <h2>교체와 연장</h2>
            <p>
              교체 가능 시점·횟수·물류비, 계약 연장과 반납 일정은 개별 계약에
              따릅니다. 교체나 연장을 신청한 시점에 즉시 확정되지 않으며, 대체
              작품과 일정 확인 후 안내합니다.
            </p>
            <h2>파손과 계약 종료</h2>
            <p>
              파손·분실·도난·복원·보험 적용과 고객 부담 범위, 중도 종료와
              원상복구 조건은 계약 전에 확인합니다. 이상을 발견하면 상태를
              기록하고 담당자에게 알린 뒤 처리 방향을 협의합니다.
            </p>
            <h2>렌탈 후 구매</h2>
            <p>
              구매 가능한 작품에 한해 별도로 협의합니다. 구매 금액, 렌탈료 차감
              여부, 소유권 이전과 공급자 정산 조건은 구매 계약에서 확정합니다.
            </p>
          </>
        ) : (
          <>
            <h2>작품과 공간 제안 정보</h2>
            <p>
              작품 이미지와 공간 제안은 탐색을 돕기 위한 자료입니다. 예시로
              표시된 작품·공간은 실제 판매 재고나 고객 설치 실적을 의미하지
              않습니다. 실제 제공 여부와 금액은 상담 과정에서 확인합니다.
            </p>
            <h2>이미지와 미리보기</h2>
            <p>
              화면의 색상과 크기는 기기·조명·공간에 따라 실제와 다르게 보일 수
              있습니다. 2D 공간 미리보기는 참고용이며, 현장 실측과 설치 검토를
              대체하지 않습니다.
            </p>
            <h2>상담 접수</h2>
            <p>
              상담 접수 기능이 활성화된 경우, 서버 저장이 완료되어 접수 번호가
              발급된 요청을 기준으로 상담을 진행합니다. 접수 번호 발급 자체가
              작품 예약·가격 보장·계약 체결을 의미하지 않습니다.
            </p>
            <h2>콘텐츠 이용</h2>
            <p>
              작품 이미지와 설명, 공간 자료에는 저작권과 이용 권리가 적용될 수
              있습니다. 별도 허락 없이 상업적 복제나 재배포에 사용하지 마세요.
            </p>
            <h2>거래 조건</h2>
            <p>
              이 안내는 웹사이트의 이용 범위를 설명합니다. 실제
              렌탈·구매·컨설팅의 범위와 금액, 기간, 계약 종료 조건은 확인된
              견적과 개별 계약서에 정합니다.
            </p>
          </>
        )}
        <div className="policy-bottom">
          <Link to="/inquiry" className="button button-dark">
            상담·견적 요청
          </Link>
          <Link to="/support/faq" className="text-link">
            자주 묻는 질문
          </Link>
        </div>
      </article>
    </div>
  );
}
