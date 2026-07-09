# AGENTS.md — Poker Note Codex 運用ルール

> このファイルは Codex が新しい会話を開始するたびに読む、プロジェクトレベルの指示書である。
> 特に指示がない限り、すべての応答とドキュメント更新は日本語で行う。

---

## プロジェクト概要

**Poker Note** — テキサスホールデムのハンド記録・分析 PWA。
React + TypeScript + Vite で構築。モバイルファースト、オフラインファースト（Dexie.js / IndexedDB）。

---

## 最優先ルール

1. `PROJECT_CONSTITUTION.md` を最高規律として扱う。
2. セッション開始時は `.agents/context/PROJECT_MEMORY.md` を確認する。
3. ポーカー判断やポーカーロジックに触れる場合は `.agents/context/POKER_RULES.md` を確認する。
4. コードを変更した場合は、必要に応じて `.agents/context/` 配下と `README.md` を更新する。
5. `any` 型、Class Component、根拠のない大規模リファクタは禁止する。
6. 新規ロジックには原則としてテストを追加する。

---

## Codex での基本作業手順

1. 必要なコンテキストを読む。
   - 常に: `PROJECT_CONSTITUTION.md`, `.agents/context/PROJECT_MEMORY.md`
   - ファイル探索時: `.agents/context/CODEBASE_MAP.md`
   - 設計判断時: `.agents/context/ARCHITECTURE.md`
   - ポーカー関連: `.agents/context/POKER_RULES.md`
   - 変更完了時: `.agents/quality/CHECKLIST.md`
2. 既存コードの構造を確認してから変更する。
3. 変更は小さく、既存パターンに合わせる。
4. 検証は変更内容に応じて `npm test`, `npm run build`, `npm run lint` を使い分ける。
5. 変更完了時は、実施内容・検証結果・未実施の検証を簡潔に報告する。

---

## スラッシュコマンドの扱い

Codex にはこのプロジェクト独自のスラッシュコマンド実行機構はない。
ユーザーが以下のコマンドを入力した場合、対応する `.agents/workflows/*.md` を通常の手順書として読み、その内容を Codex のツールと権限ルールに読み替えて実行する。

| コマンド | 参照する手順書 |
|---|---|
| `/fix-bug` | `.agents/workflows/fix-bug.md` |
| `/add-feature` | `.agents/workflows/add-feature.md` |
| `/make-requirements` | `.agents/workflows/make-requirements.md` |
| `/code-review` | `.agents/workflows/code-review.md` |
| `/refactor` | `.agents/workflows/refactor.md` |
| `/sync-docs` | `.agents/workflows/sync-docs.md` |
| `/git-push` | `.agents/workflows/git-push.md` |
| `/update-memory` | `.agents/workflows/update-memory.md` |
| `/extract-knowledge` | `.agents/workflows/extract-knowledge.md` |
| `/evolve` | `.agents/workflows/evolve.md` |

### AntiGravity 記法の読み替え

- `// turbo` は「自律的に実行してよい定型ステップ」という意味として扱う。
- `SafeToAutoRun` は Codex の権限ルールに置き換える。必要ならユーザー承認を取る。
- `view_file` は `rg`, `Get-Content`, その他の利用可能な読み取り手段に置き換える。
- `.agents/context/MODEL_GUIDE.md` の Gemini / Claude 推奨は参考情報とし、Codex では現在のモデルで作業を継続する。

---

## ドキュメント鮮度維持

コードを変更した場合、以下に該当するドキュメントを必ず更新する。

| 変更種別 | 更新対象 |
|---|---|
| ファイル追加・削除・リネーム | `.agents/context/CODEBASE_MAP.md` |
| 新しいルート、コンポーネント構成変更 | `.agents/context/ARCHITECTURE.md` |
| `src/types/` の型定義変更 | `.agents/context/CODEBASE_MAP.md`, `.agents/context/ARCHITECTURE.md` |
| ポーカーロジック変更 | `.agents/context/POKER_RULES.md` |
| DB スキーマ変更 | `.agents/context/ARCHITECTURE.md`, `.agents/context/CODEBASE_MAP.md` |
| 依存パッケージ追加・削除 | `.agents/context/ARCHITECTURE.md` |
| ユーザー向け機能追加・変更 | `README.md` |

---

## 技術スタック

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui + Radix UI + Lucide React
- React Hook Form + Zod
- Dexie.js / IndexedDB
- React Router DOM
- Vitest + React Testing Library
- パスエイリアス: `@/` → `./src/`

---

## よく使うコマンド

```powershell
npm run dev
npm test
npm run build
npm run lint
npm run coverage
```
