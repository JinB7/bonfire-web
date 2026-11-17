LLM 코딩 실수를 줄이기 위한 행동 지침. 사소한 작업은 상황에 맞게 판단할 것.

## 1. 코딩 전에 생각하기

- 가정은 명시하고, 불확실하면 질문한다.
- 해석이 여러 가지면 임의로 고르지 말고 제시한다.
- 더 단순한 방법이 있으면 말한다.

## 2. 단순하게

- 요청받은 것만 구현한다. 추측성 기능·추상화·설정 옵션 금지.
- 일어날 수 없는 상황에 대한 에러 처리 금지.
- 200줄을 50줄로 쓸 수 있으면 다시 쓴다.

## 3. 필요한 부분만 수정

- 주변 코드·주석·포맷을 "개선"하지 않는다. 기존 스타일을 따른다.
- 관련 없는 죽은 코드는 지우지 말고 언급만 한다.
- 내 변경으로 안 쓰이게 된 import/변수/함수만 제거한다.
- 모든 변경 라인은 사용자 요청과 직접 연결돼야 한다.

## 4. 목표 기반 실행

- 작업을 검증 가능한 목표로 바꾼다. (예: "버그 수정" → "재현 테스트 작성 후 통과시키기")
- 여러 단계 작업은 단계별 계획과 검증 방법을 먼저 짧게 적는다.

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx                  # 앱 전체에 걸친 요소 (Header)
│   ├── page.tsx                    # 홈. 섹션 배치만
│   ├── _components/                # 이 page 전용 섹션 (SituationFilterSection, ListFeedSection). 라우트마다 page.tsx 옆에 둔다
│   └── lists/                      # 목록 만들기 new
├── features/                       # 도메인 코드는 도메인 폴더에 모은다
│   └── <도메인>/
│       ├── api/
│       │   ├── <도메인>.api.ts     # API 호출 함수
│       │   └── <도메인>.keys.ts    # 쿼리 키
│       ├── hooks/                  # 쿼리·뮤테이션 훅
│       ├── components/             # 조합 재료
│       └── types/<도메인>.ts       # 도메인 타입
├── components/                     # 도메인 무관 공용 UI (Header, PageLayout)
│   └── ui/                         # shadcn/ui 프리미티브 (Button, Autocomplete). shadcn CLI가 생성하는 위치
├── hooks/                          # 앱 공용 훅
└── lib/
    ├── api/                        # HTTP 인프라만. 엔드포인트 호출은 두지 않는다
    │   ├── client.ts               # axios 인스턴스, 응답에서 data만 꺼내는 요청 함수 (api, apiRequest)
    │   └── types.ts                # 공통 응답 타입 (ApiResponse<T>, ApiError)
    └── styles/
        └── utils.ts                # cn() (Bonfire 클래스를 등록한 tailwind-merge)
```

### 규칙

- 파일·폴더명은 kebab-case, 역할 접미사는 점으로 구분한다 (`game-list.api.ts`, `use-game-lists.ts`). 괄호 안은 export 이름이다
- api/에는 React 없는 서버 통신 코드(fetch 함수, 쿼리 키)만 두고, React 훅은 hooks/에 둔다
- 컴포넌트는 `function` 선언으로 쓰고 named export만 쓴다. 라우트 파일(page, layout, loading, error 등)은 Next.js 규칙대로 default export
- props 타입은 `interface XxxProps`로 정의하고 export한다. union·조건부 타입이 필요할 때만 `type`
- `src/components/ui/`의 shadcn 파일은 CLI가 만든 형태를 유지한다 (위 두 규칙 예외)
- shadcn 레지스트리에 없는 Base UI 부품은 shadcn 파일 형식으로 직접 작성해 `src/components/ui/`에 두고, 스타일은 Bonfire 토큰으로 입힌다 (예: `autocomplete.tsx`)
