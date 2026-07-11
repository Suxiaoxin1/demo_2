<template>
  <view class="page-cart">
    <!-- 有内容时 -->
    <view v-if="cartList.length > 0">
      <!-- 商家标题 -->
      <view class="cart-shop-bar">
        <view class="shop-icon" data-icon="icon_shop"></view>
        <text class="shop-name">科秒外卖精选</text>
      </view>

      <!-- 商品列表 -->
      <view class="cart-list">
        <view
          v-for="item in cartList"
          :key="item.id"
          class="cart-item"
        >
          <view class="item-check" @click="onToggleCheck(item)" hover-class="hover-scale">
            <view class="checkbox" :class="{ checked: item.checked !== false }">
              <text v-if="item.checked !== false" class="check-mark">✓</text>
            </view>
          </view>

          <view class="item-cover" data-banner="banner_cart_food"></view>

          <view class="item-info">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-price">¥{{ item.price }}</text>
          </view>

          <view class="item-quantity">
            <view class="qty-btn" data-icon="btn_minus" hover-class="hover-scale" @click="onDecrease(item)"></view>
            <text class="qty-num">{{ item.quantity }}</text>
            <view class="qty-btn" data-icon="btn_plus" hover-class="hover-scale" @click="onIncrease(item)"></view>
          </view>
        </view>
      </view>

      <!-- 备注 -->
      <view class="cart-remark">
        <text class="remark-label">备注</text>
        <input class="remark-input" v-model="remark" placeholder="口味、配送要求等..." />
      </view>

      <!-- 底部结算栏 -->
      <view class="cart-footer safe-bottom">
        <view class="footer-left">
          <view class="all-check" hover-class="hover-opacity" @click="onToggleAll">
            <view class="checkbox" :class="{ checked: allChecked }">
              <text v-if="allChecked" class="check-mark">✓</text>
            </view>
            <text class="all-check-text">全选</text>
          </view>
          <text class="footer-summary">
            合计：<text class="total-price">¥{{ totalPrice }}</text>
          </text>
        </view>
        <view
          class="submit-btn"
          :class="{ disabled: totalPrice <= 0 }"
          hover-class="hover-scale"
          @click="onSubmit"
        >
          <text>去结算({{ totalCount }})</text>
        </view>
      </view>
    </view>

    <!-- 空购物车 -->
    <view v-else class="cart-empty">
      <view class="empty-icon" data-icon="icon_cart_empty"></view>
      <text class="empty-text">购物车是空的</text>
      <text class="empty-hint">去首页逛逛吧</text>
      <view class="go-home-btn btn btn-primary" hover-class="hover-scale" @click="onGoHome">
        <text>去逛逛</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const cartList = ref([])
const remark = ref('')

const allChecked = computed(() => cartList.value.length > 0 && cartList.value.every(i => i.checked !== false))
const totalPrice = computed(() => {
  return cartList.value
    .filter(i => i.checked !== false)
    .reduce((sum, i) => sum + (parseFloat(i.price) || 0) * i.quantity, 0)
    .toFixed(2)
})
const totalCount = computed(() => {
  return cartList.value
    .filter(i => i.checked !== false)
    .reduce((sum, i) => sum + i.quantity, 0)
})

function loadCart() {
  const app = getApp()
  if (!app || !app.globalData) return
  cartList.value = (app.globalData.cart || []).map(i => ({ ...i, checked: true }))
}

onMounted(() => { loadCart() })
onShow(() => { loadCart() })

function onToggleCheck(item) {
  item.checked = item.checked === false ? true : false
}

function onToggleAll() {
  const val = !allChecked.value
  cartList.value.forEach(i => { i.checked = val })
}

function onIncrease(item) {
  // #ifdef MP-WEIXIN
  wx.vibrateShort({ type: 'light' })
  // #endif
  item.quantity++
  syncToGlobal()
  uni.showToast({ title: '已增加数量', icon: 'none', duration: 600 })
}

function onDecrease(item) {
  // #ifdef MP-WEIXIN
  wx.vibrateShort({ type: 'light' })
  // #endif
  if (item.quantity <= 1) {
    cartList.value = cartList.value.filter(c => c.id !== item.id)
    uni.showToast({ title: '已移除商品', icon: 'none', duration: 600 })
  } else {
    item.quantity--
  }
  syncToGlobal()
}

function syncToGlobal() {
  const app = getApp()
  if (!app || !app.globalData) return
  app.globalData.cart = cartList.value
  app.globalData.cartCount = cartList.value.reduce((s, c) => s + c.quantity, 0)
  uni.$emit('cartUpdate', app.globalData.cartCount)
}

function onSubmit() {
  if (totalPrice.value <= 0) return
  uni.navigateTo({
    url: `/pages/order-confirm/order-confirm?items=${encodeURIComponent(JSON.stringify(cartList.value.filter(i => i.checked !== false)))}&total=${totalPrice.value}&remark=${encodeURIComponent(remark.value)}`
  })
}

function onGoHome() {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
.page-cart { min-height: 100vh; padding-bottom: 140rpx; }

.cart-shop-bar {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  background: #FFF;
  border-bottom: 1rpx solid var(--color-border);
}
.shop-icon { width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center; font-size: 36rpx; margin-right: 16rpx; }
.shop-name { font-size: 30rpx; font-weight: bold; }

.cart-list { background: #FFF; }
.cart-item {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid var(--color-border);
}
.item-check { margin-right: 16rpx; }
.checkbox {
  width: 40rpx; height: 40rpx;
  border: 3rpx solid #CCC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checkbox.checked { background: var(--color-primary); border-color: var(--color-primary); }
.check-mark { color: #FFF; font-size: 22rpx; font-weight: bold; }
.item-cover {
  width: 100rpx; height: 100rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  margin-right: 20rpx;
}
.item-emoji { font-size: 48rpx; }
.item-info { flex: 1; }
.item-name { font-size: 28rpx; display: block; margin-bottom: 8rpx; }
.item-price { font-size: 26rpx; color: var(--color-primary); font-weight: bold; }

.item-quantity { display: flex; align-items: center; gap: 12rpx; }
.qty-btn {
  width: 48rpx; height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 32rpx;
  font-weight: bold;
}
.qty-num { font-size: 28rpx; min-width: 40rpx; text-align: center; }

.cart-remark {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  background: #FFF;
  margin-top: 20rpx;
}
.remark-label { font-size: 26rpx; color: var(--color-text-light); margin-right: 20rpx; flex-shrink: 0; }
.remark-input { flex: 1; font-size: 26rpx; }

/* 底部结算栏 */
.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFF;
  padding: 16rpx 30rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.06);
  z-index: 100;
}
.footer-left { display: flex; align-items: center; gap: 16rpx; }
.all-check { display: flex; align-items: center; gap: 8rpx; }
.all-check-text { font-size: 24rpx; color: var(--color-text-light); }
.footer-summary { font-size: 26rpx; }
.total-price { font-size: 32rpx; color: var(--color-primary); font-weight: bold; }
.submit-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: #FFF;
  padding: 16rpx 40rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
}
.submit-btn.disabled { opacity: 0.5; }

/* 空购物车 */
.cart-empty { text-align: center; padding: 200rpx 0; }
.empty-icon {
  width: 200rpx; height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30rpx;
  font-size: 80rpx;
}
.empty-text { font-size: 30rpx; color: var(--color-text); display: block; }
.empty-hint { font-size: 24rpx; color: var(--color-text-lighter); display: block; margin: 12rpx 0 40rpx; }
.go-home-btn { display: inline-block; padding: 20rpx 80rpx; }
</style>
