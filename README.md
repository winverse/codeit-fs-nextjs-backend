# 영화 리뷰 백엔드 API

Next.js 학습용 TMDB 연동 영화 리뷰 백엔드 API입니다.

## 기술 스택

- **Runtime**: Node.js 22+
- **Framework**: Express 5
- **ORM**: Prisma 7 (PostgreSQL)
- **API Docs**: Swagger UI
- **Validation**: Zod

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. PostgreSQL 데이터베이스 설정

PostgreSQL이 실행 중인지 확인하고, `movie_review` 데이터베이스를 생성합니다:

```bash
# 데이터베이스 생성
psql -U postgres -c "CREATE DATABASE movie_review;"
```

### 3. 환경 변수 설정

`env/.env.development` 파일을 수정합니다:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/movie_review
TMDB_API_KEY=YOUR_TMDB_API_KEY
TMDB_BASE_URL=https://api.themoviedb.org/3
```

> **TMDB API Key**: https://www.themoviedb.org/settings/api 에서 발급

### 4. Prisma 설정

```bash
# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 스키마 동기화
npm run prisma:push
```

### 5. 개발 서버 실행

```bash
npm run dev
```

- **API 서버**: http://localhost:5005
- **Swagger UI**: http://localhost:5005/api-docs

## API 엔드포인트

| Method | Endpoint                          | 설명                |
| ------ | --------------------------------- | ------------------- |
| GET    | `/api/movies`                     | 인기 영화 목록      |
| GET    | `/api/movies/search?q=검색어`     | 영화 검색           |
| GET    | `/api/movies/:id`                 | 영화 상세 + 리뷰    |
| GET    | `/api/movies/:id/reviews`         | 특정 영화 리뷰 목록 |
| POST   | `/api/movies/:id/reviews`         | 리뷰 작성           |
| GET    | `/api/movies/:id/recommendations` | 추천 영화           |

## 프로젝트 구조

```
backend/
├── env/                    # 환경 변수
│   ├── .env.development
│   └── .env.example
├── prisma/
│   └── schema.prisma       # Prisma 스키마
├── src/
│   ├── config/             # 환경 설정, Swagger
│   ├── constants/          # HTTP 상태, 에러 메시지
│   ├── db/                 # Prisma 클라이언트
│   ├── exceptions/         # 예외 클래스
│   ├── middlewares/        # CORS, 에러핸들러, 검증
│   ├── repository/         # DB CRUD
│   ├── routes/             # API 라우트
│   ├── services/           # TMDB API 연동
│   ├── utils/              # 유틸리티
│   └── server.js           # 엔트리포인트
└── package.json
```

## 스크립트

| 명령어                    | 설명                   |
| ------------------------- | ---------------------- |
| `npm run dev`             | 개발 서버 실행         |
| `npm run prisma:generate` | Prisma 클라이언트 생성 |
| `npm run prisma:push`     | DB 스키마 동기화       |
| `npm run prisma:studio`   | Prisma Studio 실행     |
| `npm run format`          | 코드 포맷팅            |
| `npm run lint`            | ESLint 검사            |
