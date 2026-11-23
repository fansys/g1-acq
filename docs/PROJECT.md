# g1-acq

## 当前状态

`v7.6.0` / 响应脚本 `g1-acq-v7.6`。Shadowrocket、Quantumult X、Loon 共用 `src/` 里的采集与报告逻辑。安装入口分别是 `g1-acq-v7.sgmodule`、`g1-acq-v7.snippet`、`g1-acq-v7.plugin`。

## 技术决策日志

### DEC-001 三客户端共用脚本，安装入口分开

- 状态：`active`
- 背景：仓库原先只有 Shadowrocket `.sgmodule`。Quantumult X 用重写资源，Loon 用插件；存储和本机响应的 `$done` 形状不同。
- 决策：业务留在 `src/g1-acq.js` 与 `src/g1-sku-report.js`。`src/host.js` 适配 `$persistentStore` / `$prefs` 和响应返回格式。`node scripts/build.cjs` 拼成根目录发布脚本。
- 理由：三个客户端都只能按 URL 加载单个脚本，不能互相 import。
- 影响：Shadowrocket 继续可用。Quantumult X 记录在 `$prefs`，与另外两个客户端不互通。历史 `g1-sku-scan.js`、`g1-pro-annual-test.js` 仍只服务 Shadowrocket。
- 相关文件：`src/host.js`、`g1-acq-v7.snippet`、`g1-acq-v7.plugin`

## 当前工作

- 状态：`completed`
- 内容：抽出宿主适配，并加入 Quantumult X 重写与 Loon 插件。

## 已知问题与阻塞

- 安装地址仓库为 `fansys/g1-acq`。jsDelivr 要等该仓库打上 `v7.6.0` tag 才可下载。
- Quantumult X 重写不能携带 UDP 443 规则。HTTP/3 需用户在 `[general]` 设置 `udp_drop_list = QUIC`。
- Quantumult X 与 Loon 没有实机 HTTPS 解密验证，只跑了 Node 宿主模拟。

## 最新交接摘要

发布脚本不要手改。改 `src/` 后运行 `node scripts/build.cjs`，再运行 `node --test tests/sku-tools.test.cjs`。
