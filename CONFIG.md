# hbtheme 설정 가이드

이 문서는 `hbtheme` 사용자가 **테마 동작을 바꾸기 위해 실제로 수정하는 값**만 안내합니다.

- 원본 참고: [HB Framework](https://hbstack.dev/), [hbstack/site content](https://github.com/hbstack/site/tree/main/content)
- 이 문서의 YAML 예시는 모두 `hugo.yml` 기준입니다. 즉, 테마 설정은 항상 `params.*` 아래에 둡니다.

## 필수 전제 설정

### 1) 테마 지정

```yaml
theme: hbtheme
```

### 2) 검색 인덱스 출력

```yaml
outputs:
  home:
    - HTML
    - RSS
    - SearchIndex
```

`SearchIndex`가 없으면 검색 UI가 보여도 결과가 비어 보일 수 있습니다.

## 가장 많이 바꾸는 설정

## 브랜드/테마 모드

```yaml
params:
  hb:
    color: dark
    logo: images/logo.png
    full_width: false
```

- `params.hb.color`: 기본 컬러 모드 (`light` 또는 `dark`)
- `params.hb.logo`: 로고 이미지 경로
- `params.hb.full_width`: 전체 너비 레이아웃 사용 여부

## 헤더

```yaml
params:
  hb:
    header:
      breakpoint: lg
      sticky: true
      full_width: true
      brand: <Blog Name>
      logo: true
```

- `breakpoint`: 메뉴 접힘 기준
- `sticky`: 스크롤 시 상단 고정
- `full_width`: 헤더 컨테이너 전체 너비 사용
- `brand`: 로고 옆 텍스트
- `logo`: 헤더에 로고 표시 여부

## 블로그 목록/카드

```yaml
params:
  hb:
    blog:
      paginate: 12
      list_style: ''
      list_cols_md: 2
      list_cols_lg: 3
      list_pinned_posts: 1
      post_read_more: false
      post_thumbnail: true
      post_thumbnail_position: top
      post_date_format: ':date_long'
```

- `paginate`: 목록 페이지당 글 수
- `list_style`: 기본 카드(`''`) 또는 미니멀(`minimalist`)
- `list_cols_md`, `list_cols_lg`: 목록 카드 열 수
- `list_pinned_posts`: `pinned: true` 글을 상단에서 우선 노출할 수
- `post_read_more`: 요약 아래 “더 읽기” 링크 노출
- `post_thumbnail*`: 썸네일 사용/배치/표시 방식

## 블로그 홈/사이드바/관련 글

```yaml
params:
  hb:
    blog:
      home:
        featured_posts: 3
      sidebar:
        position: end
        sticky: false
      related_posts:
        number: 10
        list_style: slide
```

- `home.featured_posts`: 홈 상단 강조 글 개수
- `sidebar.position`: `start` 또는 `end`
- `sidebar.sticky`: 사이드바 고정 스크롤
- `related_posts.*`: 본문 하단 관련 글 표시 방식

## 문서(Docs)

```yaml
params:
  hb:
    docs:
      date_format: ':date_long'
      navs_reduce_font_size: false
      navs_sticky_scroll: true
```

- `date_format`: 문서 날짜 포맷
- `navs_reduce_font_size`: 좌측 탐색 글자 축소
- `navs_sticky_scroll`: 탐색 영역 sticky 동작

## 섹션 경로 표시

```yaml
params:
  hb:
    sections:
      hide_blog: false
      hide_docs: false
```

- `hide_blog`: title, breadcrumb, page meta에서 블로그 루트 섹션을 숨김
- `hide_docs`: title, breadcrumb, page meta에서 문서 루트 섹션을 숨김
- 블로그 루트는 `blog`와 `b`, 문서 루트는 `docs`와 `d`를 지원합니다.
- `Blog` / `블로그`는 hbtheme i18n 값이 아니라 보통 `content/blog/_index.md` 또는 `content/b/_index.md`의 `title`에서 옵니다.

## 검색

```yaml
params:
  hb:
    search:
      modal: true
  search:
    threshold: 0.0
    distance: 100
    ignore_location: true
    min_match_char_length: 2
    index_content: true
    index_summary: true
    index_headings: true
    index_taxonomies: true
    expand_results_meta: true
```

- `params.hb.search.modal`: 검색 모달 UI 사용
- `params.search.threshold`: 검색 매칭 엄격도 (`0.0`에 가까울수록 엄격)
- `params.search.index_content`: 본문 전체까지 인덱싱할지 여부
- `params.search.expand_results_meta`: 결과 메타(연도/분류) 확장 표시

## 푸터/소셜

```yaml
params:
  hb:
    footer:
      powered_by: true
      socials:
        _color: true
        github: <GitHub Username>
        rss: true
```

- `powered_by`: 하단 “Built with …” 출력 여부
- `socials`: 푸터 소셜 링크
- `_color`: 소셜 아이콘 원래 브랜드 색상 사용 여부

## 테이블/헤딩 기호/진행바

```yaml
params:
  hb:
    tables:
      align: middle
      bordered: true
      striped: true
      hover: true
    heading_sign:
      symbol: '¶'
    progress_bar:
      height: 4px
```

- `tables.*`: Markdown 표 기본 스타일
- `heading_sign.symbol`: 제목 옆 링크 기호
- `progress_bar.height`: 상단 읽기 진행바 두께

## SEO/기본 카드 이미지

```yaml
params:
  images:
    - images/card-twitter.png
  seo:
    favicons:
      icon: images/logo.png
```

- `params.images`: Open Graph/Twitter 카드 기본 이미지
- `params.seo.favicons.icon`: 기본 파비콘 파일

## 이 레포 기준 추천 설정값

아래는 현재 `config/_default/params.yml`에 맞춘 추천 베이스입니다.

```yaml
params:
  hb:
    color: dark
    full_width: false
    back_to_top:
      icon_name: arrow-up-circle
    heading_sign:
      symbol: '¶'
    progress_bar:
      height: 4px
    sections:
      hide_blog: true
    tables:
      align: middle
    header:
      brand: <Blog Name>
      socials:
        github: <GitHub Username>
        rss: true
    footer:
      socials:
        _color: true
        github: <GitHub Username>
        rss: true
    blog:
      paginate: 12
      post_read_more: false
      home:
        featured_posts: 3
      related_posts:
        list_style: slide
      sidebar:
        position: end
        sticky: false
    docs:
      meta:
        authors: false
    terms:
      paginate: 12
      profile: false
  images:
    - images/card-twitter.png
  search:
    threshold: 0.0
    ignore_location: true
    min_match_char_length: 2
    index_content: true
    expand_results_meta: true
  seo:
    favicons:
      icon: images/logo.png
  summary:
    length: 150
```

## 자주 생기는 문제 빠른 확인

1. 검색 결과가 없음: `outputs.home`에 `SearchIndex`가 있는지 확인합니다.
2. 아이콘이 안 보임: npm 아이콘 패키지가 설치되어 있는지, 또는 사이트/테마의 `assets/icons/<vendor>/<name>.svg` 로컬 아이콘이 있는지 확인합니다.
3. 로고가 안 보임: `params.hb.logo` 경로의 이미지 파일 존재 여부를 확인합니다.
4. 검색 정확도가 이상함: `params.search.threshold`, `min_match_char_length`, `index_content`를 먼저 조정합니다.
