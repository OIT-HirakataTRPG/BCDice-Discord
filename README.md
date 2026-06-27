# BCDice-Discord

BCDiceを利用した、Discord用の多機能TRPGダイスボットです。  
ユーザーごとに使用するTRPGシステムを設定し、テキストメッセージまたはスラッシュコマンドから簡単にダイスロールを行うことができます。

---

## 🚀 主な機能 (Features)

1. **自動メッセージダイスロール**
   - チャンネル内でダイスコマンド（例：`2d6+3`, `CC<=80` など）を入力すると、Botが自動的に判定して結果を返します。
2. **ユーザーごとのシステム切り替え**
   - ユーザーごとに好みのTRPGシステムを記憶します。データベース（SQLite）を使用しているため、Botが再起動しても設定は維持されます。
3. **スラッシュコマンド完全対応**
   - `/dice` や、短縮版の `/d` コマンドでスマートにダイスを振ることができます。
4. **ヘルプ機能**
   - `/info` コマンドで、現在設定しているTRPGシステム特有のダイスコマンドヘルプをその場で確認できます。

---

## 🛠️ 技術スタック (Tech Stack)

- **Runtime**: Node.js
- **Library**: [discord.js v14](https://discord.js.org/)
- **Dice Engine**: [bcdice](https://github.com/bcdice/BCDice) (JavaScript版)
- **Database**: [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (軽量・高速なSQLite3ラッパー)
- **Configuration**: dotenv

---

## ⚙️ セットアップ手順 (Setup Guide)

### 1. 前提条件
- **Node.js** (v16.9.0 以上推奨)
- **Discord Bot アカウント**
  - [Discord Developer Portal](https://discord.com/developers/applications) でアプリケーションを作成し、ボットアカウントを作成してください。
  - **重要**: ボット設定画面（Botタブ）にて、以下の **Privileged Gateway Intents** を有効にしてください。
    - `MESSAGE CONTENT INTENT` (**必須**: メッセージからのダイスロール検出に必要です)

### 2. インストール
リポジトリをクローン、またはダウンロードしてプロジェクトディレクトリに移動し、依存関係をインストールします。

```bash
npm install
```

### 3. 環境変数の設定
プロジェクトのルートディレクトリに `.env` ファイルを作成し、Discord Developer Portal から取得したトークンとアプリケーションIDを設定します。

```env
TOKEN=あなたのDiscordボットのトークン
APPID=あなたのDiscordアプリケーションID
ADMINGUILDID=管理者権限コマンドを実行できる鯖のID
DOCURL=Botの停止手順が書かれたドキュメントのURL
```

> [!TIP]
> ルートにある `.env.example` をコピーして `.env` にリネームして使うと便利です。

### 4. アプリケーション（スラッシュ）コマンドの登録
以下のコマンドを実行して、Discordにスラッシュコマンド（`/dice`, `/setdice`, `/info`, `/help` など）を登録します。

```bash
node deploy-commands.js
```

### 5. 起動
ボットを起動します。

```bash
node index.js
```

ターミナルに `Ready! Logged in as <Botの名前>` と表示されれば起動完了です。

---

## 🐳 Dev Containers (VSCode) を使用した開発

VSCodeの **Dev Containers** 拡張機能を利用すると、ローカル環境を汚さずにDockerコンテナ内で簡単に開発を始めることができます。

### 1. 前提条件
- **Docker** がインストールされ、起動していること。
- VSCodeに [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 拡張機能がインストールされていること。

### 2. セットアップ手順
1. 本プロジェクトをVSCodeで開きます。
2. 画面右下に表示される「Reopen in Container (コンテナで再度開く)」のポップアップをクリックするか、コマンドパレット（`Ctrl+Shift+P` / `Cmd+Shift+P`）から **「Dev Containers: Reopen in Container」** を選択します。
3. 自動的に開発コンテナイメージ（`node:24-bookworm`ベース）のビルドと起動が行われます。
   - コンテナ起動時に、`.env` ファイルの雛形作成（`.env.example` の自動コピー）および `npm install` が自動的に実行されます。
4. 起動後、プロジェクトルートに生成された `.env` ファイルに、ご自身の `TOKEN`,  `APPID`, `ADMINGUILDID`, `DOCURL` を記述します。
5. VSCode内のターミナルを開き、コマンド登録とボットの起動を実行します。
   ```bash
   node deploy-commands.js
   node index.js
   ```

---

## 🎲 使い方とコマンド (Usage & Commands)

### スラッシュコマンド

| コマンド | 説明 | 引数 |
| :--- | :--- | :--- |
| `/dice` | ダイスを振ります。 | `roll`: ダイスの値（例: `2d6`）|
| `/d` | `/dice` の短縮コマンドです。 | `roll`: ダイスの値 |
| `/setdice` | 自分自身のデフォルトダイスシステムを変更します。 | `system`: 選択肢からシステムを選択 |
| `/info` | 現在自分が設定しているダイスシステムの詳細なコマンドヘルプを表示します。（自分にのみ表示されます） | なし |
| `/help` | ボットの簡単な説明と利用可能なコマンドの一覧を表示します。 | なし |
| `/clear` | ボットに格納されているDBを初期化します (管理者権限必須) | なし |
| `/stopbot` | ボットの停止方法の書かれたドキュメントに誘導します (管理者権限必須) | なし |

### 通常メッセージからのダイスロール
Botが参加しているチャンネルで、ダイスコマンド（例：`3d6`, `CC<=70` など）を入力すると、Botが自動的に反応して結果を返信します。

> [!WARNING]
> Discordの仕様上、シークレットロールは通常のメッセージからは使用できません。  
> シークレットロールを行いたい場合は、スラッシュコマンド（`/dice` または `/d`）を使用してください。

---

## 📚 サポートしているTRPGシステム (Example Systems)

`/setdice` コマンドで以下の主要なシステムへ切り替えが可能です。

- 通常ダイス（`DiceBot` / デフォルト）
- クトゥルフ神話TRPG（`Cthulhu`）
- 新クトゥルフ神話TRPG（`Cthulhu7th`）
- シノビガミ（`ShinobiGami`）
- ダブルクロス 3rd Edition（`DoubleCross`）
- エモクロアTRPG（`Emoklore`）
- 虚構侵蝕TRPG（`KyokoShinshoku`）
- ソード・ワールド2.5（`SwordWorld2.5`）
- nRR（`NRR`）

より詳しい共通ダイスコマンドについては、[BCDiceコマンドガイド](https://docs.bcdice.org/) を参照してください。

---

## 📁 ディレクトリ構成 (Directory Structure)

```text
BCDice-Discord/
├── commands/           # スラッシュコマンド定義
│   ├── helper/         # ダイス実行やシステム名変換の共通ロジック
│   └── utility/        # 各コマンドの個別実装（d, dice, help, info, setdice）
├── db/                 # データベース保存先（SQLite3）
│   └── setting.db      # ユーザーごとのシステム設定DB（自動生成）
├── .env                # 環境変数（Git管理対象外）
├── .env.example        # 環境変数のサンプル
├── index.js            # メインエントリーポイント（Bot起動・メッセージ監視）
├── deploy-commands.js  # スラッシュコマンドをDiscord APIにデプロイするスクリプト
└── package.json        # 依存関係定義
```