# TOP PRIME STONE 浏览器级检查

## 环境

- Dev server: `npm.cmd run dev -- --host 127.0.0.1`
- URL: `http://127.0.0.1:5173/`
- Browser method: Playwright Chromium fallback. 当前线程没有可调用的 Browser / IAB 工具，因此按前端技能规则使用本地 Playwright。
- Desktop viewport: `1440x900`
- Mobile viewport: `390x844`

## Automated checks

- `npm.cmd run test` → PASS，2 个测试文件，7 个测试通过。
- `npm.cmd run build` → PASS，Vite 生成 `dist/`。

## Desktop checks

- 首屏截图已保存到 `top-prime-final-above-fold.png`；品牌、导航、双 CTA、H1、矿山图和三项能力标签均可见。
- 逐段滚动触发页面图片加载后，15 张页面图片全部 `naturalWidth > 0`。
- 桌面页面 `document.documentElement.scrollWidth` 没有超过 viewport，无横向溢出。
- 点击 Cambodia Black 材料卡 → 灯箱显示；点击 Close → 灯箱关闭。
- 缺少姓名 / 邮箱时提交 → 没有出现成功状态；填写 Alex / alex@example.com 后提交 → `role="status"` 成功状态显示。
- 点击中文切换 → H1 变为 `柬埔寨石材，连接世界建筑。`，获取报价导航链接显示为中文。

## Mobile checks

- 菜单按钮点击后 `.site-nav--open` 出现；点击 Close 后菜单关闭。
- 移动端首屏 CTA 纵向排列，三项能力标签进入纵向结构，内容没有被裁切。
- 移动端 `document.documentElement.scrollWidth` 没有超过 viewport，无横向溢出。
- 移动端截图已保存到 `top-prime-final-mobile.png`。

## Intentional deviations / follow-up

- 未使用 `.MOV` 作为首屏依赖，优先保证图片加载稳定；后续可将视频转码为 WebM / MP4 后加入流程区。
- 电话、邮箱和 WhatsApp 未在当前源文件中提供，因此页面显示双语“待补充”提示；正式上线前需替换为已确认值并接入真实收件地址或 CRM。
- 概念稿与实现都保留了相同的信息架构和视觉节奏；实现用用户提供的真实素材替换了概念中的生成纹理 / 产品画面。
