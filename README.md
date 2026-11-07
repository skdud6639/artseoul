# 서울아트 · Seoul Art Gallery

Google AI Studio에서 제작한 React + TypeScript + Vite 갤러리 웹사이트입니다.

## 로컬 실행

Node.js 24를 사용합니다. 기준 버전은 `.nvmrc`에 기록되어 있습니다.

프로젝트 폴더에서 아래 명령 하나만 실행하세요.

```sh
npm start
```

의존성을 잠금 파일 기준으로 설치한 뒤 3000번 포트에서 개발 서버를 실행하고 브라우저를 엽니다.
최초 실행과 패키지 설치에는 인터넷 연결이 필요합니다. 종료는 터미널에서 `Ctrl+C`를 누르세요.
이미 패키지가 설치되어 있다면 `npm run dev`로 설치 과정을 생략할 수 있습니다.

개발 서버: http://localhost:3000

개발 서버와 빌드 미리보기(`npm run preview`)는 모두 **3000번 포트**를 사용합니다.
3000번 포트가 사용 중이면 다른 포트로 자동 전환하지 않고 오류로 종료합니다.
기존 3000번 서버를 종료한 다음 다시 실행하세요. 개발 서버와 미리보기는 하나씩 실행합니다.

## 개발 중 변경 사항 반영

```sh
npm run dev
```

http://localhost:3000 에서 확인합니다. 개발 서버를 켜 둔 상태에서 로컬 소스 파일을 저장하면 React Fast Refresh와 CSS 핫리로드로 자동 반영됩니다. 수동으로 새로고침해도 최신 소스가 표시됩니다. 공유 폴더에서도 변경을 감지하도록 200ms 간격의 파일 감시를 사용합니다.

- 이전 AI Studio의 `DISABLE_HMR` 환경변수와 관계없이 핫리로드가 활성화됩니다.
- `npm run preview`는 빌드된 결과를 보여주므로 핫리로드가 필요한 개발 중에는 사용하지 않습니다.
- 다른 컴퓨터나 클라우드에서 수정한 코드는 자동으로 동기화되지 않습니다. 같은 브랜치의 변경을 `git pull --ff-only`로 가져오면 로컬 개발 서버가 이를 감지합니다.
- Vite 설정, 환경변수 파일, 의존성이 변경되면 서버를 종료하고 다시 실행하세요. 의존성이 변경된 경우 `npm start`로 설치부터 다시 진행합니다.

## 검증 및 빌드

```sh
npm run lint
npm run format:check
npm run typecheck
npm run build
npm run preview
```

정적 배포 파일은 `dist/`에 생성됩니다. 이 저장소 반영만으로 웹사이트가 자동 배포되지는 않습니다.

## 코드 컨벤션

`seoulwhanghoo` 프런트엔드와 동일하게 Prettier(작은따옴표, 후행 쉼표), 타입 기반 ESLint, React Hooks 및 React Refresh 규칙을 적용합니다.

- `npm run format`: 포맷 자동 수정
- `npm run lint:fix`: 자동 수정 가능한 린트 문제 수정
- `npm run lint`: 경고를 포함한 린트 위반 검사
- `npm run format:check`: 포맷 검사
- `npm run typecheck`: 엄격한 TypeScript 타입 검사

GitHub Actions는 main push와 main 대상 PR에서 린트·포맷·타입·빌드를 검사합니다.

## 포함된 기능

- 한국어 / 영어 전환
- 전시 소개, 작품 목록 및 상세 보기, 작가 소개
- 작품과 벽 색상 선택 및 인물 크기 비교가 가능한 가상 뷰잉룸
- 갤러리 안내와 작품 문의 폼

문의 폼은 현재 화면 시연용입니다. 제출하면 브라우저에서 임시 문의 번호를 생성하며, 서버 저장이나 이메일 발송은 하지 않습니다. 소셜 링크도 실제 계정 연결이 필요합니다.

현재 앱은 Gemini API를 호출하지 않으므로 로컬 실행에 API 키가 필요하지 않습니다. `.env.example`은 AI Studio 내보내기에 포함된 예시 파일입니다.

## 원본

https://aistudio.google.com/apps/b917222e-a6ac-419e-93cd-890b49a347ae
