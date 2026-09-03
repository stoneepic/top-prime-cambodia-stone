# TOP PRIME STONE 视觉保真记录

概念基准：[top-prime-stone-homepage.png](../concepts/top-prime-stone-homepage.png)

实现截图：`C:\Users\rivermetstar\.codex\visualizations\2026\08\26\01a03d8e-f3db-79d3-bc07-d9f386211ff2\top-prime-above-fold-v2.png`、`top-prime-desktop-loaded-v2.png`、`top-prime-mobile-v2.png`

| 对照点 | 概念证据 | 实现证据 | 结果 / 修复 |
| --- | --- | --- | --- |
| 首屏层级与文案 | 概念以矿山全景、左侧大衬线标题、双 CTA 和底部三项能力标签构成首屏。 | 桌面首屏截图保持相同顺序；H1 使用 `Stone from Cambodia. Made for the world.`，无额外 hero eyebrow。 | 匹配；首屏文案锁定在批准内容内。 |
| 英雄图处理 | 概念保留矿山原色，左侧只做可读性暗部处理。 | `hero__image` 使用真实 `quarry-main.jpg`，`hero__shade` 仅为横向可读性渐变。 | 匹配；没有替换成 stock 建筑图或彩色滤镜。 |
| 材料区 | 概念是米白区、四列竖向石材纹理和细铜色标记。 | `materials-grid` 使用 4 张真实材料纹理图和一致的编号 / 应用行；四张图均已在滚动检查中加载。 | 匹配；实现使用用户素材替代概念生成纹理。 |
| 产品与流程节奏 | 概念用深色带承载产品画廊和四步 Quarry / Cutting / Finishing / Packing。 | 实现按相同顺序使用 5 张墓碑图和 4 张真实矿山 / 工厂 / 包装图。 | 匹配；区块密度和深色背景保留。 |
| 排版与控件 | 概念使用高对比衬线标题、窄无衬线 UI、小字号全大写导航和铜色 CTA。 | CSS token 使用 Cormorant Garamond / Manrope，按钮、导航、表单均显式设置字号、字重和字距。 | 匹配；没有依赖浏览器默认控件字体。 |
| 底部辅助控件 | 概念在首屏底部有滚动提示和页码，能力标签位于更低一层。 | 初版截图出现滚动提示与能力标签轻微重叠；调整 `.hero__footer` 到 `bottom: 104px` 后重新截图确认无重叠。 | 已修复。 |
| 关于与联系区 | 概念以浅色背景、关于文字与询盘表单形成结尾分区。 | 实现使用真实 `warehouse-full.jpg`、公司地址和本地成功状态表单；未编造电话 / 邮箱 / WhatsApp。 | 匹配；真实联系渠道保留为待补充。 |
| 移动端连续性 | 概念维持单列标题、堆叠 CTA 和纵向内容节奏。 | `390x844` 截图显示单列 hero、堆叠 CTA、移动菜单入口和可继续滚动的能力区；Playwright 检查无水平溢出。 | 匹配；流程带在 CSS 中改为纵向列表。 |

## Above-the-fold copy diff

通过 Playwright 对实现首屏检查：品牌、导航、`EN / 中文`、`Request a Quote`、H1、辅助文案、`Explore Materials`、`Quarry Source`、`Factory Processing`、`Custom Supply` 和 `Scroll to explore` 均来自批准设计与内容数据；没有新增 hero eyebrow、badge、数字指标或客户 logo。

## 有意差异

- 概念中的部分石材和产品画面是生成的视觉占位，实际页面全部替换成 `E:\TOP PRIME网站建设素材` 的真实图片。
- 概念展示的是视觉稿，实际表单增加了浏览器原生必填校验和本地成功状态，这是设计规格明确要求的功能交互。
- 概念没有固定真实电话、邮箱或 WhatsApp，因此实现显示双语“待补充”提示，等待用户提供最终联系渠道。
