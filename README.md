# colorguess-dsh-plugin

ColorGuess 的 DeepSeek Harness (DSH) 插件：在会话头部加一个 "ColorGuess" 按钮，点击打开**可拖动的悬浮窗**（默认右上角），以 iframe 内嵌游戏。游戏本体托管在 GitHub Pages（本插件不含游戏代码，只负责嵌入与主题同步）。

A DeepSeek Harness (DSH) plugin for ColorGuess: a session-header "ColorGuess" button that opens the game in a **draggable floating window** (default top-right) via iframe. The game itself is hosted on GitHub Pages — this plugin only embeds it and forwards the host theme.

## 安装 / Install

通过 git 仓库安装（本仓库为 public）：

```bash
dsh plugin --profile web add github:HDNRAY/dsh-plugin-colorguess
# 然后重启 dsh web
```

重启后，在会话头部（聊天页右上角操作区）会出现 **ColorGuess** 按钮，点击打开悬浮窗内嵌游戏。

更新插件（代码或 `lib/` 有新版后）：

```bash
dsh plugin --profile web update colorguess-dsh-plugin
# 然后重启 dsh web
```

## 功能 / Features

- 可拖动的悬浮窗（拖动标题栏移动，✕ / Esc 关闭），默认右上角
- 主题同步：游戏跟随 DSH 的亮/暗主题（postMessage 协议 `{ source: 'colorguess-dsh', theme }`）

## 开发 / Development

```bash
npm install          # 仅安装 esbuild（构建用）
npm run build        # 重新构建 lib/index.js + lib/client.js
```

`lib/` 已提交，直接 git 安装即可用；修改 `src/` 后重新构建并提交 `lib/`。**main 分支受保护（PR 审核）**：改动请走 PR。仓库的 sync-lib workflow 会在 main 更新后自动重建 `lib/` 并开一个 "chore: rebuild lib" 的 PR，合并后安装者即可拿到新构建。

## 贡献 / Contributing

- main 分支禁直推：所有改动通过 Pull Request，需 1 个 approve
- 改动 `src/` 后本地跑 `npm run build` 并提交 `lib/`，或交给 sync-lib workflow 自动重建

## 结构 / Structure

- `src/index.ts` — 宿主端（空 apply，让插件进入 Loader）
- `src/client/` — 浏览器端：头部按钮 + 悬浮窗 iframe + 主题转发
- `scripts/build.mjs` — 构建脚本（esbuild，产出 `__ModuleLoader__.load` 契约的 client bundle）
- `cordis.patch.yml` — 插件行配置

## 许可 / License

[MIT](LICENSE)
