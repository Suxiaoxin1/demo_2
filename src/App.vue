<template>
  <!-- #ifdef H5 -->
  <tab-bar-h5 />
  <!-- #endif -->
</template>

<script>
// 单独 script 块声明 globalData（uni-app 官方推荐的初始化方式）
export default {
  globalData: {
    cart: [],
    cartCount: 0,
    selectedCategory: 1
  }
}
</script>

<script setup>
import { onLaunch } from '@dcloudio/uni-app'

// #ifdef H5
import TabBarH5 from '@/components/TabBarH5.vue'
// #endif

onLaunch(() => {
  // 初始化 globalData（getApp() 在 setup 中可能返回 undefined，做 null guard）
  const app = getApp()
  if (!app) return
  if (!app.globalData) {
    app.globalData = {}
  }
  app.globalData.cart = app.globalData.cart || []
  app.globalData.cartCount = app.globalData.cartCount || 0
  app.globalData.selectedCategory = app.globalData.selectedCategory || 1
})
</script>

<style lang="scss">
/* ========== 全局设计令牌（CSS 变量） ========== */
page {
  --color-primary: #FF6D00;
  --color-primary-light: #FF8F33;
  --color-primary-dark: #E65100;
  --color-secondary: #FFC107;
  --color-bg: #F5F5F5;
  --color-bg-white: #FFFFFF;
  --color-text: #333333;
  --color-text-light: #666666;
  --color-text-lighter: #999999;
  --color-border: #EEEEEE;
  --color-danger: #FF4444;
  --color-success: #4CAF50;
  --radius-sm: 8rpx;
  --radius-md: 16rpx;
  --radius-lg: 24rpx;
  --shadow-card: 0 4rpx 16rpx rgba(0,0,0,0.06);
  --shadow-float: 0 8rpx 32rpx rgba(0,0,0,0.12);
  --safe-bottom: env(safe-area-inset-bottom);

  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
  font-size: 28rpx;
  color: var(--color-text);
  background-color: var(--color-bg);
  box-sizing: border-box;
}

/* ========== 单图图标框架（v4.1 — 贯穿始终） ========== */
[data-icon] {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

[data-bg] {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

[data-banner] {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

/* ========== 占位蒙皮已清除 — 阶段 7 注入真实图片 ========== */
[data-icon] {
  background-color: transparent;
  border: none;
}

[data-bg] {
  background-color: transparent;
}

[data-banner] {
  background-color: transparent;
  border: none;
}

/* ========== 图标逐元素注入（v4.1 单图方案） ========== */
/* #ifdef MP-WEIXIN */
/* TabBar 导航图标 — 60rpx */
[data-icon="icon_home"]   { background-image: url('http://192.168.1.63:9999/icons/icon_home.png');   width: 60rpx; height: 60rpx; }
[data-icon="icon_menu"]   { background-image: url('http://192.168.1.63:9999/icons/icon_menu.png');   width: 60rpx; height: 60rpx; }
[data-icon="icon_cart"]   { background-image: url('http://192.168.1.63:9999/icons/icon_cart.png');   width: 60rpx; height: 60rpx; }
[data-icon="icon_mine"]   { background-image: url('http://192.168.1.63:9999/icons/icon_mine.png');   width: 60rpx; height: 60rpx; }

/* 操作按钮 — 56rpx */
[data-icon="btn_add"]       { background-image: url('http://192.168.1.63:9999/icons/btn_add.png');       width: 56rpx; height: 56rpx; }
[data-icon="btn_add_cart"]  { background-image: url('http://192.168.1.63:9999/icons/btn_add_cart.png');  width: 56rpx; height: 56rpx; }
[data-icon="btn_minus"]     { background-image: url('http://192.168.1.63:9999/icons/btn_minus.png');     width: 56rpx; height: 56rpx; }
[data-icon="btn_plus"]      { background-image: url('http://192.168.1.63:9999/icons/btn_plus.png');      width: 56rpx; height: 56rpx; }

/* 分类入口 — 100rpx */
[data-icon="icon_cat"]    { background-image: url('http://192.168.1.63:9999/icons/icon_cat.png');    width: 100rpx; height: 100rpx; }
[data-icon="icon_cat_drink"] { background-image: url('http://192.168.1.63:9999/icons/icon_cat_drink.png'); width: 100rpx; height: 100rpx; }
[data-icon="icon_cat_cold"]  { background-image: url('http://192.168.1.63:9999/icons/icon_cat_cold.png');  width: 100rpx; height: 100rpx; }
[data-icon="icon_cat_bbq"]   { background-image: url('http://192.168.1.63:9999/icons/icon_cat_bbq.png');   width: 100rpx; height: 100rpx; }
[data-icon="icon_cat_snack"] { background-image: url('http://192.168.1.63:9999/icons/icon_cat_snack.png'); width: 100rpx; height: 100rpx; }

/* 空状态占位 — 160rpx */
[data-icon="icon_empty"]       { background-image: url('http://192.168.1.63:9999/icons/icon_empty.png');       width: 160rpx; height: 160rpx; }
[data-icon="icon_cart_empty"]  { background-image: url('http://192.168.1.63:9999/icons/icon_cart_empty.png');  width: 160rpx; height: 160rpx; }

/* 列表指示符 — 40rpx */
[data-icon="icon_arrow"]        { background-image: url('http://192.168.1.63:9999/icons/icon_arrow.png');        width: 40rpx; height: 40rpx; }
[data-icon="icon_arrow_right"]  { background-image: url('http://192.168.1.63:9999/icons/icon_arrow_right.png');  width: 40rpx; height: 40rpx; }

/* 功能入口图标 — 56rpx */
[data-icon="icon_func"]           { background-image: url('http://192.168.1.63:9999/icons/icon_func.png');           width: 56rpx; height: 56rpx; }
[data-icon="icon_setting"]        { background-image: url('http://192.168.1.63:9999/icons/icon_setting.png');        width: 56rpx; height: 56rpx; }
[data-icon="icon_order_status"]   { background-image: url('http://192.168.1.63:9999/icons/icon_order_status.png');   width: 56rpx; height: 56rpx; }
[data-icon="icon_shop"]           { background-image: url('http://192.168.1.63:9999/icons/icon_shop.png');           width: 56rpx; height: 56rpx; }
[data-icon="icon_shop_small"]     { background-image: url('http://192.168.1.63:9999/icons/icon_shop_small.png');     width: 56rpx; height: 56rpx; }

/* 订单状态入口 — 80rpx */
[data-icon="icon_pending"]    { background-image: url('http://192.168.1.63:9999/icons/icon_pending.png');    width: 80rpx; height: 80rpx; }
[data-icon="icon_delivering"] { background-image: url('http://192.168.1.63:9999/icons/icon_delivering.png'); width: 80rpx; height: 80rpx; }
[data-icon="icon_completed"]  { background-image: url('http://192.168.1.63:9999/icons/icon_completed.png');  width: 80rpx; height: 80rpx; }
[data-icon="icon_refund"]     { background-image: url('http://192.168.1.63:9999/icons/icon_refund.png');     width: 80rpx; height: 80rpx; }

/* 我的页面功能入口 — 56rpx */
[data-icon="icon_address"]  { background-image: url('http://192.168.1.63:9999/icons/icon_address.png');  width: 56rpx; height: 56rpx; }
[data-icon="icon_coupon"]   { background-image: url('http://192.168.1.63:9999/icons/icon_coupon.png');   width: 56rpx; height: 56rpx; }
[data-icon="icon_about"]    { background-image: url('http://192.168.1.63:9999/icons/icon_about.png');    width: 56rpx; height: 56rpx; }
[data-icon="icon_feedback"] { background-image: url('http://192.168.1.63:9999/icons/icon_feedback.png'); width: 56rpx; height: 56rpx; }

/* 特殊形状 */
[data-icon="icon_search"]    { background-image: url('http://192.168.1.63:9999/icons/icon_search.png');    width: 40rpx; height: 40rpx; }
[data-icon="icon_location"]  { background-image: url('http://192.168.1.63:9999/icons/icon_location.png');  width: 56rpx; height: 56rpx; }
[data-icon="icon_avatar"]    { background-image: url('http://192.168.1.63:9999/icons/icon_avatar.png');    width: 120rpx; height: 120rpx; }

/* 底部购物车栏 — 80rpx */
[data-icon="icon_cart_footer"] { background-image: url('http://192.168.1.63:9999/icons/icon_cart_footer.png'); width: 80rpx; height: 80rpx; }

/* H5 回退 TabBar */
[data-icon="icon_tab"] { background-image: url('http://192.168.1.63:9999/icons/icon_tab.png'); width: 60rpx; height: 60rpx; }

/* 背景图注入 */
[data-bg="bg_mine"] { background-image: url('http://192.168.1.63:9999/bg/bg_mine.jpg'); }

/* 横幅注入 */
[data-banner="banner_promo"]         { background-image: url('http://192.168.1.63:9999/banners/banner_promo.jpg'); }
[data-banner="banner_activity"]      { background-image: url('http://192.168.1.63:9999/banners/banner_activity.jpg'); }
[data-banner="banner_shop_cover"]    { background-image: url('http://192.168.1.63:9999/banners/banner_shop_cover.jpg'); }
[data-banner="banner_shop_header"]   { background-image: url('http://192.168.1.63:9999/banners/banner_shop_header.jpg'); }
[data-banner="banner_food_thumb"]    { background-image: url('http://192.168.1.63:9999/banners/banner_food_thumb.jpg'); }
[data-banner="banner_cart_food"]     { background-image: url('http://192.168.1.63:9999/banners/banner_cart_food.jpg'); }
[data-banner="banner_order_food"]    { background-image: url('http://192.168.1.63:9999/banners/banner_order_food.jpg'); }
/* #endif */

/* #ifdef H5 */
/* TabBar 导航图标 */
[data-icon="icon_home"]   { background-image: url('/static/icons/icon_home.png');   width: 60rpx; height: 60rpx; }
[data-icon="icon_menu"]   { background-image: url('/static/icons/icon_menu.png');   width: 60rpx; height: 60rpx; }
[data-icon="icon_cart"]   { background-image: url('/static/icons/icon_cart.png');   width: 60rpx; height: 60rpx; }
[data-icon="icon_mine"]   { background-image: url('/static/icons/icon_mine.png');   width: 60rpx; height: 60rpx; }

/* 操作按钮 */
[data-icon="btn_add"]       { background-image: url('/static/icons/btn_add.png');       width: 56rpx; height: 56rpx; }
[data-icon="btn_add_cart"]  { background-image: url('/static/icons/btn_add_cart.png');  width: 56rpx; height: 56rpx; }
[data-icon="btn_minus"]     { background-image: url('/static/icons/btn_minus.png');     width: 56rpx; height: 56rpx; }
[data-icon="btn_plus"]      { background-image: url('/static/icons/btn_plus.png');      width: 56rpx; height: 56rpx; }

/* 分类入口 */
[data-icon="icon_cat"]    { background-image: url('/static/icons/icon_cat.png');    width: 100rpx; height: 100rpx; }
[data-icon="icon_cat_drink"] { background-image: url('/static/icons/icon_cat_drink.png'); width: 100rpx; height: 100rpx; }
[data-icon="icon_cat_cold"]  { background-image: url('/static/icons/icon_cat_cold.png');  width: 100rpx; height: 100rpx; }
[data-icon="icon_cat_bbq"]   { background-image: url('/static/icons/icon_cat_bbq.png');   width: 100rpx; height: 100rpx; }
[data-icon="icon_cat_snack"] { background-image: url('/static/icons/icon_cat_snack.png'); width: 100rpx; height: 100rpx; }

/* 空状态 */
[data-icon="icon_empty"]       { background-image: url('/static/icons/icon_empty.png');       width: 160rpx; height: 160rpx; }
[data-icon="icon_cart_empty"]  { background-image: url('/static/icons/icon_cart_empty.png');  width: 160rpx; height: 160rpx; }

/* 指示符 */
[data-icon="icon_arrow"]        { background-image: url('/static/icons/icon_arrow.png');        width: 40rpx; height: 40rpx; }
[data-icon="icon_arrow_right"]  { background-image: url('/static/icons/icon_arrow_right.png');  width: 40rpx; height: 40rpx; }

/* 功能入口 */
[data-icon="icon_func"]           { background-image: url('/static/icons/icon_func.png');           width: 56rpx; height: 56rpx; }
[data-icon="icon_setting"]        { background-image: url('/static/icons/icon_setting.png');        width: 56rpx; height: 56rpx; }
[data-icon="icon_order_status"]   { background-image: url('/static/icons/icon_order_status.png');   width: 56rpx; height: 56rpx; }
[data-icon="icon_shop"]           { background-image: url('/static/icons/icon_shop.png');           width: 56rpx; height: 56rpx; }
[data-icon="icon_shop_small"]     { background-image: url('/static/icons/icon_shop_small.png');     width: 56rpx; height: 56rpx; }

/* 订单状态入口 — 80rpx */
[data-icon="icon_pending"]    { background-image: url('/static/icons/icon_pending.png');    width: 80rpx; height: 80rpx; }
[data-icon="icon_delivering"] { background-image: url('/static/icons/icon_delivering.png'); width: 80rpx; height: 80rpx; }
[data-icon="icon_completed"]  { background-image: url('/static/icons/icon_completed.png');  width: 80rpx; height: 80rpx; }
[data-icon="icon_refund"]     { background-image: url('/static/icons/icon_refund.png');     width: 80rpx; height: 80rpx; }

/* 我的页面功能入口 — 56rpx */
[data-icon="icon_address"]  { background-image: url('/static/icons/icon_address.png');  width: 56rpx; height: 56rpx; }
[data-icon="icon_coupon"]   { background-image: url('/static/icons/icon_coupon.png');   width: 56rpx; height: 56rpx; }
[data-icon="icon_about"]    { background-image: url('/static/icons/icon_about.png');    width: 56rpx; height: 56rpx; }
[data-icon="icon_feedback"] { background-image: url('/static/icons/icon_feedback.png'); width: 56rpx; height: 56rpx; }

/* 特殊形状 */
[data-icon="icon_search"]    { background-image: url('/static/icons/icon_search.png');    width: 40rpx; height: 40rpx; }
[data-icon="icon_location"]  { background-image: url('/static/icons/icon_location.png');  width: 56rpx; height: 56rpx; }
[data-icon="icon_avatar"]    { background-image: url('/static/icons/icon_avatar.png');    width: 120rpx; height: 120rpx; }

/* 底部购物车栏 */
[data-icon="icon_cart_footer"] { background-image: url('/static/icons/icon_cart_footer.png'); width: 80rpx; height: 80rpx; }

/* H5 回退 TabBar */
[data-icon="icon_tab"] { background-image: url('/static/icons/icon_tab.png'); width: 60rpx; height: 60rpx; }

/* 背景图 */
[data-bg="bg_mine"] { background-image: url('/static/bg/bg_mine.jpg'); }

/* 横幅 */
[data-banner="banner_promo"]         { background-image: url('/static/banners/banner_promo.jpg'); }
[data-banner="banner_activity"]      { background-image: url('/static/banners/banner_activity.jpg'); }
[data-banner="banner_shop_cover"]    { background-image: url('/static/banners/banner_shop_cover.jpg'); }
[data-banner="banner_shop_header"]   { background-image: url('/static/banners/banner_shop_header.jpg'); }
[data-banner="banner_food_thumb"]    { background-image: url('/static/banners/banner_food_thumb.jpg'); }
[data-banner="banner_cart_food"]     { background-image: url('/static/banners/banner_cart_food.jpg'); }
[data-banner="banner_order_food"]    { background-image: url('/static/banners/banner_order_food.jpg'); }
/* #endif */

/* ========== 通用组件样式 ========== */

/* 卡片容器 */
.card {
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

/* 按钮基础 */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 28rpx;
  padding: 20rpx 40rpx;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: #FFFFFF;
}

.btn-outline {
  background: transparent;
  border: 2rpx solid var(--color-primary);
  color: var(--color-primary);
}


/* 安全区底部 */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* 点击态 */
.hover-opacity { opacity: 0.7; }
.hover-scale { transform: scale(0.95); }

/* ========== 底部 TabBar 字号覆盖（uni-app 内置 uni-tabbar 组件） ========== */
/* 覆盖 .uni-tabbar__label 默认 10px，让底部导航文字更清晰易读 */
.uni-tabbar__label {
  font-size: 14px !important;
  line-height: 1.2 !important;
}
/* TabBar 图标略放大，与文字大小协调 */
.uni-tabbar__icon {
  width: 28px !important;
  height: 28px !important;
}
/* TabBar 项高调整，避免文字撑开 */
.uni-tabbar__item {
  padding: 6px 0 !important;
}
</style>
