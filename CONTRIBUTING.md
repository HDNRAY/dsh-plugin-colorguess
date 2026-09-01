# 贡献指南 / Contributing

感谢你愿意为这个插件做贡献！

## 工作流 / Workflow

`main` 分支受保护（需要 PR + 1 个 approve）。所有改动请按此流程：

1. 从 `main` 拉新分支：`git checkout -b your-change`
2. 修改代码/文档，本地验证：
   ```bash
   npm install
   npm run build     # 改过 src/ 后需要重建 lib/
   ```
3. 提交并推送分支：`git push -u origin your-change`
4. 打开 Pull Request 到 `main`，等待 review
5. 合并后，sync-lib workflow 会自动重建 `lib/` 并（如有变化）开 "chore: rebuild lib" 的 PR，合并即可

## 注意 / Notes

- 如果改了 `src/`，尽量把重建后的 `lib/` 一起提交（或让 sync-lib 自动重建）
- 主题同步协议：`postMessage({ source: 'colorguess-dsh', theme })`，改它要同步更新游戏侧
- 遵守 MIT 许可
