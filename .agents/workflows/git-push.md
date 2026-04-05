---
description: 変更内容をコミットしてリモートリポジトリにpushするワークフロー。
---

# Git Push ワークフロー

## 推奨モデル
| 常に | 推奨モデル |
|---|---|
| — | **Gemini 3 Flash**（Gitコマンドの実行とコミットメッセージ生成。高い推論力は不要） |

## 概要
現在の変更内容をステージングし、適切なコミットメッセージを作成して push する。
他のワークフロー（fix-bug, add-feature 等）の完了後や、手動での小規模な変更後に使用する。

## ワークフロー

### Step 1: ドキュメントの同期 (sync-docs)
更新漏れを完全に防ぐため、必ず最初に `/sync-docs` ワークフロー相当のチェックを実行し、コードと `CODEBASE_MAP.md` 等のドキュメントの整合性を取る。

### Step 2: 変更内容の確認
// turbo
現在の変更内容（差分）を確認する:
```powershell
git status
git diff --cached
git diff
```

### Step 3: プロジェクトメモリの更新
// turbo
`git` コマンドで確認した内容をもとに、`.agents/context/PROJECT_MEMORY.md` の `Recent Accomplishments` と `Next Steps` を更新する。これにより変更内容が長期的にも忘れられなくなる。

### Step 4: 適切なコミットメッセージの生成
変更内容に基づき、[Conventional Commits](https://www.conventionalcommits.org/) に従ったメッセージ案を AI が作成する。

**フォーマット案:**
`<type>: <description>`

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（ホワイトスペース、フォーマッティング等）
- `refactor`: バグ修正も新機能追加も行わないコード変更
- `test`: 不足しているテストの追加や既存のテストの修正
- `chore`: ビルドプロセスやドキュメント生成などの補助ツールやライブラリの変更

### Step 5: ステージングとコミット
// turbo
すべての変更をステージングし、コミットを実行する:
```powershell
git add .
git commit -m "[AIによって生成されたメッセージ]"
```

### Step 6: リモートへの Push
// turbo
現在のブランチをリモートに push する:
```powershell
git push origin (現在のブランチ名)
```

### Step 7: 完了報告
push が成功したことを報告する。
