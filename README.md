# Poker Note

**[English]** | [日本語](#poker-note-日本語)

**Poker Note** is a mobile-first, offline-ready Poker (Texas Hold'em) hand recording and analysis application (PWA).  
Built for efficiency, it allows players to quickly record hand histories, tag important spots, and review their play sessions without needing an internet connection.

## Key Features

### 🚀 Efficient Hand Recording
-   **Intuitive Wizard:** Step-by-step recording flow (Position -> Hole Cards -> Action -> Board -> Result).
-   **Smart Auto-Advance:** Automatically suggests the next actor and position based on poker rules (Preflop/Postflop logic).
-   **Smart Defaults:** Context-aware enabling/disabling of buttons (e.g., preventing invalid positions).
-   **Visual Input:** Grid-based card selector for quick input on mobile devices.
-   **Undo & Correction:** Easily undo the last action or go back to previous steps to correct mistakes.

### 📊 Analysis & Management
-   **Hand History List:** View all recorded hands with key details (Win/Loss, Position, Cards).
-   **Dynamic Filtering:** Filter hands by Date and Tags (e.g., "3-Bet Pot", "SRP").
-   **Automatic Tagging:** Hands are automatically tagged based on the action flow (e.g., C-Bet, Check-Raise).
-   **Detailed View:** Review every action, street by street.
-   **Data Management:** Full JSON Import/Export for backup and migration.
-   **Hand Deletion:** Remove unwanted or test records easily.

### 🏆 Tournament Management
-   **Session Tracking:** Create and manage multiple tournament sessions. Supports "Pending" status for pre-registration.
-   **Structure Management:** Flexible structure editor with SB/BB, Ante, and Duration. Supports **CSV import** and **"Ante = BB" auto-sync checkbox**.
-   **Finish & Ranking:** On tournament finish, enter your finishing rank (e.g. 3rd out of 50). Displayed as a 🏆 badge on the detail and list pages.
-   **Smart Chip Tracking:** Record stack sizes with auto-calculated current blind levels based on tournament timer.
-   **Visual Charts:** Monitor chip stack progression and "M-value" over time with interactive charts.
-   **Integrated Hand Recording:** Seamlessly switch between tournament tracking and hand recording, with auto-linked tournament context and tags.
-   **Mobile Optimized UI:** Responsive headers and tables with horizontal scroll for comfortable use on smartphones.

### 📱 PWA & Offline First
-   **Works Offline:** All data is stored locally using IndexedDB (Dexie.js).
-   **Installable:** Can be installed on home screens as a native-like app.
-   **Mobile Optimized:** Enhanced touch targets (48px buttons) and responsive design for easy usage on smartphones.
-   **Rich UI:** Utilizes modern components (Toast notifications, Dialogs) for a smooth user experience.

## Tech Stack

-   **Framework:** React (TypeScript) + Vite
-   **Styling:** Tailwind CSS + shadcn/ui (Radix UI) + Lucide React
-   **State/Database:** Dexie.js (IndexedDB wrapper)
-   **Forms:** React Hook Form + Zod
-   **Routing:** React Router DOM
-   **Testing:** Vitest + React Testing Library

## Project Structure

```text
src/
├── components/     # UI Components
│   ├── analysis/   # Hand Analysis Components
│   ├── common/     # Shared Components (ErrorBoundary, etc.)
│   ├── recording/  # Hand Recording Wizard
│   ├── tournament/ # Tournament specific components
│   └── ui/         # Shadcn UI primitives
├── data/           # Data Layer (Dexie.js, Repositories)
├── lib/            # Utilities (cn, etc.)
├── pages/          # Application Pages
├── services/       # Business Logic Services
├── types/          # TypeScript Definitions
└── utils/          # Helper Functions (Poker logic, Tagging)
```

## Setup & Usage

### Prerequisites
-   Node.js (v18+)
-   npm

### Installation

```bash
git clone <repository-url>
cd porker_memo
npm install
```

### Development

```bash
npm run dev
```
Runs the app in development mode at `http://localhost:5173`.

### Testing

```bash
npm test
```
Runs unit and component tests using Vitest.

### Build

```bash
npm run build
```
Builds the app for production to the `dist` folder.

## License

MIT License

---

# Poker Note (日本語)

**Poker Note** は、モバイルファーストでオフライン動作に対応した、ポーカー（テキサスホールデム）のハンド記録・分析アプリケーション (PWA) です。
効率性を重視して設計されており、プレイヤーはインターネット接続なしでプレイ履歴を素早く記録し、重要な場面にタグを付け、プレイセッションを見直すことができます。

## 主な機能

### 🚀 効率的なハンド記録
-   **直感的なウィザード:** Step-by-step の記録フロー (ポジション -> ホールカード -> アクション -> ボード -> 結果)。
-   **スマート自動進行:** ポーカーのルールに基づき、次のアクション順のプレイヤーやポジションを自動で提案します (プリフロップ/ポストフロップ対応)。
-   **スマートな入力補助:** 状況に応じて無効なポジションボタンを自動で制御するなど、誤入力を防ぎます。
-   **ビジュアル入力:** モバイル端末でも素早く操作できるグリッド形式のカード選択UI。
-   **Undo & 修正:** 間違えた場合も、最後のアクションを取り消したり、前のステップに戻って修正したりできます。

### 📊 分析と管理
-   **ハンド履歴一覧:** 記録したすべてのハンドを、勝敗、ポジション、カードなどの重要情報とともに一覧表示します。
-   **動的なフィルタリング:** 日付やタグ（例: "3-Bet Pot", "SRP"）でハンドを絞り込むことができます。
-   **自動タグ付け:** アクションの流れに基づいて、一般的なタグ（例: C-Bet, Check-Raise）を自動で付与します。
-   **詳細ビュー:** すべてのアクションをストリートごとに詳細に確認できます。
-   **データ管理:** JSON形式での完全なインポート/エクスポートに対応しており、バックアップやデータ移行が可能です。
-   **ハンド削除:** 不要な記録やテストデータを簡単に削除できます。

### 🏆 トーナメント管理
-   **セッション追跡:** 複数のトーナメントセッションを作成・管理できます。「開始待ち(Pending)」ステータスにも対応。
-   **ストラクチャー管理:** SB/BB、Ante、ラウンド時間を設定可能な柔軟なストラクチャーエディタ。**CSVインポート**と**「Ante=BB」自動同期チェックボックス**に対応。
-   **終了時の順位記録:** トーナメント終了時に参加人数と順位を入力可能（例: 50人中3位）。詳細・一覧画面に 🏆 バッジとして表示されます。
-   **スマートなチップ記録:** トーナメントタイマーに基づき、現在のブラインドレベルを自動計算・補完してチップ量を記録できます。
-   **視覚的チャート:** チップ量の推移や「M値」の変化をインタラクティブなチャートで確認できます。
-   **ハンド記録との統合:** トーナメント管理とハンド記録をシームレスに行き来でき、トーナメント情報やタグが自動的に紐付けられます。
-   **スマホ最適化UI:** ヘッダーやテーブルがモバイル幅でも崩れないレスポンシブ対応、テーブルは横スクロール可能。

### 📱 PWA & オフラインファースト
-   **オフライン動作:** すべてのデータは IndexedDB (Dexie.js) を使用してローカルに保存されます。
-   **インストール可能:** PWAとしてホーム画面に追加し、ネイティブアプリのように使用できます。
-   **モバイル最適化:** スマートフォンでの操作性を考慮し、ボタンサイズ(48px)やタップ領域を拡大しました。
-   **リッチなUI:** Toast通知やダイアログなどのモダンなコンポーネントを採用し、スムーズなユーザー体験を提供します。

## 技術スタック

-   **フレームワーク:** React (TypeScript) + Vite
-   **スタイリング:** Tailwind CSS + shadcn/ui (Radix UI) + Lucide React
-   **状態管理/データベース:** Dexie.js (IndexedDB wrapper)
-   **フォーム:** React Hook Form + Zod
-   **ルーティング:** React Router DOM
-   **テスト:** Vitest + React Testing Library

## プロジェクト構造

```text
src/
├── components/     # UIコンポーネント
│   ├── analysis/   # ハンド分析コンポーネント
│   ├── common/     # 共通コンポーネント (ErrorBoundaryなど)
│   ├── recording/  # ハンド記録ウィザード
│   ├── tournament/ # トーナメント関連コンポーネント
│   └── ui/         # Shadcn UI プリミティブ
├── data/           # データ層 (Dexie.js, Repositories)
├── lib/            # ユーティリティ (cnなど)
├── pages/          # アプリケーションページ
├── services/       # ビジネスロジックサービス
├── types/          # TypeScript型定義
└── utils/          # ヘルパー関数 (ポーカーロジック, タグ付け)
```

## セットアップと使用方法

### 前提条件
-   Node.js (v18以降)
-   npm

### インストール

```bash
git clone <repository-url>
cd porker_memo
npm install
```

### 開発モード (Development)

```bash
npm run dev
```
開発サーバーを起動し、ブラウザで `http://localhost:5173` にアクセスします。

### テスト (Testing)

```bash
npm test
```
Vitest を使用してユニットテストとコンポーネントテストを実行します。

### ビルド (Build)

```bash
npm run build
```
プロダクション用にアプリケーションをビルドし、`dist` フォルダに出力します。

## ライセンス

MIT License
