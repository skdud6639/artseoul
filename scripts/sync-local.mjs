import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { currentBranch, syncRepository } from './sync-repository.mjs';

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  const branch = await currentBranch(cwd);
  console.log(`[sync] ${branch} 브랜치의 원격 변경을 한 번 확인합니다.`);
  const result = await syncRepository(cwd, branch);
  if (result.state === 'current') {
    console.log('[sync] 이미 최신 상태입니다.');
  } else if (result.state === 'updated') {
    console.log(
      `[sync] ${result.revision} 반영 완료. 실행 중인 개발 서버에서 자동 반영됩니다.`,
    );
    if (result.needsInstall)
      console.log(
        '[sync] 의존성이 변경되었습니다. 기존 서버를 종료하고 npm start로 다시 실행하세요.',
      );
  } else {
    console.error(
      '[sync] 로컬 변경·별도 커밋 또는 브랜치 변경이 있어 중단했습니다. 파일은 덮어쓰지 않았습니다.',
    );
    process.exitCode = 1;
  }
} catch {
  console.error(
    '[sync] 원격 변경을 받지 못했습니다. 프로젝트 경로, 브랜치와 GitHub 연결을 확인해 주세요.',
  );
  process.exitCode = 1;
}
