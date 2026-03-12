# 🌿 복지 서비스 설문조사 시스템 — 배포 가이드

## 전체 흐름 요약
Firebase (데이터 저장) → Vercel (웹사이트 호스팅) → 링크 공유

---

## STEP 1. Firebase 프로젝트 만들기

1. https://console.firebase.google.com 접속 → Google 계정으로 로그인
2. **[프로젝트 추가]** 클릭 → 프로젝트 이름 입력 (예: `welfare-survey`) → 만들기
3. 왼쪽 메뉴에서 **[빌드] → [Realtime Database]** 클릭
4. **[데이터베이스 만들기]** → **테스트 모드로 시작** 선택 → 위치는 `asia-southeast1` 선택 → 완료
5. 왼쪽 메뉴 상단 **[프로젝트 개요]** 옆 톱니바퀴 → **[프로젝트 설정]**
6. 아래로 스크롤 → **내 앱** 섹션 → `</>` (웹) 아이콘 클릭
7. 앱 닉네임 입력 → **[앱 등록]**
8. 아래 `firebaseConfig` 코드 블록이 나타납니다. **그 값들을 복사해두세요.**

---

## STEP 2. Firebase 설정값 입력하기

`src/firebase.js` 파일을 열어서 아래 부분을 채워주세요:

```js
const firebaseConfig = {
  apiKey:            "복사한_값_입력",
  authDomain:        "복사한_값_입력",
  databaseURL:       "복사한_값_입력",   // ← https://프로젝트명-default-rtdb.firebaseio.com 형태
  projectId:         "복사한_값_입력",
  storageBucket:     "복사한_값_입력",
  messagingSenderId: "복사한_값_입력",
  appId:             "복사한_값_입력",
};
```

> ⚠️ databaseURL이 없으면 Realtime Database 콘솔 상단에서 직접 복사하세요.
> 형태: `https://프로젝트명-default-rtdb.asia-southeast1.firebasedatabase.app`

---

## STEP 3. GitHub에 올리기

1. https://github.com 가입 / 로그인
2. 우측 상단 **[+] → [New repository]** 클릭
3. Repository name: `welfare-survey` → **[Create repository]**
4. 아래 명령어를 터미널에서 실행 (이 폴더 안에서):

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/내아이디/welfare-survey.git
git push -u origin main
```

> 💡 터미널이 없으면 GitHub Desktop 앱을 사용하면 드래그앤드롭으로 가능합니다.

---

## STEP 4. Vercel로 배포하기

1. https://vercel.com 접속 → **[Sign up with GitHub]** 로 로그인
2. **[Add New Project]** 클릭
3. GitHub에서 `welfare-survey` 저장소 선택 → **[Import]**
4. Framework Preset: **Vite** 자동 감지됨
5. **[Deploy]** 클릭 → 1~2분 후 완료!
6. 🎉 `https://welfare-survey-xxx.vercel.app` 형태의 링크 생성!

---

## STEP 5. Firebase 보안 규칙 설정 (중요!)

배포 후 Firebase 콘솔 → Realtime Database → **[규칙]** 탭에서 아래로 변경:

```json
{
  "rules": {
    "config": {
      ".read": true,
      ".write": true
    },
    "responses": {
      ".read": true,
      ".write": true
    }
  }
}
```

→ **[게시]** 클릭

> ⚠️ 실제 운영 시에는 관리자만 config를 수정할 수 있도록 인증 규칙을 추가하는 것을 권장합니다.

---

## 완료 후 사용법

- **설문 링크**: Vercel이 발급한 URL을 클라이언트에게 공유
- **편집**: 우측 상단 ⚙ 편집 버튼 → 내용 수정 → 저장 (Firebase에 즉시 반영)
- **응답 확인**: Firebase 콘솔 → Realtime Database → `responses` 노드에서 확인

---

## 문의 / 문제 발생 시

Firebase 설정에서 막히는 부분이 있으면 각 단계의 오류 메시지를 확인해주세요.
가장 흔한 문제: `databaseURL` 누락 → firebase.js에서 직접 입력 필요
