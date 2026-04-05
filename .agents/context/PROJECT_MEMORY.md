# プロジェクトメモリ (PROJECT_MEMORY)

> **AIエージェントへの指示**:
> 新しいセッション・プロンプトを開始した際は、このファイルを必ず読み、プロジェクトの現状、引き継ぎ事項、およびユーザーの好みを把握すること。
> `/update-memory` または `/git-push` コマンド実行時に必ず最新状態に自動更新すること。
>
> **Last Active**: 2026-04-05

---

## 1. Current Context / WIP (現在の作業・進行中のタスク)
- テストコードの拡充（pokerLogic, PositionSelector等の新規テスト追加、回帰バグ修正）を完了した。
- アプリケーション全体のVitestカバレッジが向上し、エラーなしのクリーンな状態となった。
- 次のバグ修正や機能追加の指示待ち状態。

## 2. Recent Accomplishments (直近の完了事項)
- コアロジック (`pokerLogic.ts`) のユニットテストを作成し、カバレッジ100%を達成。
- `TournamentDetailPage.test.tsx` や `HandWizard.test.tsx` のスキップされていたテストを有効化し、すべてPassさせた。
- `CODEBASE_MAP.md` のテスト状況を最新に更新。
- `PROJECT_CONSTITUTION.md` を軸とした TDD と品質チェックフローの確立。
- `CODEBASE_MAP.md`, `ARCHITECTURE.md`, `POKER_RULES.md` によるドメイン知識の共有。
- Claude / Gemini 両方で実行可能な定型ワークフロー（`/fix-bug`, `/add-feature` など）の構築。
- プロジェクト独自の永続メモリ（このファイル）の仕組みを導入。

## 3. Next Steps / Pending (次回やるべきこと・ペンディング事項)
- なし（ユーザーからの次の指示待ち）

## 4. User Preferences & Rules (ユーザーの好み・特別なルール)
- **AIモデルの使い分け**: `MODEL_GUIDE.md` を参照。Gemini 3.1 Pro (Low) が基本、ドキュメント更新は Flash、複雑な要件定義は Claude Sonnet を使用する。
- **要件定義**: Geminiでも `/make-requirements` で要件定義が可能。
- **言語**: 日本語で応答し、ドキュメント言語も日本語で統一。
