# g1-acq

Google One 订阅页 SKU 采集与三档改写。发布脚本同时给 Shadowrocket、Quantumult X、Loon 使用。

## 命令

- 生成发布脚本：`node scripts/build.cjs`
- 检查发布脚本与 `src/` 一致：`node scripts/build.cjs --check`
- 测试：`node --test tests/sku-tools.test.cjs`（Node.js 18+）

## 目录

- `src/host.js`：三个客户端的存储与 `$done` 适配。改宿主行为只改这里。
- `src/g1-acq.js`、`src/g1-sku-report.js`：业务脚本，通过 `G1Host` 访问宿主。
- 根目录 `g1-acq.js`、`g1-sku-report.js`：发布文件，由 build 生成。不要手改。
- `g1-acq-v7.sgmodule`：Shadowrocket。`g1-acq-v7.snippet`：Quantumult X 重写。`g1-acq-v7.plugin`：Loon 插件。
- `g1-sku-scan.js`、`g1-pro-annual-test.js` 与对应 `.sgmodule`：历史兼容入口，仍只面向 Shadowrocket。

## 约束

- 发布仓库是 `fansys/g1-acq`。安装 URL 固定 `https://cdn.jsdelivr.net/gh/fansys/g1-acq@v7.6.0/`。发版前打同名 tag，否则 jsDelivr 地址没有这些文件。
- 本地键保持 `g1.sku.scan.v1`、`g1.pro.annual.test.v1`，`schemaVersion` 保持 `1`。不要把 Quantumult X 的 `$prefs` 和另外两个客户端的 `$persistentStore` 当成同一份数据。
- Quantumult X 重写里，本机报告的 `script-echo-response` 必须排在通配 `script-response-body` 之前。
- 不要给脚本加网络上报。响应里只改商品 ID 字符串。
- 映射、回退和报告字段的行为变化要补 `tests/sku-tools.test.cjs`，并保留 v6 fixture 对照。
