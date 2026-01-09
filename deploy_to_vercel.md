# Vercel へのデプロイ方法

Porker Memo を Vercel にデプロイして公開する手順です。

## 1. 事前準備 (完了済み)
プロジェクトルートに `vercel.json` を作成・追加しました。これはアプリのページをリロードした際に 404 エラーになるのを防ぐための設定ファイルです。

**必要な操作:**
新しく作成された `vercel.json` を GitHub リポジトリに **コミットしてプッシュ** してください。

```bash
git add vercel.json
git commit -m "Add Vercel configuration"
git push
```

## 2. Vercel の設定

1.  **アカウント作成:** [vercel.com](https://vercel.com/signup) にアクセスし、**GitHub アカウント**を使ってサインアップ（ログイン）します。
2.  **プロジェクトのインポート:**
    -   ログイン後、ダッシュボードの **"Add New..."** ボタンを押し、**"Project"** を選択します。
    -   GitHub リポジトリの一覧が表示されるので、`porker_memo` を探して **"Import"** をクリックします。
3.  **プロジェクト設定:**
    -   **Framework Preset:** 自動的に **Vite** が選択されているはずです。もし違う場合はドロップダウンから選択してください。
    -   **Root Directory:** `./` (デフォルトのまま)。
    -   **Build Command:** `npm run build` (デフォルトのまま)。
    -   **Output Directory:** `dist` (デフォルトのまま)。
    -   **Environment Variables:** 現状は設定不要です。
4.  **デプロイ:**
    -   **"Deploy"** ボタンをクリックします。
    -   1〜2分ほど待ちます。完了すると花吹雪のアニメーションなどの完了画面が表示されます。

## 3. デプロイの確認
-   **"Continue to Dashboard"** をクリックします。
-   **"Visit"** ボタン（または `.vercel.app` で終わるURL）をクリックして、実際にアプリを開いてみます。
-   **動作確認:**
    -   スマートフォンでアクセスし、ホーム画面に追加できるか (PWA) 確認してみてください。
    -   Wi-Fiやモバイル通信を切って（機内モード）、オフラインでもリロードして動作するか確認してみてください。

以上です！ 今後は GitHub の `main` ブランチに変更をプッシュするたびに、Vercel が自動で最新版をデプロイしてくれます。
