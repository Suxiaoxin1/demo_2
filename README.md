# 科秒外卖点餐小程序模板 - H5 演示

基于 **uni-app + Vue3** 的外卖点餐小程序模板的 H5 演示版本。

## 在线演示

🔗 **GitHub Pages**: https://Suxiaoxin1.github.io/demo_2/

## 技术栈

- **uni-app** + **Vue 3** + **Vite**
- **SCSS** 样式预处理
- **uni-app 内置路由**（hash 模式）

## 功能页面

- **首页** (`pages/index/index`) - 搜索框、促销横幅、分类入口、限时优惠、推荐商家
- **分类** (`pages/menu/menu`) - 左右分栏，分类浏览菜品
- **购物车** (`pages/cart/cart`) - 购物车列表与结算
- **我的** (`pages/mine/mine`) - 用户中心、订单状态、地址管理、优惠券
- **商家详情** (`pages/shop/shop`) - 商家信息与招牌菜品
- **确认订单** (`pages/order-confirm/order-confirm`) - 订单提交

## 设计风格

- 毛玻璃（glassmorphism）设计
- 暖橘色主色调 `#FF6D00`
- 35+ 独立图标（操作按钮、分类入口、订单状态等）

## 本地开发

```bash
# 安装依赖
npm install

# 启动 H5 开发服务器
npm run dev:h5

# 构建生产版本
npm run build:h5
```

构建产物在 `dist/build/h5/` 目录。

## 部署到 GitHub Pages

本项目配置了 GitHub Actions 自动部署：

1. 推送到 `main` 分支自动触发构建
2. 构建 H5 静态文件
3. 自动发布到 GitHub Pages

首次使用需要在 GitHub 仓库 Settings -> Pages 中将 Source 设为 "GitHub Actions"。

## 目录结构

```
.
├── src/                       # 源代码
│   ├── pages/                 # 页面文件
│   ├── components/            # 公共组件
│   ├── static/                # 静态资源（图标、横幅、背景）
│   ├── App.vue                # 应用入口
│   ├── main.js                # JS 入口
│   ├── manifest.json          # uni-app 配置
│   └── pages.json             # 页面路由配置
├── dist/                      # 构建产物（不入版本库）
├── .github/workflows/         # GitHub Actions
├── vite.config.js             # Vite 构建配置
└── package.json
```

## License

MIT
