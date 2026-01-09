# Porker Memo

**[English]** | [日本語](#porker-memo-日本語)

**Porker Memo** is a mobile-first, offline-ready Poker (Texas Hold'em) hand recording and analysis application (PWA).  
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

### 📱 PWA & Offline First
-   **Works Offline:** All data is stored locally using IndexedDB (Dexie.js).
-   **Installable:** Can be installed on home screens as a native-like app.

## Tech Stack

-   **Framework:** React (TypeScript) + Vite
-   **Styling:** Tailwind CSS + shadcn/ui (Radix UI) + Lucide React
-   **State/Database:** Dexie.js (IndexedDB wrapper)
-   **Forms:** React Hook Form + Zod
-   **Routing:** React Router DOM
-   **Testing:** Vitest + React Testing Library

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

# Porker Memo (日本語)

**Porker Memo** は、モバイルファーストでオフライン動作に対応した、ポーカー（テキサスホールデム）のハンド記録・分析アプリケーション (PWA) です。  
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

### 📱 PWA & オフラインファースト
-   **オフライン動作:** すべてのデータは IndexedDB (Dexie.js) を使用してローカルに保存されます。
-   **インストール可能:** PWAとしてホーム画面に追加し、ネイティブアプリのように使用できます。

## 技術スタック

-   **フレームワーク:** React (TypeScript) + Vite
-   **スタイリング:** Tailwind CSS + shadcn/ui (Radix UI) + Lucide React
-   **状態管理/データベース:** Dexie.js (IndexedDB wrapper)
-   **フォーム:** React Hook Form + Zod
-   **ルーティング:** React Router DOM
-   **テスト:** Vitest + React Testing Library

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
