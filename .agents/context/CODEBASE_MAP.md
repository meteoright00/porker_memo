# コードベースマップ

> AIエージェントが「どのファイルを読むべきか」を即座に判断するためのマップ。
> ファイルの追加・削除・リネーム時に更新すること。
>
> **最終更新**: 2026-04-05
> **更新トリガー**: ファイルの追加・削除・リネーム

---

## プロジェクト概要

**Poker Note** — テキサスホールデムのハンド記録・分析PWA。
モバイルファースト、オフラインファースト。

---

## ディレクトリ構造

```
porker_memo/
├── .agents/                    # AIエージェント向けハーネス
│   ├── context/                # ドメイン知識・アーキテクチャ文書
│   ├── workflows/              # 定型ワークフロー
│   ├── templates/              # プロンプトテンプレート
│   └── quality/                # 品質チェックリスト
├── src/
│   ├── components/             # UIコンポーネント
│   │   ├── analysis/           # ハンド分析UI
│   │   ├── common/             # 共通コンポーネント
│   │   ├── layout/             # レイアウトコンポーネント
│   │   ├── recording/          # ハンド記録ウィザード
│   │   ├── tournament/         # トーナメント関連UI
│   │   └── ui/                 # shadcn/ui プリミティブ
│   ├── data/                   # データ層 (Dexie.js)
│   ├── lib/                    # ユーティリティ (cn等)
│   ├── pages/                  # アプリケーションページ
│   ├── services/               # ビジネスロジックサービス
│   ├── types/                  # TypeScript型定義
│   └── utils/                  # ヘルパー関数
├── public/                     # 静的アセット
├── PROJECT_CONSTITUTION.md     # プロジェクト憲法
├── CLAUDE.md                   # Claude用指示ファイル
├── GEMINI.md                   # Gemini用指示ファイル
└── package.json                # 依存パッケージ管理
```

---

## ファイル一覧と役割

### 設定ファイル (ルート)

| ファイル | 役割 |
|---|---|
| `package.json` | 依存パッケージ、スクリプト定義 |
| `vite.config.ts` | Vite設定 + PWA設定 + Vitest設定 + パスエイリアス(`@/`) |
| `tsconfig.json` | TypeScript設定（参照ファイル） |
| `tsconfig.app.json` | アプリ用TS設定 |
| `tsconfig.node.json` | Node用TS設定 |
| `tailwind.config.js` | Tailwind CSS設定 |
| `postcss.config.js` | PostCSS設定 |
| `eslint.config.js` | ESLint設定 (flat config) |
| `components.json` | shadcn/ui設定 |
| `vercel.json` | Vercelデプロイ設定（SPAリダイレクト） |
| `vitest.setup.ts` | Vitestセットアップ (Testing Library) |

### エントリポイント

| ファイル | 役割 |
|---|---|
| `index.html` | HTMLエントリ |
| `src/main.tsx` | Reactエントリ（BrowserRouter設定） |
| `src/App.tsx` | ルーティング定義 |
| `src/index.css` | グローバルCSS + Tailwind |

### 型定義 (`src/types/`)

| ファイル | 役割 | 主要な型 |
|---|---|---|
| `hand.ts` | ハンド記録の型 | `HandRecord`, `Action`, `FilterCriteria` |
| `tournament.ts` | トーナメントの型 | `Tournament`, `StructureItem`, `ChipRecord`, `TournamentStatus` |

### データ層 (`src/data/`)

| ファイル | 役割 | テスト |
|---|---|---|
| `db.ts` | Dexie.jsデータベース定義 (IndexedDB) | — |
| `HandRepository.ts` | ハンド記録のCRUD操作 | `HandRepository.test.ts` ✅ |
| `TournamentRepository.ts` | トーナメントのCRUD操作 | `TournamentRepository.test.ts` ✅ |
| `ChipRecordRepository.ts` | チップ記録のCRUD操作 | `ChipRecordRepository.test.ts` ✅ |

### ビジネスロジック (`src/services/`)

| ファイル | 役割 | テスト |
|---|---|---|
| `DataManagementService.ts` | JSON Import/Export | `DataManagementService.test.ts` ✅ |

### ユーティリティ (`src/utils/`)

| ファイル | 役割 | テスト |
|---|---|---|
| `pokerLogic.ts` | ポジション定義、アクション順序、ハンド終了判定 | — (Pending) |
| `tagUtils.ts` | アクション系列からの自動タグ生成 | `tagUtils.test.ts` ✅ |
| `blindStructure.ts` | ブラインドレベル計算、M値計算 | `blindStructure.test.ts` ✅ |

### ページ (`src/pages/`)

| ファイル | 役割 | テスト |
|---|---|---|
| `TopPage.tsx` | トップページ（ナビゲーション） | `TopPage.test.tsx` ✅ |
| `HandRecordingPage.tsx` | ハンド記録ページ（ウィザードのコンテナ） | `HandRecordingPage.test.tsx` ✅ |
| `TournamentListPage.tsx` | トーナメント一覧ページ | `TournamentListPage.test.tsx` ✅ |
| `TournamentCreatePage.tsx` | トーナメント作成ページ | `TournamentCreatePage.test.tsx` ✅ |
| `TournamentDetailPage.tsx` | トーナメント詳細ページ（最大のファイル ~17KB） | `TournamentDetailPage.test.tsx` ✅ |

### ハンド記録コンポーネント (`src/components/recording/`)

| ファイル | 役割 | テスト |
|---|---|---|
| `HandWizard.tsx` | ハンド記録ウィザード本体（最大級 ~17KB） | `HandWizard.test.tsx` ✅ |
| `ActionInput.tsx` | アクション入力UI | `ActionInput.test.tsx` ✅ |
| `CardSelector.tsx` | カード選択グリッドUI | `CardSelector.test.tsx` ✅ |
| `PositionSelector.tsx` | ポジション選択UI | — |
| `ResultStep.tsx` | 結果入力ステップ | `ResultStep.test.tsx` ✅ |

### トーナメントコンポーネント (`src/components/tournament/`)

| ファイル | 役割 | テスト |
|---|---|---|
| `TournamentForm.tsx` | トーナメント作成/編集フォーム | `TournamentForm.test.tsx` ✅ |
| `StructureEditor.tsx` | ブラインドストラクチャー管理（CSVインポート対応） | `StructureEditor.test.tsx` ✅ |
| `ChipRecordForm.tsx` | チップ記録フォーム | `ChipRecordForm.test.tsx` ✅ |
| `ChipHistoryList.tsx` | チップ記録履歴表示 | `ChipHistoryList.test.tsx` ✅ |
| `TournamentChart.tsx` | チップ推移チャート（Recharts） | `TournamentChart.test.tsx` ✅ |


### 共通コンポーネント (`src/components/common/`, `src/components/layout/`)

| ファイル | 役割 |
|---|---|
| `common/ErrorBoundary.tsx` | エラーバウンダリ |
| `layout/` | レイアウト関連コンポーネント |

### shadcn/ui (`src/components/ui/`)

shadcn/ui のプリミティブコンポーネント群。直接編集しないこと。

---

## 機能別ファイルグルーピング

### 🃏 ハンド記録機能
```
src/types/hand.ts                    # 型定義
src/data/HandRepository.ts           # データアクセス
src/utils/pokerLogic.ts             # ポジション・アクション順序
src/utils/tagUtils.ts               # 自動タグ付け
src/pages/HandRecordingPage.tsx     # ページコンテナ
src/components/recording/*          # UIコンポーネント群
```

### 🏆 トーナメント管理機能
```
src/types/tournament.ts              # 型定義
src/data/TournamentRepository.ts     # トーナメントデータアクセス
src/data/ChipRecordRepository.ts     # チップ記録データアクセス
src/utils/blindStructure.ts         # ブラインドレベル・M値計算
src/pages/TournamentListPage.tsx    # 一覧ページ
src/pages/TournamentCreatePage.tsx  # 作成ページ
src/pages/TournamentDetailPage.tsx  # 詳細ページ（最も複雑）
src/components/tournament/*         # UIコンポーネント群
```

### 💾 データ管理機能
```
src/data/db.ts                       # DB定義（Dexie.js + IndexedDB）
src/services/DataManagementService.ts # Import/Export
```

---

## ホットスポット (頻繁に変更されるファイル)

| ファイル | 理由 |
|---|---|
| `src/components/recording/HandWizard.tsx` | ハンド記録のメインロジック、UI改善が頻繁 |
| `src/pages/TournamentDetailPage.tsx` | 最も機能が集中するページ |
| `src/components/tournament/StructureEditor.tsx` | ストラクチャー関連機能の追加 |
| `src/components/recording/ActionInput.tsx` | アクション入力UIの改善 |

---

## ルーティング

| パス | ページ | 説明 |
|---|---|---|
| `/` | `TopPage` | トップページ |
| `/record` | `HandRecordingPage` | ハンド記録 |
| `/tournaments` | `TournamentListPage` | トーナメント一覧 |
| `/tournaments/new` | `TournamentCreatePage` | トーナメント作成 |
| `/tournaments/:id` | `TournamentDetailPage` | トーナメント詳細 |

---

## DBスキーマ (Dexie.js)

```
Version 1: hands:   '++id, uuid, date, tags'
Version 2: tournaments: '++id, name, status, startDate'
           chipRecords: '++id, tournamentId, timestamp'
Version 3: hands:   '++id, uuid, date, tags, tournamentId'
```
