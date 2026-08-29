# colorguess-dsh-plugin

ColorGuess 的 DeepSeek Harness (DSH) 插件：在会话头部加一个 "ColorGuess" 按钮，点击打开右侧抽屉，以 iframe 内嵌游戏。游戏本体托管在 GitHub Pages（本插件不含游戏代码，只负责嵌入与主题同步）。

A DeepSeek Harness (DSH) plugin for ColorGuess: a session-header "ColorGuess" button that opens the game in a right-side drawer iframe. The game itself is hosted on GitHub Pages — this plugin only embeds it and forwards the host theme.

## 安装 / Install

通过 git 仓库安装（需要本仓库为 public）：

```bash
dsh plugin --profile web add github:HDNRAY/dsh-plugin-colorguess
# 然后重启 dsh web
```

重启后，在会话头部（聊天页右上角操作区）会出现 **ColorGuess** 按钮，点击打开抽屉内嵌游戏。游戏默认加载 `https://hdnray.github.io/colorguess/`。

## 覆盖游戏地址 / Override game URL

默认指向 HDNRAY 部署在 GitHub Pages 的实例。要改成你自己的游戏地址，在 profile 的 `cordis.patch.yml` 里覆盖：

```yaml
- update:
    - id: colorguess
      config:
        gameUrl: 'https://your-game-url/'
```

## 功能 / Features

- 右侧抽屉内嵌，不覆盖整个界面（遮罩点击 / Close / Esc 关闭）
- 主题同步：游戏跟随 DSH 的亮/暗主题（postMessage 协议 `{ source: 'colorguess-dsh', theme }`）
- 游戏地址可配置（见上）

## 开发 / Development

```bash
npm install          # 仅安装 esbuild（构建用）
npm run build        # 重新构建 lib/index.js + lib/client.js
```

`lib/` 已提交，直接 git 安装即可用；修改 `src/` 后需重新构建并提交 `lib/`（仓库有自动同步 workflow，push 后会自动重建提交）。

## 结构 / Structure

- `src/index.ts` — 宿主端（空 apply，让插件进入 Loader）
- `src/client/` — 浏览器端：头部按钮 + 抽屉 iframe + 主题转发
- `scripts/build.mjs` — 构建脚本（esbuild，产出 `__ModuleLoader__.load` 契约的 client bundle）
- `cordis.patch.yml` — 插件行 + `gameUrl` 配置
