# TOP PRIME STONE CAMBODIA 双语展示站设计规格

## 1. 目标与范围

为 TOP PRIME STONE CAMBODIA 建立一个可本地预览、后续可部署的英文 / 中文双语单页独立站。首版目标不是在线交易，而是让海外采购商、建筑项目方和石材经销商在一个页面内快速确认：公司位于柬埔寨、拥有矿山与工厂素材、可以提供多种柬埔寨石材，并能通过询盘进入下一步沟通。

首版包含：响应式首页、双语切换、材料展示、产品 / 应用展示、矿山与工厂流程、出口能力说明、联系信息、询盘表单、图片灯箱和移动端菜单。

首版不包含：后台 CMS、真实表单提交服务、在线支付、客户登录、产品库存系统、未经素材或用户确认的产能 / 认证 / 客户案例数字。

## 2. 参考与取舍

参考的柬埔寨石材站点普遍采用以下顺序：首屏价值主张 → 石材材料 → 公司 / 矿山与工厂能力 → 产品或应用 → 出口服务 → 联系与询盘。TOP PRIME 的首版沿用该信息路径，但用更清晰的单页叙事和更强的实景图片比例，避免做成只有文字的企业模板。

参考站点：

- YESTONE：材料、工厂、出口、询盘的完整链路。
- Cambodia Stone：柬埔寨原产地、矿山资源、加工和出口能力的说明方式。
- Rithy Granite：矿山 / 工厂、产品、图片画廊和联系入口的组织方式。

## 3. 页面与内容结构

### 3.1 顶部导航

- 品牌：TOP PRIME STONE / CAMBODIA
- 导航锚点：Materials、Products、Process、About、Contact
- 语言切换：EN / 中文
- 主 CTA：Request a Quote / 获取报价
- 移动端：折叠菜单，CTA 保持可见

### 3.2 首屏 Hero

- 使用 `矿山图片/QUARRY.jpg` 作为主视觉，保留天空、山体和采石台阶，强调真实来源。
- 英文标题：`Stone from Cambodia. Made for the world.`
- 中文标题：`柬埔寨石材，连接世界建筑。`
- 辅助文案围绕 quarry source、factory processing、custom supply，不加入未经确认的年份、面积、月产能或认证。
- CTA：`Explore Materials` / `查看石材` 与 `Request a Quote` / `获取报价`。
- 首屏底部显示轻量数据标签：`Quarry Source`、`Factory Processing`、`Custom Supply`，作为能力概览而非虚构数字。

### 3.3 材料 Materials

展示四款已有产品纹理图：

- Cambodia Black
- Cambodia Dark Grey
- Cambodia Grey
- Cambodia Luna Pearl

卡片支持 hover / focus 状态；点击打开灯箱并显示材料名、适用方向和询盘 CTA。材料描述只使用保守的外观和应用表述，不承诺物理指标。

### 3.4 产品与应用 Products

使用墓碑图片素材展示纪念碑 / 墓碑定制能力，同时用图文标签补充 slabs、cut-to-size、custom stonework 等应用方向。产品区以真实照片为主，不伪造标准目录编号或库存信息。

### 3.5 流程 Process

用四个步骤叙述素材可以证明的流程：

1. Quarry / 矿山：矿山开采和原石来源。
2. Cutting / 切割：桥切、钻石切割和块料处理。
3. Finishing / 加工：自动抛光、手工打磨和细节处理。
4. Packing / 包装：成品检查、木箱和装运准备。

每个步骤配对应工厂图；桌面端采用横向时间线，移动端变为纵向步骤列表。

### 3.6 关于与能力 About

使用 `工厂图片/warehouse full.jpg` 或同类全景图作背景 / 侧图，突出“矿山、工厂、加工、出口协同”的叙事。公司名和地址取自 `联系方式.docx`：TOP PRIME STONE CAMBODIA Co., Ltd.，Kampong Speu Province, Cambodia。地址的详细格式在实现中按文档原文呈现。

### 3.7 联系 Contact

- 展示公司名、网站 `topprimestone.com` 和地址。
- 预留电话、邮箱、WhatsApp 的独立字段；如果源文件未提供具体值，显示 `Contact details to be confirmed` 的双语占位提示，不编造联系方式。
- 询盘表单字段：姓名、公司、邮箱、电话 / WhatsApp、感兴趣的材料、需求描述。
- 首版表单为前端交互演示：提交后显示双语成功状态，并明确提示后续接入真实收件地址或 CRM。

## 4. 视觉系统

- 主色：炭黑 `#131414`、深石灰 `#282A29`、矿山灰绿 `#56645B`、砂岩米 `#D8D0C2`。
- 强调色：温暖的琥珀铜 `#B98956`，只用于 CTA、编号和小面积高亮。
- 排版：标题使用高对比衬线字体，正文使用清晰的人文无衬线字体；通过 `@import` 加载 Google Fonts 时保留系统字体回退，避免网络字体不可用导致布局崩坏。
- 质感：大留白、细边框、图片原色、极少渐变；不使用泛化的建筑 stock 图，不在矿山图上压过重色滤镜。
- 动效：入场淡入、材料卡轻微位移、灯箱打开 / 关闭和导航平滑滚动；尊重 `prefers-reduced-motion`。

## 5. 技术与数据结构

- 技术栈：Vite + React + CSS，保持依赖轻量。
- 页面数据集中在 `src/data/siteContent.js`，以 `en` / `zh` 双语对象保存导航、标题、材料、流程和表单文案。
- 图片统一放入 `public/assets/`，按 `quarry`、`materials`、`factory`、`products` 分类；文件名改为 URL 安全的英文 slug。
- `LanguageProvider` 或等价的顶层状态管理语言切换；切换不刷新页面，并保持当前滚动位置。
- 灯箱和表单成功状态仅在本地维护，后续可以替换为真实 API 而不改页面结构。

## 6. 验收标准

- 桌面端首屏明确展示品牌、柬埔寨矿山来源、双 CTA，且下一段材料区可感知。
- EN / 中文切换覆盖所有用户可见核心文案，不能只切换导航。
- 四款材料卡片均能加载真实素材；点击后能打开并关闭灯箱。
- 询盘表单有必填校验和成功状态，不发生整页刷新。
- 桌面端和移动端均无横向溢出，导航、卡片、表单和图片在窄屏下可用。
- 所有图片来源于 `E:\TOP PRIME网站建设素材` 的真实素材副本；不因找不到联系方式而编造电话或邮箱。
- 运行 `npm.cmd run build` 通过；本地开发服务器可打开并完成核心交互检查。

## 7. 有意保留的后续项

- 真实邮箱、电话、WhatsApp 链接需要补充后接入。
- `.MOV` 视频暂不作为首屏硬依赖；首版优先使用可稳定加载的图片，后续可转码后加入 Process 视频模块。
- SEO title、description、OG 图片和多语言 URL 路由在部署前补齐。
