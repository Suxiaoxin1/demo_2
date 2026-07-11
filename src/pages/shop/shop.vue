<template>
  <view class="page-shop">
    <!-- 商家头部 -->
    <view class="shop-header" data-banner="banner_shop_header">
      <view class="shop-header-mask">
        <text class="shop-title">{{ shop.name }}</text>
        <view class="shop-meta">
          <text class="shop-score">⭐ {{ shop.score }}</text>
          <text class="shop-sales">月售 {{ shop.sales }}</text>
          <text class="shop-time">{{ shop.deliveryTime }}分钟</text>
        </view>
        <text class="shop-notice">📢 {{ shop.notice || '欢迎光临，祝您用餐愉快！' }}</text>
      </view>
    </view>

    <!-- 菜品分类 Tab -->
    <scroll-view class="tabs-bar" scroll-x>
      <view
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: activeTab === tab.id }"
        hover-class="hover-opacity"
        @click="onTab(tab)"
      >
        <text class="tab-text">{{ tab.name }}</text>
      </view>
    </scroll-view>

    <!-- 菜品列表 -->
    <scroll-view class="food-scroll" scroll-y @scrolltolower="onLoadMore">
      <view
        v-for="item in filteredFoods"
        :key="item.id"
        class="food-card card"
      >
        <view class="food-cover" data-banner="banner_food_thumb"></view>
        <view class="food-info">
          <text class="food-name">{{ item.name }}</text>
          <text class="food-desc">{{ item.desc }}</text>
          <text class="food-price">¥{{ item.price }}</text>
        </view>
        <view class="food-action">
          <view class="add-btn" data-icon="btn_add_cart" hover-class="hover-scale" @click="onAdd(item)"></view>
        </view>
      </view>
      <view v-if="loadingMore" class="loading-tip">加载中...</view>
    </scroll-view>

    <!-- 底部购物车栏 -->
    <view class="shop-footer safe-bottom" v-if="cartCount > 0">
      <view class="footer-cart" @click="onGoCart" hover-class="hover-opacity">
        <view class="cart-badge" data-icon="icon_cart_footer"></view>
        <text class="cart-count">{{ cartCount }}</text>
      </view>
      <text class="cart-total">¥{{ cartTotal }}</text>
      <view class="checkout-btn" hover-class="hover-scale" @click="onGoCart">
        <text>去结算</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const shopId = ref(1)
const shop = ref({
  id: 1, name: '老王家常菜', score: '4.8', sales: '3256',
  deliveryTime: '30', deliveryFee: '3.00',
  notice: '新店开业，全场菜品8折优惠！'
})

const activeTab = ref(1)
const tabs = ref([
  { id: 1, name: '热销' },
  { id: 2, name: '川菜' },
  { id: 3, name: '盖饭' },
  { id: 4, name: '汤品' },
  { id: 5, name: '小食' },
  { id: 6, name: '饮品' }
])

const allFoods = ref([
  { id: 1, name: '宫保鸡丁', desc: '鸡肉鲜嫩，花生酥脆', price: '28.00', emoji: '🍗', categoryId: 2, sales: 1523 },
  { id: 2, name: '红烧肉套餐', desc: '入口即化，搭配米饭+汤', price: '32.00', emoji: '🥩', categoryId: 2, sales: 980 },
  { id: 3, name: '番茄炒蛋盖饭', desc: '家常味道，番茄酸甜可口', price: '18.00', emoji: '🍅', categoryId: 3, sales: 2100 },
  { id: 4, name: '麻辣香锅', desc: '自选食材，麻辣鲜香', price: '45.00', emoji: '🥘', categoryId: 2, sales: 756 },
  { id: 5, name: '酸辣汤', desc: '开胃酸辣，料足味浓', price: '12.00', emoji: '🍲', categoryId: 4, sales: 567 },
  { id: 6, name: '炸鸡翅', desc: '外酥里嫩，金黄香脆', price: '16.00', emoji: '🍗', categoryId: 5, sales: 890 },
  { id: 7, name: '冰可乐', desc: '冰镇可口可乐', price: '6.00', emoji: '🥤', categoryId: 6, sales: 2345 }
])

const loadingMore = ref(false)

const filteredFoods = computed(() => {
  if (activeTab.value === 1) return allFoods.value
  return allFoods.value.filter(f => f.categoryId === activeTab.value)
})

const cartCount = ref(0)
const cartTotal = ref(0)

function updateCartBadge() {
  const app = getApp()
  if (!app || !app.globalData) return
  const cart = app.globalData.cart || []
  cartCount.value = cart.reduce((s, c) => s + c.quantity, 0)
  cartTotal.value = cart.reduce((s, c) => s + (parseFloat(c.price) || 0) * c.quantity, 0).toFixed(2)
}

onMounted(() => { updateCartBadge() })

function onTab(tab) {
  activeTab.value = tab.id
}

function onAdd(item) {
  // #ifdef MP-WEIXIN
  wx.vibrateShort({ type: 'light' })
  // #endif
  const app = getApp()
  if (!app || !app.globalData) return
  const cart = app.globalData.cart || []
  const exist = cart.find(c => c.id === item.id)
  if (exist) {
    exist.quantity++
  } else {
    cart.push({ ...item, quantity: 1 })
  }
  app.globalData.cart = cart
  app.globalData.cartCount = cart.reduce((s, c) => s + c.quantity, 0)
  uni.$emit('cartUpdate', app.globalData.cartCount)
  updateCartBadge()
  uni.showToast({ title: '已加入购物车', icon: 'success', duration: 800 })
}

function onGoCart() {
  uni.switchTab({ url: '/pages/cart/cart' })
}

function onLoadMore() {
  loadingMore.value = true
  setTimeout(() => { loadingMore.value = false }, 500)
}
</script>

<style lang="scss" scoped>
.page-shop { padding-bottom: 120rpx; }

.shop-header {
  width: 100%; height: 320rpx;
  position: relative;
}
.shop-header-mask {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 40rpx 30rpx 30rpx;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
}
.shop-title { font-size: 36rpx; font-weight: bold; color: #FFF; display: block; margin-bottom: 8rpx; }
.shop-meta { display: flex; gap: 20rpx; margin-bottom: 8rpx; font-size: 22rpx; color: rgba(255,255,255,0.85); }
.shop-notice { font-size: 22rpx; color: rgba(255,255,255,0.75); }

.tabs-bar {
  white-space: nowrap;
  background: #FFF;
  padding: 16rpx 20rpx;
  display: flex;
  border-bottom: 1rpx solid var(--color-border);
}
.tab-item {
  display: inline-block;
  padding: 12rpx 28rpx;
  font-size: 26rpx;
  margin-right: 8rpx;
  border-radius: 40rpx;
}
.tab-item.active { background: var(--color-primary); }
.tab-item.active .tab-text { color: #FFF; }

.food-scroll { padding: 20rpx 30rpx; }
.food-card { display: flex; align-items: center; padding: 20rpx; margin-bottom: 20rpx; }
.food-cover {
  width: 140rpx; height: 140rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  margin-right: 20rpx;
}
.food-emoji { font-size: 56rpx; }
.food-info { flex: 1; }
.food-name { font-size: 28rpx; font-weight: bold; display: block; margin-bottom: 6rpx; }
.food-desc { font-size: 22rpx; color: var(--color-text-lighter); display: block; margin-bottom: 8rpx; }
.food-price { font-size: 28rpx; color: var(--color-primary); font-weight: bold; }
.food-action { margin-left: 20rpx; }
.add-btn {
  width: 56rpx; height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.add-text { font-size: 36rpx; color: #FFF; background: var(--color-primary); width: 48rpx; height: 48rpx; line-height: 48rpx; text-align: center; border-radius: 50%; }

.loading-tip { text-align: center; padding: 20rpx; color: var(--color-text-lighter); }

/* 底部购物车栏 */
.shop-footer {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  display: flex;
  align-items: center;
  background: #FFF;
  padding: 12rpx 30rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.06);
  z-index: 100;
}
.footer-cart { position: relative; margin-right: 20rpx; }
.cart-badge { width: 80rpx; height: 80rpx; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 40rpx; }
.cart-count {
  position: absolute; top: 0; right: 0;
  background: var(--color-danger);
  color: #FFF; font-size: 20rpx;
  min-width: 32rpx; height: 32rpx;
  line-height: 32rpx; text-align: center;
  border-radius: 16rpx; padding: 0 6rpx;
}
.cart-total { flex: 1; font-size: 28rpx; color: var(--color-primary); font-weight: bold; }
.checkout-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: #FFF;
  padding: 16rpx 44rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  font-weight: bold;
}
</style>
