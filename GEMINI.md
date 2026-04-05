# GEMINI.md — Poker Note プロジェクトルール

> このファイルは Gemini / Antigravity が新しい会話を開始するたびに自動で読み込むプロジェクトレベルの指示書である。
> すべての応答はこのファイルのルールに従うこと。
> **注意**: ユーザーレベルの `.gemini/GEMINI.md` と併用される。このファイルはプロジェクト固有のルールを追加する。

---

## プロジェクト概要

**Poker Note** — テキサスホールデムのハンド記録・分析PWA。
React + TypeScript + Vite で構築。モバイルファースト、オフラインファースト（Dexie.js/IndexedDB）。

---

## 絶対ルール

### 1. 日本語で応答する
特に指示がない限り、すべての応答を日本語で行う。

### 2. 最高規律の参照
`PROJECT_CONSTITUTION.md` がプロジェクトの最高規律である。技術スタック、コーディング規約、TDDプロセスはすべてこの文書に従う。

### 3. ドキュメント鮮度維持（必須）
コードを変更した場合、以下の条件に該当するとき `.agents/context/` 配下のドキュメントを **必ず** 更新すること。
これはすべてのワークフローに優先する義務である。

| 変更種別 | 更新対象ドキュメント |
|---|---|
| ファイルの追加・削除・リネーム | `.agents/context/CODEBASE_MAP.md` |
| 新しいルート、コンポーネント構成変更 | `.agents/context/ARCHITECTURE.md` |
| 型定義 (`src/types/`) の変更 | `CODEBASE_MAP.md`, `ARCHITECTURE.md` |
| ポーカーロジック (`src/utils/pokerLogic.ts`等) の変更 | `.agents/context/POKER_RULES.md` |
| DB スキーマ (`src/data/db.ts`) の変更 | `ARCHITECTURE.md`, `CODEBASE_MAP.md` |
| 依存パッケージの追加・削除 | `ARCHITECTURE.md` |
| ユーザー向け機能の追加・変更 | `README.md` |

### 4. ポーカールールの参照
ポーカーに関する質問・判断が必要な場合は、`.agents/context/POKER_RULES.md` を参照すること。
ユーザーに基本ルールを質問してはならない。

---

## コンテキストドキュメント

作業を開始する前に、必要に応じて以下のドキュメントを参照すること:

| ドキュメント | 内容 | いつ参照するか |
|---|---|---|
| `PROJECT_CONSTITUTION.md` | プロジェクト憲法 | 常に |
| `.agents/context/PROJECT_MEMORY.md` | 作業の引き継ぎメモ・現在のタスク | 🚀 セッション開始時に必ず読む |
| `.agents/context/POKER_RULES.md` | ポーカールール・ドメイン知識 | ポーカーロジックに触れるとき |
| `.agents/context/CODEBASE_MAP.md` | ファイル一覧と役割 | ファイルを探すとき |
| `.agents/context/ARCHITECTURE.md` | アーキテクチャ詳細 | 設計判断するとき |
| `.agents/quality/CHECKLIST.md` | 品質チェックリスト | 変更完了時 |
| `.agents/context/MODEL_GUIDE.md` | AIモデル選択ガイド | ワークフロー開始時（モデル選択の判断） |

---

## 技術スタック要約

- **React 18** (TypeScript ~5.6) + **Vite 6**
- **Tailwind CSS 3** + **shadcn/ui** (Radix UI) + **Lucide React**
- **React Hook Form** + **Zod** (フォーム & バリデーション)
- **Dexie.js 4** (IndexedDB — オフラインデータ永続化)
- **React Router DOM 7** (ルーティング)
- **Vitest** + **React Testing Library** (テスト)
- パスエイリアス: `@/` → `./src/`

---

## コーディング規約サマリー

- `any` 型 → **禁止**
- Class Component → **禁止**
- 命名: コンポーネント=`PascalCase`, 関数・変数=`camelCase`, 定数=`UPPER_SNAKE_CASE`
- 副作用最小化、純粋関数推奨
- テスト: 新規ロジックには必ずユニットテストを追加

---

## ワークフロー

以下のスラッシュコマンドで定型ワークフローを起動できる:

| コマンド | 説明 | ワークフローファイル |
|---|---|---|
| `/fix-bug` | バグ修正 | `.agents/workflows/fix-bug.md` |
| `/add-feature` | 機能追加 | `.agents/workflows/add-feature.md` |
| `/make-requirements` | 要件定義書の作成 | `.agents/workflows/make-requirements.md` |
| `/code-review` | コードレビュー | `.agents/workflows/code-review.md` |
| `/refactor` | リファクタリング | `.agents/workflows/refactor.md` |
| `/sync-docs` | ドキュメント同期 | `.agents/workflows/sync-docs.md` |
| `/git-push` | Git Push | `.agents/workflows/git-push.md` |
| `/update-memory` | セッションの終わりに現状や引き継ぎ事項をプロジェクトメモリに記録するワークフロー。 | `.agents/workflows/update-memory.md` |
| `/extract-knowledge`| 問題解決の過程から再利用可能なルールやスキルを抽出するメタ認知ワークフロー。 | `.agents/workflows/extract-knowledge.md` |

### 要件定義モード（Claude代替機能）

`/make-requirements` ワークフローは、Claudeの要件定義能力をGeminiでも再現するために設計されている。
ポーカードメイン知識を `.agents/context/POKER_RULES.md` から自動注入し、以下のプロトコルに従う:
- **1問1答**: 質問は必ず一度に1つに絞る
- **ドメイン知識活用**: ポーカー用語や概念は `POKER_RULES.md` の定義に従い、ユーザーに再確認しない
- **構造的視点**: データ整合性、例外系、既存アーキテクチャとの整合性を深掘りする

---

## テンプレート

ユーザーがバグ報告や機能依頼を素早く行えるテンプレートが `.agents/templates/` にある:
- `bug-report.md` — バグ報告テンプレート
- `feature-request.md` — 機能追加依頼テンプレート
- `test-plan.md` — テスト計画テンプレート

---

## Antigravity 固有の注意事項

- コマンド実行は Windows (PowerShell) 環境
- ワークフロー内の `// turbo` 注釈付きステップは `SafeToAutoRun: true` で自動実行可
- `view_file` ツールで `.agents/context/` 配下のドキュメントを読み込むこと
