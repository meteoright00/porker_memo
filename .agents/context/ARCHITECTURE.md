# アーキテクチャ詳細

> プロジェクトの内部構造、データフロー、設計原則をAIエージェントが理解するためのリファレンス。
>
> **最終更新**: 2026-04-05
> **更新トリガー**: ルーティング変更、コンポーネント構成変更、型定義変更、DBスキーマ変更、依存パッケージ追加/削除

---

## 1. 技術スタック

| レイヤー | 技術 | バージョン |
|---|---|---|
| フレームワーク | React + TypeScript | React 18, TS ~5.6 |
| ビルドツール | Vite | 6.x |
| スタイリング | Tailwind CSS | 3.x |
| UIライブラリ | shadcn/ui (Radix UI) + Lucide React | — |
| フォーム | React Hook Form + Zod | RHF 7.x, Zod 4.x |
| データベース | Dexie.js (IndexedDB) | 4.x |
| ルーティング | React Router DOM | 7.x |
| チャート | Recharts | 3.x |
| 日付 | date-fns | 4.x |
| テスト | Vitest + React Testing Library | — |
| PWA | vite-plugin-pwa | 1.x |

---

## 2. レイヤードアーキテクチャ

```
┌─────────────────────────────────────────┐
│              Pages (ルート)              │  ← React Router によるページ単位
│  TopPage, HandRecordingPage, etc.      │
├─────────────────────────────────────────┤
│           Components (UI)               │  ← 表示・入力ロジック
│  recording/, tournament/, common/       │
├─────────────────────────────────────────┤
│         Services (ビジネスロジック)        │  ← データ変換・ビジネスルール
│  DataManagementService                  │
├─────────────────────────────────────────┤
│          Utils (ヘルパー関数)             │  ← 純粋関数群
│  pokerLogic, tagUtils, blindStructure   │
├─────────────────────────────────────────┤
│        Repository (データアクセス)        │  ← CRUD操作の抽象化
│  HandRepository, TournamentRepository   │
├─────────────────────────────────────────┤
│           Dexie.js (IndexedDB)          │  ← ブラウザ永続化
└─────────────────────────────────────────┘
```

### 2.1 各レイヤーの責務

| レイヤー | 責務 | やるべきこと | やってはいけないこと |
|---|---|---|---|
| **Pages** | ページ構成、コンポーネントの組み合わせ | Repository/Serviceの呼び出し、状態管理 | 複雑なビジネスロジック |
| **Components** | UI表示、ユーザー入力処理 | Propsベースの表示、イベントハンドリング | 直接のDB操作 |
| **Services** | ビジネスロジック、データ変換 | 複雑な処理の集約 | UI関連の処理 |
| **Utils** | 汎用ロジック | 純粋関数の提供 | 副作用、状態保持 |
| **Repository** | データアクセス抽象化 | CRUD操作、クエリ | ビジネスロジック |
| **Dexie.js** | 永続化 | IndexedDBラッパー | — |

---

## 3. データフロー

### 3.1 ハンド記録フロー

```
ユーザー操作
    ↓
HandRecordingPage (ページ)
    ↓ state管理
HandWizard (ウィザードコンポーネント)
    ↓ ステップ制御
PositionSelector → CardSelector → ActionInput → ResultStep
    ↓ 完了時
tagUtils.analyzeGameTags(actions) → タグ自動生成
    ↓
HandRepository.add(handRecord) → Dexie.js → IndexedDB
```

### 3.2 トーナメント管理フロー

```
TournamentListPage
    ↓ 一覧表示
TournamentRepository.getAll()
    ↓ 新規作成
TournamentCreatePage → TournamentForm
    ↓ 保存
TournamentRepository.add(tournament)
    ↓ 詳細表示
TournamentDetailPage
    ├── StructureEditor (ストラクチャー編集)
    ├── ChipRecordForm (チップ記録)
    ├── ChipHistoryList (履歴表示)
    └── TournamentChart (チャート表示)
```

---

## 4. 状態管理パターン

### サーバー通信なし（オフラインファースト）

- **グローバル状態管理ライブラリは未使用** (Redux, Zustand等なし)
- **ページレベルの状態**: `useState` + `useEffect` で Dexie.js からデータ取得
- **コンポーネント間通信**: Props のバケツリレー + コールバック関数
- **永続化**: すべて Dexie.js (IndexedDB) に保存

### 状態の流れ

```
Dexie.js (IndexedDB)
    ↑↓ Repository層
Page Component (useState)
    ↓ Props
Child Components
    ↑ Callback Props
Page Component → Repository.update() → Dexie.js
```

---

## 5. フォームパターン

- **React Hook Form** でフォーム状態管理
- **Zod** でバリデーションスキーマ定義 → `@hookform/resolvers/zod` で連携
- 型は Zod スキーマから `z.infer<typeof Schema>` で推論

```typescript
// パターン例
const schema = z.object({ name: z.string().min(1) });
type FormData = z.infer<typeof schema>;
const { register, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema)
});
```

---

## 6. テストパターン

- **テストランナー**: Vitest (`npm test`)
- **DOMテスト**: React Testing Library
- **IndexedDBモック**: `fake-indexeddb` パッケージ
- **テストファイル命名**: `対象ファイル名.test.ts(x)`
- **テスト配置**: 対象ファイルと同じディレクトリ（コロケーション）

---

## 7. パスエイリアス

```typescript
// vite.config.ts で定義
"@" → "./src"

// 使用例
import { db } from '@/data/db';
import { HandRecord } from '@/types/hand';
```

---

## 8. PWA設定

- `vite-plugin-pwa` で Service Worker 自動生成
- `registerType: 'autoUpdate'` — 自動更新
- マニフェスト: `name: 'Poker Note'`, `short_name: 'PokerNote'`
- アイコン: `pwa-192x192.png`, `pwa-512x512.png`

---

## 9. デプロイ

- **プラットフォーム**: Vercel
- **設定**: `vercel.json` でSPAリダイレクト（全パス → `index.html`）
- **ビルドコマンド**: `npm run build` (`tsc -b && vite build`)
