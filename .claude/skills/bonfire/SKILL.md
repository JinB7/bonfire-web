---
name: bonfire
description: Bonfire 디자인 시스템으로 화면·컴포넌트를 Tailwind v4 + shadcn/ui로 구현·수정·리뷰할 때 사용. bonfire.tokens.json 토큰이 globals.css에서 어떤 유틸리티 클래스로 매핑되는지, 어디에 쓰고 무엇을 쓰면 안 되는지, 화면 규칙(흰 버튼 하나, voice quote, 460:215 이미지, 그림자 금지)을 정리한 기준 문서.
---

# Bonfire 디자인 시스템 (Tailwind v4 + shadcn/ui)

게임불감증 유저가 다른 사람이 상황별로 묶은 게임 목록에서 "지금 내 상태"에 맞는 게임을 찾는 서비스. **다크 전용**(`<html>`에 `dark` 고정), 데스크톱 기준 설계(시안 1920) + 태블릿·모바일 반응형, 문구는 한국어.

- 토큰 원본: `bonfire.tokens.json` — 값과 용도(usage)의 기준
- 구현: `src/app/globals.css` — `:root` Bonfire 변수 + `@theme`로 Tailwind 유틸리티 매핑. shadcn 변수도 Bonfire 값을 가리킨다
- 글꼴: Pretendard 하나(`src/app/layout.tsx`, `next/font/local`). `<html>`에 `font-sans`가 있어 따로 지정하지 않는다
- 컴포넌트별 스펙: 디자인 시스템 원본 https://claude.ai/artifact/XGeMcrDyAvN3fUR8pkK4BY 의 `project/components/<이름>/README.md`
- 컴포넌트에서는 **아래 표의 클래스만** 쓴다. 토큰 이름을 클래스에 그대로 옮기지 않는다 (`text-text-primary` ✗ → `text-fg` ✓).

## 가장 흔한 실수

### 1. Tailwind와 이름은 같은데 값이 다르다

globals.css가 Bonfire 값으로 덮어썼다. Tailwind 기본값을 떠올려 계산하지 않는다.

| 클래스                                   | Bonfire 값              | Tailwind 기본값          |
| ---------------------------------------- | ----------------------- | ------------------------ |
| `rounded-xs` `sm` `md` `lg` `xl`         | 4 / 6 / 8 / 10 / 16px   | 2 / 4 / 6 / 8 / 12px     |
| `leading-tight` `normal` `relaxed`       | 1.4 / 1.5 / 1.6         | 1.25 / 1.5 / 1.625       |
| `tracking-tight` `wide`                  | -0.0125em / 0.015em     | -0.025em / 0.025em       |
| `ease-out`                               | CSS `ease-out`          | cubic-bezier(0,0,0.2,1)  |

### 2. 토큰 이름 ≠ 클래스 이름

- 글자 색 토큰 `text-*` → 클래스 `*-fg-*`: `text-primary` → `text-fg`, `text-tertiary` → `text-fg-tertiary`
- 테두리 토큰 `border-*` → 클래스 `*-line-*`: `border` → `border-line`, `border-strong` → `border-line-strong`
- **`text-primary` 클래스는 흰색**(primary 버튼 면 색)이다. 본문 글자가 아니다.
- `bg-gray-950`, `text-gray-400`은 Tailwind 팔레트라 Bonfire 회색과 값이 다르다. 프리미티브(`gray-*`, `white`, `black`)는 클래스로도 `var()`로도 쓰지 않는다.

### 3. 간격 토큰 숫자 ≠ Tailwind 숫자

간격은 Tailwind 기본 4px 스텝을 쓴다. `p-md` 같은 이름 클래스는 없다(만들면 `max-w-md`가 12px로 바뀌어서 만들지 않았다).

| 토큰        | 값   | Tailwind 스텝         |
| ----------- | ---- | --------------------- |
| spacing-xxs | 2px  | `0.5` (`p-0.5` …)     |
| spacing-xs  | 4px  | `1`                   |
| spacing-sm  | 8px  | `2`                   |
| spacing-md  | 12px | `3`                   |
| spacing-lg  | 16px | `4`                   |
| spacing-xl  | 24px | `6`                   |
| spacing-xxl | 32px | `8`                   |
| spacing-3xl | 48px | `12`                  |
| spacing-4xl | 64px | `16`                  |

간격(`p-*` `m-*` `gap-*` `space-*`)의 허용 스텝은 `0, 0.5, 1, 2, 3, 4, 6, 8, 12, 16`뿐이다. `5, 7, 10 …`은 쓰지 않는다.

## 색상

색은 이미지가 담당한다. UI는 무채색이고, 유채색은 `danger`, `focus-ring`, `naver`, `kakao`뿐이다. 새 유채색을 더하지 않는다.

| 면                    | 토큰               | 용도                                                       |
| --------------------- | ------------------ | ---------------------------------------------------------- |
| `bg-canvas`           | canvas             | 페이지 배경(깊이 0), 헤더                                  |
| `bg-surface`          | surface            | 놓인 것: 카드, 편집 행                                     |
| `bg-surface-elevated` | surface-elevated   | 입력: 입력창 내부, 카드 뒤 먼 판                           |
| `bg-surface-overlay`  | surface-overlay    | 떠 있는 것: 메뉴, 자동완성, 다이얼로그, 토스트, 카드 hover |
| `bg-surface-selected` | surface-selected   | 선택·활성 배경, 투명 배경 요소의 hover                     |

| 글자                | 토큰           | 용도                                                         |
| ------------------- | -------------- | ------------------------------------------------------------ |
| `text-fg`           | text-primary   | 제목, 사람의 말, 입력한 글자                                 |
| `text-fg-secondary` | text-secondary | 보조 본문, 태그, 메뉴 항목                                   |
| `text-fg-tertiary`  | text-tertiary  | 메타 정보, 게임 설명, 안내 문구, placeholder, 비활성 탭      |
| `text-fg-disabled`  | text-disabled  | **비활성 글자에만** (canvas 위 3.78:1이라 본문 금지)         |

| 테두리                | 토큰            | 용도                                                       |
| --------------------- | --------------- | ---------------------------------------------------------- |
| `border-line`         | border          | 기본 테두리, 구분선. 스켈레톤·태그 라벨·이미지 자리 면은 `bg-line` |
| `border-line-strong`  | border-strong   | 누를 수 있는 것: 버튼, 입력창, 칩, 패널                    |
| `border-line-selected`| border-selected | 선택된 칩, 저장됨, 드래그 중                               |
| `border-line-voice`   | border-voice    | 사람의 말 왼쪽 세로줄                                      |

`border`만 써도 색은 `line`이다(globals.css base 레이어). 다른 테두리 색일 때만 색 클래스를 붙인다.

| 그 밖                                   | 용도                                               |
| --------------------------------------- | -------------------------------------------------- |
| `bg-primary` / `bg-primary-pressed`     | 흰 버튼 면 / 누른 상태                             |
| `text-on-primary`                       | 흰 버튼 위 글자(검정)                              |
| `bg-danger` `text-danger` `border-danger` | 위험 버튼 면, 에러 문구·테두리                   |
| `text-on-danger`                        | 위험 버튼 위 글자(검정)                            |
| `outline-focus-ring` `border-focus-ring` | 포커스 (아래 상태 표)                             |
| `bg-scrim`                              | 다이얼로그 뒤 딤                                   |
| `bg-image-badge` `text-on-image`        | 이미지 위 배지와 그 글자                           |
| `bg-naver` `text-on-naver` / `bg-kakao` `text-on-kakao` | 소셜 로그인 버튼만               |

- `primary`·`danger` 배경에는 검정 글자(`text-on-primary`, `text-on-danger`)만 올린다. 흰 글자 금지.
- `border-line-strong`은 면 대비 1.37–1.55:1이라 상태 표시에 쓰지 않는다. 상태는 `border-line-selected`와 `focus-ring`이 맡는다.
- 태그를 축(시간·에너지·감정)별로 색칠하지 않는다.

## 타이포그래피

11개 스타일만 쓴다. 각 클래스에 크기·줄간격·굵기·자간이 모두 들어 있으므로 `font-medium` 같은 굵기, `leading-*`, `tracking-*`를 덧붙이지 않는다. Tailwind 기본 크기(`text-sm`, `text-lg` …)도 쓰지 않는다.

| 클래스             | 크기 / 굵기 / 줄간격 / 자간 | 용도                                       | 색                 |
| ------------------ | --------------------------- | ------------------------------------------ | ------------------ |
| `text-title-lg`    | 32 / 600 / 1.4 / tight      | 상세 페이지 제목 (데스크톱·태블릿)         | `text-fg`          |
| `text-title-md`    | 24 / 600 / 1.4 / tight      | 페이지 제목, 모바일 상세 제목              | `text-fg`          |
| `text-heading-lg`  | 20 / 600 / 1.4 / tight      | 섹션 제목                                  | `text-fg`          |
| `text-heading-md`  | 18 / 600 / 1.4 / tight      | 카드 제목, 게임 이름, 다이얼로그 제목, 워드마크 | `text-fg`      |
| `text-quote-lg`    | 18 / 400 / 1.6 / 0          | 사람의 말 (상세)                           | `text-fg`          |
| `text-quote-sm`    | 15 / 400 / 1.6 / 0          | 사람의 말 (카드)                           | `text-fg`          |
| `text-body-md`     | 16 / 400 / 1.6 / 0          | 본문, 입력창                               | `text-fg`          |
| `text-body-sm`     | 14 / 400 / 1.6 / 0          | 게임 설명, 다이얼로그 본문, 토스트         | `text-fg-tertiary` (토스트는 `text-fg`) |
| `text-label-md`    | 14 / 500 / 1.4 / 0          | 버튼, 탭, 칩, 메뉴, 필드 라벨              | 요소별 표 참고     |
| `text-caption`     | 13 / 400 / 1.5 / 0          | 메타, 안내·에러 문구, 카운터, 태그         | `text-fg-tertiary` (에러는 `text-danger`) |
| `text-caption-sm`  | 12 / 500 / 1.4 / wide       | 숫자 배지, 아바타 글자. `tabular-nums`를 함께 쓴다 | `text-fg`  |

- 사람의 말은 `text-quote-*` + `text-fg`로 크게, 정보는 `text-body-sm`·`text-caption` + `text-fg-tertiary`로 작게.
- 입력창 글자는 `text-body-md`(16) 이상이다. iOS 자동 확대를 막는다.
- 한글 줄바꿈(`word-break: keep-all`)은 body에 전역으로 걸려 있다.

## 모양·크기·모션

| 모서리         | 값   | 용도                                   |
| -------------- | ---- | -------------------------------------- |
| `rounded-xs`   | 4    | 태그 라벨, 배지                        |
| `rounded-sm`   | 6    | 썸네일, 목록 항목, 스켈레톤            |
| `rounded-md`   | 8    | 버튼, 입력창, 카드 이미지, 편집 행     |
| `rounded-lg`   | 10   | 카드, 팝오버, 토스트                   |
| `rounded-xl`   | 16   | 다이얼로그                             |
| `rounded-full` | pill | 필터 칩, 아바타                        |

누를 수 있는 칩은 pill(`rounded-full`), 읽기 전용 태그는 각진 라벨(`rounded-xs`)이다.

| 크기                                   | 값              | 용도                                                         |
| -------------------------------------- | --------------- | ------------------------------------------------------------ |
| `h-control-sm`                         | 32              | 작은 버튼, 필터 칩(데스크톱)                                 |
| `h-control-md` / `size-control-md`     | 40              | 버튼·아이콘 버튼·목록 항목(데스크톱), 필터 칩(모바일)        |
| `h-control-lg` / `size-control-lg`     | 44              | 입력창, 탭, 토스트, 버튼·아이콘 버튼(모바일)                 |
| `h-control-xl`                         | 48              | 소셜 로그인 버튼                                             |
| `size-icon-xs` `sm` `md` `lg`          | 12 / 16 / 20 / 32 | 숫자 배지 / 버튼 안 / 기본 / 빈 화면                       |
| `border` · `border-2` `outline-2`      | 1px · 2px       | 테두리 두께는 이 두 가지뿐                                   |

그 밖의 고정 크기는 아래 "허용된 임의값"과 컴포넌트 스펙 숫자만 쓴다(헤더 `h-14` = 56, 아바타 `size-6` `size-8` `size-12` = 24/32/48).

**모션**

- hover·누름: `transition-colors duration-fast ease-out` (120ms)
- 패널·다이얼로그·토스트가 나타날 때: `duration-normal ease-out` (200ms). 디자인 시스템의 등장 효과는 fade-in 하나다. shadcn 컴포넌트의 zoom·slide 효과는 Bonfire 스펙에 맞출 때 뺀다.
- 예외는 스켈레톤 반복 하나: `animate-[pulse_1.4s_ease-out_infinite]`
- 움직임 줄이기 설정이면 멈춘다: `motion-reduce:transition-none`, `motion-reduce:animate-none`
- 카드 hover에 이미지 확대 같은 움직임을 넣지 않는다.

## 깊이 (그림자 없음)

| 단계 | 클래스                                              | 예                         |
| ---- | --------------------------------------------------- | -------------------------- |
| 0    | `bg-canvas`                                         | 페이지                     |
| 1    | `bg-surface border`                                 | 카드, 편집 행              |
| 2    | `bg-surface-overlay border border-line-strong`      | hover, 메뉴, 자동완성, 토스트 |
| 3    | 2단계 + 뒤에 `fixed inset-0 bg-scrim`               | 다이얼로그                 |

`shadow-*`를 쓰지 않는다. 경계는 항상 1px 테두리가 맡는다.

## 상태

상태는 **밝기 + 모양** 두 신호로 보여준다(체크, 밑줄, 채운 아이콘을 함께).

| 상태                 | 클래스                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------ |
| 포커스 (공통)        | `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring`  |
| 포커스 (입력창)      | `focus:border-2 focus:border-focus-ring focus:px-[calc(var(--spacing-md)-1px)]` — 두께가 1px 늘어난 만큼 패딩을 줄여 글자가 밀리지 않게 한다 |
| hover (투명 배경)    | `hover:bg-surface-selected` (아이콘 버튼은 `hover:text-fg`도)                              |
| hover (카드)         | `hover:bg-surface-overlay hover:border-line-strong`                                        |
| hover (필터 칩)      | `hover:bg-surface-overlay`                                                                 |
| 선택                 | `bg-surface-selected border-line-selected text-fg` + 모양 변화                             |
| 비활성               | `text-fg-disabled border-line` — 테두리를 남겨 모양이 사라지지 않게. `opacity-*`로 흐리게 하지 않는다 |
| 에러                 | `border-danger`, 아래 문구 `text-caption text-danger` + `CircleAlert` 아이콘               |

shadcn 기본 포커스(`outline-none focus-visible:ring-3 ring-ring/50`)는 Bonfire와 다르다. shadcn 컴포넌트를 쓸 때 위 포커스로 바꾼다.

## 버튼 변형

공통: `inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md border text-label-md transition-colors duration-fast ease-out motion-reduce:transition-none disabled:cursor-not-allowed` + 포커스(공통). 아이콘은 `size-icon-sm`.

| 변형      | 클래스                                                                                                                         | 예                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| primary   | `border-primary bg-primary text-on-primary active:border-primary-pressed active:bg-primary-pressed disabled:border-line-strong disabled:bg-canvas disabled:text-fg-disabled` | "목록 만들기"                      |
| secondary | `border-line-strong text-fg hover:bg-surface-selected active:bg-surface-selected disabled:border-line disabled:bg-transparent disabled:text-fg-disabled` | "링크 복사", "다시 시도", "취소"   |
| ghost     | `border-transparent text-fg-secondary hover:bg-surface-selected active:bg-surface-selected disabled:bg-transparent disabled:text-fg-disabled` | "로그인", "로그아웃", "선택 해제"  |
| danger    | `border-danger bg-danger text-on-danger disabled:border-line-strong disabled:bg-canvas disabled:text-fg-disabled`               | 확인 다이얼로그의 "삭제", "나가기"만 |

| 크기       | 높이                               | 좌우 패딩                       |
| ---------- | ---------------------------------- | ------------------------------- |
| 기본       | `h-control-lg md:h-control-md`     | `px-4` (ghost는 `px-3`)         |
| sm         | `h-control-sm` + 모바일 터치 영역  | `px-3`                          |

sm은 행 안의 보조 버튼("스팀에서 보기" + `ExternalLink`)과 헤더의 "목록 만들기"에 쓴다.

## 화면 규칙

1. **한 화면에 흰 버튼(`bg-primary`)은 하나.** 그 화면의 가장 중요한 행동에만 쓴다. 본문에 더 중요한 흰 버튼(등록, 수정 완료)이 있으면 헤더의 '목록 만들기'를 숨긴다.
2. **사람의 말은 voice quote.** 한 줄 소개와 추천 코멘트는 `border-l-2 border-line-voice pl-3 text-quote-lg text-fg`(카드 안은 `text-quote-sm`). 따옴표 문자를 넣지 않는다. 스토어 설명이나 안내 문구에는 쓰지 않는다.
3. **게임 이미지는 460:215.** `aspect-[460/215] w-full rounded-md bg-line object-cover`. 로딩 중이나 이미지가 없으면 `bg-line` 면(+ `Image` 아이콘 `text-fg-tertiary`)을 보여준다.
4. **가격, 평점, 별점을 보여주지 않는다.** ★는 편집 화면의 대표 지정에만 쓴다.
5. **아이콘은 `lucide-react`, `strokeWidth={1.75}`.** 크기는 `size-icon-*`. 상태가 있는 아이콘(저장 `Bookmark`, 대표 `Star`)은 켜지면 `fill="currentColor"`로 채운다. 이모지를 쓰지 않는다.
6. **로고:** 서비스명이 미정이라 워드마크는 텍스트(`text-heading-md text-fg`). 네이버·카카오 로고는 각 사 공식 파일을 쓴다. 다시 그리지 않는다.

## 문구

- 서비스 문구는 한국어. 버튼 라벨은 짧은 행동 이름: "목록 만들기", "링크 복사", "다시 시도", "스팀에서 보기", "삭제", "나가기", "취소".
- 숫자 라벨은 정해진 꼴: "저장 N" ↔ "저장됨 N", "게임 N개", "A, B 외 N개".
- 필수 입력은 라벨 뒤 "(필수)", 이미 담은 게임은 "담음", 대표 게임은 "대표".

## 반응형

- 구간: 접두어 없음 = 모바일(360–767) / `md:` 태블릿(768–1023) / `lg:` 데스크톱(1024+). `sm:` `xl:` `2xl:`은 쓰지 않는다.
- 페이지 틀(헤더도 같은 여백): 바깥 `px-4 md:px-6 lg:px-8`, 안쪽 `mx-auto max-w-[1200px]`. 콘텐츠 최대 폭 1200은 좌우 여백을 뺀 값이다.
- 헤더: `sticky top-0 z-50 h-14 border-b bg-canvas` + 위 페이지 틀. 그림자로 띄우지 않는다.

| 요소              | 클래스                                                                          |
| ----------------- | ------------------------------------------------------------------------------- |
| 버튼 높이         | `h-control-lg md:h-control-md`                                                  |
| 아이콘 버튼       | `size-control-lg md:size-control-md`                                            |
| 작은 버튼         | `h-control-sm` + 모바일 터치 영역                                               |
| 필터 칩           | `h-control-md md:h-control-sm` + 모바일 터치 영역                               |
| 필터 칩 묶음      | `flex gap-2 overflow-x-auto py-0.5 -my-0.5 [scrollbar-width:none] md:flex-wrap md:overflow-visible md:py-0 md:my-0` (모바일은 가로 스크롤, 넓힌 터치 영역이 잘리지 않게 위아래 2px) |
| 상세 제목         | `text-title-md md:text-title-lg`                                                |
| 게임 행           | `flex flex-col md:flex-row`, 썸네일 `w-full md:w-[184px]` + 게임 이미지 비율    |

**모바일 터치 영역(44×44 이상):** 보이는 크기가 44보다 작은 작은 버튼과 필터 칩은 투명한 `::after`로 누를 수 있는 범위만 넓힌다.

```
relative after:absolute after:top-1/2 after:left-1/2 after:size-[max(100%,var(--control-lg))] after:-translate-x-1/2 after:-translate-y-1/2 md:after:hidden
```

## shadcn/ui와 함께 쓰기

shadcn 변수는 Bonfire 값을 가리킨다. 그래서 `src/components/ui`의 shadcn 컴포넌트는 추가하자마자 Bonfire 색으로 그려진다.

| shadcn 변수                          | Bonfire 토큰       |
| ------------------------------------ | ------------------ |
| `background` / `foreground`          | canvas / text-primary |
| `card` / `card-foreground`           | surface / text-primary |
| `popover` / `popover-foreground`     | surface-overlay / text-primary |
| `primary` / `primary-foreground`     | primary / on-primary |
| `secondary`, `muted`, `accent`       | surface-selected   |
| `muted-foreground`                   | text-tertiary      |
| `destructive`                        | danger             |
| `border` / `input`                   | border / border-strong |
| `ring`                               | focus-ring         |
| `radius`                             | rounded-lg         |

- **우리 코드에서는 shadcn 이름 클래스(`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `bg-muted`, `border-input`, `ring-ring` …)를 쓰지 않는다.** 같은 색을 두 이름으로 쓰게 된다.
- shadcn 컴포넌트의 모양(높이, 포커스, hover, 등장 효과)은 shadcn 기본값이다. 화면에 쓸 때 Bonfire 스펙(위 표, 컴포넌트 README)에 맞춰 그 파일의 클래스를 Bonfire 이름으로 바꾼다.

## 허용된 임의값 (이것뿐)

| 임의값                                           | 용도                         |
| ------------------------------------------------ | ---------------------------- |
| `max-w-[1200px]`                                 | 콘텐츠 최대 폭               |
| `aspect-[460/215]`                               | 게임 이미지                  |
| `md:w-[184px]`                                   | 게임 행 썸네일(데스크톱·태블릿) |
| `max-w-[400px]`                                  | 다이얼로그, 토스트 폭        |
| `max-w-[360px]`                                  | 소셜 로그인 버튼 최대 폭     |
| `min-h-[72px]`                                   | 여러 줄 입력창 최소 높이     |
| `focus:px-[calc(var(--spacing-md)-1px)]`         | 입력창 포커스 패딩 보정      |
| `after:size-[max(100%,var(--control-lg))]`       | 모바일 터치 영역             |
| `animate-[pulse_1.4s_ease-out_infinite]`         | 스켈레톤                     |
| `[scrollbar-width:none]`                         | 필터 칩 묶음 가로 스크롤     |

## 금지

- hex·rgb 임의값과 인라인 색: `bg-[#111214]`, `text-[rgba(...)]`, `style={{ color: ... }}`
- 변수를 임의값으로 감싸기: `bg-[var(--canvas)]` → 표의 클래스(`bg-canvas`)를 쓴다
- Tailwind 기본 팔레트: `bg-white`, `text-black`, `*-gray-*`, `*-zinc-*`, `*-neutral-*` 등 (꺼져 있지 않아 생성은 되지만 쓰지 않는다)
- 불투명도 수식어로 새 색 만들기: `bg-primary/80`, `text-fg/70` → 정해진 토큰(`bg-primary-pressed` 등)을 쓴다
- 그림자: `shadow-*`, `drop-shadow-*`
- 표에 없는 반경: `rounded`, `rounded-2xl` `3xl` `4xl`, `rounded-[...]`
- 타이포 덧붙이기: `font-medium` `font-semibold` 등 굵기, `leading-*`, `tracking-*`, `text-sm` `text-lg` 등 기본 크기
- 구간: `sm:`, `xl:`, `2xl:`
- 포커스 제거·대체: 대체 없는 `outline-none`, `focus:ring-*`, `focus-visible:ring-*`
- 비활성을 `opacity-*`로 표현하기
- 허용 스텝 밖 간격: `p-5`, `gap-10`, `mt-1.5` 등
- 이모지

## 토큰에 없는 값을 만나면

값을 지어내지 않는다. 아래 순서로 확인한다.

1. `bonfire.tokens.json`의 usage 문구
2. 디자인 시스템 원본의 README와 컴포넌트 README (위 링크)
3. 그래도 없으면 작업을 멈추고 사용자에게 묻는다

새 토큰이 필요하면 globals.css에 직접 추가하지 않는다. 디자인 시스템에 먼저 추가하고(이름 패턴 `{분류}-{역할}[-{상태}]`, 컴포넌트 이름 금지, 새 유채색 금지), `bonfire.tokens.json`을 다시 가져온 뒤 globals.css에 매핑한다.

## 작성 후 자가 점검

이번에 만들거나 수정한 파일을 넣어 실행한다. 결과가 나오면 위 표 기준으로 고친다(허용된 임의값은 걸리지 않는다).

```bash
grep -nE \
  -e '\[#[0-9a-fA-F]{3,8}\]|rgba?\(|style=\{\{|\[var\(--' \
  -e '\b(bg|text|border|ring|outline|fill|stroke|divide)-(white|black|(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+)\b' \
  -e '\b(bg|text|border|ring|outline)-[a-z-]+/[0-9]+' \
  -e '\b(drop-)?shadow(-[a-z0-9]+)?\b' \
  -e '\brounded(-[a-z]{1,2})?-(2xl|3xl|4xl|\[)|\brounded([^a-z-]|$)' \
  -e '\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b|\b(leading|tracking)-|\btext-(xs|sm|base|lg|[2-9]?xl)\b' \
  -e '\b(sm|xl|2xl):[^[:space:]]' \
  -e '\boutline-none\b|\bfocus(-visible)?:ring' \
  -e '\bopacity-[0-9]' \
  -e '\btext-primary([^a-z-]|$)' \
  -e '\b(bg|text|border|ring|outline|fill|stroke)-(background|foreground|card|popover|muted|accent|secondary|destructive|border|input|ring)(-foreground)?\b|\b(text|bg|border)-primary-foreground\b|\bring-offset-' \
  -e '(^|[[:space:]"'"'"'`:])-?(p[xytrblse]?|m[xytrblse]?|gap(-[xy])?|space-[xy])-(5|7|9|10|11|1[3-5]|1[7-9]|[2-9][0-9]|[1-9]\.5)\b' \
  <파일들>
```
