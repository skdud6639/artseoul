# 개발 및 검증 규칙

- 화면과 기능 변경은 작업 브랜치에서 진행한다. 사용자 승인 없이 main에 반영하지 않는다.
- main 반영 승인은 해당 작업 단위에만 적용한다. 이미 승인한 작업의 검증과 반영을 위해 같은 승인을 반복 요청하지 않는다.
- Prettier 설정은 `.prettierrc.json`을 따른다. 작은따옴표와 후행 쉼표를 사용한다.
- ESLint의 타입 기반 TypeScript 검사, React Hooks, React Refresh 규칙을 유지한다.
- 타입 오류를 숨기기 위한 `any`, 검사 비활성화, 규칙 완화를 추가하지 않는다.
- 변경 후 `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run build`를 실행한다. 포맷은 `npm run format`으로 정리한다.
- 해당 작업으로 시작된 GitHub Actions 결과를 확인한다. 실패하면 로그와 원인을 확인하여 수정한다. 로컬 통과를 GitHub CI 통과로 보고하지 않는다.
- 사용자 변경을 덮어쓰거나 force push하지 않는다.
- 개발 서버와 미리보기는 3000번 포트를 유지하며, 포트가 사용 중이면 다른 포트로 자동 변경하지 않는다.
