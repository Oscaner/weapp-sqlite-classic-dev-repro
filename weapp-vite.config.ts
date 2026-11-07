import { weappSqlite } from '@weapp-sqlite/weapp-vite';
import { defineConfig } from 'weapp-vite';

export default defineConfig({
  weapp: {
    srcRoot: 'src',
  },
  plugins: [
    weappSqlite({
      wasm: {
        variant: 'lite',
        // 触发/lib 都不需要，只要 wasm 走分包承载
        weappPackage: { mode: 'existing-subpackage', root: 'shared' },
      },
    }),
  ],
});
