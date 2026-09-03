# 后台管理页面 · 部署指南

本仓库新增了一个日常可用的后台管理页面（`/#/admin`），用于在线更新图片和编辑文字，改动保存后会自动重新部署网站。

## 1. 功能概览

- 访问 `/admin`（完整地址 `https://你的域名/#/admin`）。
- 简单密码登录（默认密码 `topprime2026`，建议在 Cloudflare 里覆盖）。
- 编辑中英文文案（Hero、About、Contact 等）。
- 石材 / 产品 / 流程列表的增删改和排序。
- 图片上传（自动放到 `public/assets/uploads/`）与图片路径替换。
- 「保存到云端」→ 提交到 GitHub → Cloudflare Pages 自动重新构建部署。
- 不部署云端时也可「本机预览保存」（存到浏览器 localStorage，仅本机看）。

## 2. 前置准备

1. 一个 **GitHub 仓库**，存放本项目代码（`top-prime-cambodia-stone`）。
2. 一个 **Cloudflare 账号**，已经用「Pages → Connect to Git」把这个仓库接进来。
3. 本机 Node 版本 **≥ 20.12**（当前仓库用的 Vite 8 要求），否则 `npm run build` 会报错。

## 3. 创建 GitHub Token

1. 打开 GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token。
2. Repository access：只选这个仓库。
3. Permissions → Contents：**Read and write**。
4. 生成后保存 token（只显示一次）。

## 4. 在 Cloudflare Pages 配置

1. 进入 Pages 项目 → Settings → Environment variables。
2. 添加以下变量（Production 和 Preview 都加）：

| 变量名 | 值 |
| --- | --- |
| `ADMIN_PASSWORD` | 你想用的后台密码（例如换一个强密码） |
| `VITE_ADMIN_PASSWORD` | 和上面同一个密码（前端登录用） |
| `GITHUB_TOKEN` | 第 3 步生成的 token（设为 Secret） |
| `GITHUB_OWNER` | GitHub 用户名或组织名 |
| `GITHUB_REPO` | 仓库名，如 `top-prime-cambodia-stone` |
| `GITHUB_BRANCH` | `main`（如果不是 main 就填实际分支） |

3. Build command 保持 `npm run build`，Output directory 保持 `dist`。

> 说明：`VITE_ADMIN_PASSWORD` 是构建时暴露给前端的（登录核对用），`ADMIN_PASSWORD` 是 Pages Function 服务端核对的。两者必须一致。更安全做法可把登录核对完全放到服务端；当前方案「简单密码」权衡了简单性。

## 5. 使用后台

1. 打开 `https://你的域名/#/admin`。
2. 输入密码登录。
3. 切换「文字 / 列表 / 图片」标签，选择 English / 中文 编辑。
4. 点「保存到云端」：提交到 GitHub，Cloudflare 约 1–2 分钟自动重新部署。
5. 点「本机预览保存」：改动只存在本机浏览器，刷新本机页面即可预览（适合未部署云端时测试）。

## 6. 图片管理

- 云端上传：后台「图片」标签 → 选择本地图片 → 上传到 `public/assets/uploads/` → 得到 `/assets/uploads/xxx.jpg` 路径 → 在「文字/列表」里把对应字段改成该路径。
- 也可以直接把图片放进 `public/assets/` 并 push 到 GitHub，然后在后台填 `/assets/文件名.jpg`。

## 7. 常用命令

```bash
npm install     # 首次
npm run dev     # 本地开发（Node ≥ 20.12）
npm run build   # 构建（Cloudflare 自动执行）
npm test        # 测试
```

## 8. 注意事项

- 后台保存会直接提交到 `main` 分支并触发上线；多人编辑时注意不要同时改。
- `public/content.json` 是网站实际读取的可编辑内容文件，`src/data/siteContent.js` 是兜底默认值（本地开发/无文件时使用）。
- 如忘记密码：改 Cloudflare 里的 `ADMIN_PASSWORD` 和 `VITE_ADMIN_PASSWORD` 后重新部署。
