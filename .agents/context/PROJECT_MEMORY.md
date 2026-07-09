# プロジェクトメモリ (PROJECT_MEMORY)

> **AIエージェントへの指示**:
> 新しいセッションやプロンプトを開始したときは、このファイルを必ず読み、プロジェクトの現状、引き継ぎ事項、ユーザーの好みを把握すること。
> `/update-memory` または `/git-push` 実行時には、最新状態に更新すること。
>
> **Last Active**: 2026-07-09

---

## 1. Current Context / WIP (現在の作業・進行中のタスク)

- Codex でも本プロジェクトを運用できるように、既存の未コミット変更を stash に退避した。
- stash 名: `pre-codex-operation-setup`
- Codex 用の入口として `AGENTS.md` を追加し、既存の `.agents/workflows/*.md` を Codex の手順書として読み替える運用を定義した。
- AntiGravity 固有の `// turbo`, `SafeToAutoRun`, `view_file` は Codex のツール・権限ルールに読み替える。

## 2. Recent Accomplishments (直近の完了事項)

- コアロジック (`pokerLogic.ts`) のユニットテストを作成し、カバレッジ 100% を達成済み。
- `TournamentDetailPage.test.tsx` と `HandWizard.test.tsx` のスキップされていたテストを有効化し、すべて pass する状態にした。
- `CODEBASE_MAP.md`, `ARCHITECTURE.md`, `POKER_RULES.md` によるドメイン知識共有の仕組みを導入済み。
- Claude / Gemini / AntiGravity 向けに構築していた定型ワークフローを、Codex でも参照できる形に整理中。

## 3. Next Steps / Pending (次回やるべきこと・ペンディング事項)

- 必要に応じて `.agents/workflows/*.md` 内の Gemini / Claude 推奨モデル表を Codex 向けの表現に整理する。
- stash した変更を戻す場合は、現在の Codex 運用変更を退避またはコミットした後に `git stash pop` する。
- 次の機能追加またはバグ修正では、`AGENTS.md` のスラッシュコマンド読み替えルールが十分に機能するか確認する。

## 4. User Preferences & Rules (ユーザーの好み・特別なルール)

- 応答とドキュメントは日本語で統一する。
- `PROJECT_CONSTITUTION.md` を最高規律として扱う。
- コード変更時は、対応する `.agents/context/` ドキュメントと `README.md` の更新要否を必ず確認する。
- ポーカーの基本ルールはユーザーに質問せず、`.agents/context/POKER_RULES.md` を参照して判断する。
