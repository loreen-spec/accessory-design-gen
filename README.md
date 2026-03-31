# Accessory DesignGen (부자재 도안 생성기)

자동화된 의류 부자재 도안 생성 및 관리 시스템입니다. 바코드택, 가격택, 케어라벨을 실시간으로 생성하고 PDF/PNG로 일괄 다운로드할 수 있습니다.

## 🚀 주요 기능

### 1. 바코드택 (80x40mm)
- **동적 바코드 생성**: 입력된 SKU(품번)를 바탕으로 실시간 Code 128 바코드 생성.
- **사이즈별 자동 반영**: 선택한 사이즈 범위에 맞춰 품번과 바코드가 자동으로 생성됩니다.

### 2. 가격택 (40x80mm)
- **듀얼 바코드 지원**: 상단과 하단 두 곳에 실시간 바코드 노출.
- **권장연령 자동 계산**: 사이즈 정보를 바탕으로 KC 기준 권장연령 자동 산출.
- **절취선 및 타공 가이드**: 실제 제작 공정을 위한 가이드라인 포함.

### 3. 케어라벨 (30x73mm)
- **세탁 기호 가이드**: v4 표준 세탁 기호 포함 및 고품질 벡터 렌더링.
- **다중 혼용률 지원**: 엔터 키를 이용한 여러 줄의 혼용률 및 주소 입력 지원.
- **KC 로고 최적화**: 규격에 맞는 KC 로고 자동 배치.

## 🛠 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Libraries**: `jspdf`, `svg2pdf.js`, `file-saver`, `jszip`

## 📦 배포 방법 (Vercel)

이 프로젝트는 Next.js로 제작되어 Vercel에서 가장 쉽게 배포할 수 있습니다.

1. **GitHub 저장소 생성**: 새 GitHub 저장소를 만들고 코드를 푸시합니다.
   - `.gitignore`에 의해 `node_modules`와 `.next` 폴더는 자동으로 제외됩니다.
2. **Vercel 연결**:
   - [Vercel Dashboard](https://vercel.com/dashboard)에서 `Add New` -> `Project` 선택.
   - 생성한 GitHub 저장소를 연결합니다.
3. **설정 확인**:
   - **Framework Preset**: `Next.js` (자동 인식됨)
   - **Build Command**: `npm run build`
   - **Environment Variables**: 현재 필요 없음 (비워두세요)
4. **Deploy**: `Deploy` 버튼을 누르면 배포 완료!

## 💻 로컬 개발 환경 실행

```bash
npm install
npm run dev
```

`http://localhost:3000`에서 확인 가능합니다.
