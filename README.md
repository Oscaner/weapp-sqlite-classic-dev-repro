# weapp-sqlite classic dev repro

`weapp-vite@7.8.0` + `@weapp-sqlite/weapp-vite@0.3.1` 在微信目标下 `wv dev` 启动即崩溃：

```
ERROR  Existing SQLite WASM subpackages require the weapp-vite compiler context.
    at validateExistingWasmSubpackage (@weapp-sqlite/weapp-vite/dist/plugin.mjs:634:23)
    at BasicMinimalPluginContext.configResolved (@weapp-sqlite/weapp-vite/dist/plugin.mjs:803:12)
    at async _createServer (vite)
    at async createDevModuleGraphProvider (weapp-vite/dist/devProvider-*.mjs:5100)
```

`wv build` 正常（主包 378 B / 分包 shared 534 KB）。

## 复现

```bash
pnpm install
pnpm run dev    # 崩溃
pnpm run build  # 正常
```

## 关键点

- 触发条件只看 `weappSqlite` 的 `wasm.weappPackage.mode`：`existing-subpackage` 与 `generated-subpackage` 都会命中，
  只有默认的 `main` 不受影响（该分支不校验编译上下文）。
- 与 Vue / wevu / tailwind 无关：本仓库只有原生 `.ts` 页面。
- 与 HMR 的 stateful→classic 降级无关：这里 `weapp.hmr.runtime` 默认值直接判定为 classic（`auto-classic`）。
- 只发生在 `wv dev`；`wv build` 的 config 解析里存在 `weapp-vite:context`，所以能通过校验。
