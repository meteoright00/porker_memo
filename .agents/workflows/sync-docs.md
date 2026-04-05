---
description: コードベースのドキュメントをソースコードの実態に同期する。ドキュメントの陳腐化を防止する。
---

# ドキュメント同期ワークフロー

## 推奨モデル
| 常に | 推奨モデル |
|---|---|
| — | **Gemini 3 Flash**（定型的なスキャン・比較作業。高い推論力は不要） |

## 概要
コードベースの現状からドキュメントを検証・更新する。
大きな変更の後や、定期的なメンテナンスとして `/sync-docs` で実行する。

## ワークフロー

### Step 1: ファイルシステムのスキャン
// turbo
プロジェクトのファイル構造をスキャンする:
```powershell
Get-ChildItem -Path "src" -Recurse -File -Name | Where-Object { $_ -notmatch "node_modules|dist|coverage" }
```

### Step 2: CODEBASE_MAP.md の検証・更新
1. Step 1 の結果と `.agents/context/CODEBASE_MAP.md` の「ファイル一覧と役割」セクションを比較する
2. 以下の差分を検出する:
   - **追加されたファイル**: CODEBASE_MAP.md に存在しないが、ファイルシステムに存在するファイル
   - **削除されたファイル**: CODEBASE_MAP.md に存在するが、ファイルシステムに存在しないファイル
   - **リネームされたファイル**: 名前が変更されたファイル
3. 差分があれば `CODEBASE_MAP.md` を更新する
4. 「機能別ファイルグルーピング」セクションも整合性を確認する
5. 「ホットスポット」セクションを最近の変更履歴に基づいて更新する

### Step 3: ARCHITECTURE.md の検証・更新
1. `src/types/*.ts` を読み、型定義が `ARCHITECTURE.md` と一致するか確認する
2. `src/data/db.ts` を読み、DBスキーマが一致するか確認する
3. `src/App.tsx` を読み、ルーティング情報が一致するか確認する
4. `package.json` を読み、技術スタック（バージョン含む）が一致するか確認する
5. 差分があれば `ARCHITECTURE.md` を更新する

### Step 4: POKER_RULES.md の検証・更新
1. `src/utils/pokerLogic.ts` を読み、以下を確認:
   - ポジション定義（`POSITIONS_*MAX`）が POKER_RULES.md と一致するか
   - アクション順序ロジックが正しく記載されているか
   - ハンド終了条件が一致するか
2. `src/utils/tagUtils.ts` を読み、以下を確認:
   - 自動タグ付けルールが POKER_RULES.md と一致するか
   - 新しいタグが追加されていないか
3. `src/types/hand.ts` を読み、`HandRecord` と `Action` の型定義が一致するか確認
4. 差分があれば `POKER_RULES.md` を更新する

### Step 5: 最終更新日の更新
更新したすべてのドキュメントの「最終更新」日付を今日の日付に更新する。

### Step 6: 同期結果の報告
以下の形式で報告する:
```
## ドキュメント同期完了
- CODEBASE_MAP.md: ✅ 最新 / 🔄 N件更新
- ARCHITECTURE.md: ✅ 最新 / 🔄 N件更新
- POKER_RULES.md: ✅ 最新 / 🔄 N件更新
- 詳細:
  - (更新した具体的な内容を列挙)
```
