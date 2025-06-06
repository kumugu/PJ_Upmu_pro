# 업무 관리 시스템 (Upmu)

현대적이고 직관적인 UI/UX를 갖춘 업무 일정 및 급여 관리 시스템

## 주요 기능

- **실시간 대시보드**  
  진행 중인 업무, 근무 일수, 급여 예상액 등을 한눈에 확인
- **글래스모피즘 디자인**  
  투명한 레이어와 부드러운 그림자 효과로 현대적인 UI 구현
- **다크/라이트 모드**  
  사용자 선호에 따라 테마 전환 가능
- **PWA 지원**  
  모바일 및 데스크톱에서 앱처럼 설치/사용 가능
- **Supabase 연동**  
  실시간 데이터 동기화 및 안정적인 백엔드 서비스

## 기술 스택

**Frontend**  
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)  
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)  
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)  

**Backend**  
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)  

**Deployment**  
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)  

## 설치 및 실행

1. 저장소 복제

```bash
git clone https://github.com/your-username/workflow-system.git
```
2. 의존성 설치

```bash
npm install
```

3. 환경변수 설정 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. 개발 서버 실행

```bash
npm run dev
```

## 스크린샷

| 다크 모드 대시보드                            | 라이트 모드 대시보드                             |
| --------------------------------------------- | ------------------------------------------------ |
| ![다크 모드](/screenshots/dark-dashboard.png) | ![라이트 모드](/screenshots/light-dashboard.png) |



## 기여하기

1. 저장소를 포크(Fork)
2. 기능 브랜치 생성

```bash
git checkout -b feature/your-feature
```

3. 변경사항 커밋

```bash
git commit -m 'Add some feature'
```

4. 브랜치 푸시

```bash
git push origin feature/your-feature
```

5. 풀 리퀘스트(Pull Request) 생성
