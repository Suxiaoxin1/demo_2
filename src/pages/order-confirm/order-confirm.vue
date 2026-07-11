<template>
  <view class="page-order-confirm">
    <!-- 收货地址 -->
    <view class="address-card card" @click="onChooseAddress" hover-class="hover-opacity">
      <view class="address-icon" data-icon="icon_location"></view>
      <view class="address-info" v-if="address">
        <text class="address-contact">{{ address.name }} {{ address.phone }}</text>
        <text class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }} {{ address.detail }}</text>
      </view>
      <view class="address-info" v-else>
        <text class="address-empty">请选择收货地址</text>
      </view>
      <view class="address-arrow" data-icon="icon_arrow_right">›</view>
    </view>

    <!-- 商品列表 -->
    <view class="items-card card">
      <view class="items-header">
        <view class="shop-icon" data-icon="icon_shop_small"></view>
        <text class="shop-name">科秒外卖精选</text>
      </view>
      <view v-for="item in orderItems" :key="item.id" class="order-item">
        <view class="item-cover" data-banner="banner_order_food"></view>
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-count">×{{ item.quantity }}</text>
        </view>
        <text class="item-price">¥{{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</text>
      </view>
    </view>

    <!-- 费用明细 -->
    <view class="fee-card card">
      <view class="fee-row">
        <text class="fee-label">商品小计</text>
        <text class="fee-value">¥{{ subtotal }}</text>
      </view>
      <view class="fee-row">
        <text class="fee-label">配送费</text>
        <text class="fee-value">¥{{ deliveryFee }}</text>
      </view>
      <view class="fee-row" v-if="discount > 0">
        <text class="fee-label">优惠</text>
        <text class="fee-value discount">-¥{{ discount.toFixed(2) }}</text>
      </view>
      <view class="fee-row total-row">
        <text class="fee-label">实付金额</text>
        <text class="fee-value total">¥{{ actualTotal }}</text>
      </view>
    </view>

    <!-- 备注 -->
    <view class="remark-card card">
      <text class="remark-label">备注</text>
      <input class="remark-input" v-model="remark" placeholder="口味、配送要求等..." />
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section safe-bottom">
      <view class="submit-info">
        <text class="submit-total-label">实付：</text>
        <text class="submit-total-price">¥{{ actualTotal }}</text>
      </view>
      <view
        class="submit-btn"
        :class="{ loading: submitting }"
        hover-class="hover-scale"
        @click="onSubmitOrder"
      >
        <text v-if="!submitting">确认下单</text>
        <text v-else>提交中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const orderItems = ref([])
const total = ref('0.00')
const remark = ref('')
const address = ref(null)
const deliveryFee = ref('3.00')
const discount = ref(3.00)
const submitting = ref(false)

const subtotal = computed(() => {
  return orderItems.value
    .reduce((s, i) => s + (parseFloat(i.price) || 0) * i.quantity, 0)
    .toFixed(2)
})

const actualTotal = computed(() => {
  const val = parseFloat(subtotal.value) + parseFloat(deliveryFee.value) - discount.value
  return Math.max(0, val).toFixed(2)
})

onMounted(() => {
  // 从 URL 参数获取订单数据
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const options = page.$page?.options || page.options || {}

  if (options.items) {
    try {
      orderItems.value = JSON.parse(decodeURIComponent(options.items))
    } catch (e) {
      orderItems.value = []
    }
  }
  if (options.total) total.value = options.total
  if (options.remark) remark.value = decodeURIComponent(options.remark)
})

function onChooseAddress() {
  // #ifdef MP-WEIXIN
  uni.chooseAddress({
    success: (res) => {
      address.value = {
        name: res.userName,
        phone: res.telNumber,
        province: res.provinceName,
        city: res.cityName,
        district: res.countyName,
        detail: res.detailInfo
      }
    },
    fail: (err) => {
      if (err.errMsg.includes('cancel')) return
      uni.showToast({ title: '获取地址失败', icon: 'none' })
    }
  })
  // #endif
  // #ifdef H5
  uni.showToast({ title: 'H5 暂不支持微信地址选择', icon: 'none' })
  // #endif
}

async function onSubmitOrder() {
  if (!address.value) {
    uni.showToast({ title: '请先选择收货地址', icon: 'none' })
    return
  }
  if (orderItems.value.length === 0) {
    uni.showToast({ title: '订单为空', icon: 'none' })
    return
  }
  if (submitting.value) return
  submitting.value = true

  // #ifdef MP-WEIXIN
  wx.vibrateShort({ type: 'medium' })
  // #endif

  uni.showLoading({ title: '提交中...', mask: true })

  try {
    // 模拟提交（后续接入真实 API）
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 清空购物车
    const app = getApp()
    if (app && app.globalData) {
      app.globalData.cart = []
      app.globalData.cartCount = 0
      uni.$emit('cartUpdate', 0)
    }

    uni.hideLoading()
    uni.showToast({ title: '下单成功！', icon: 'success', duration: 1500 })

    setTimeout(() => {
      uni.switchTab({ url: '/pages/mine/mine' })
    }, 1500)
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '提交失败，请重试', icon: 'none' })
    console.error('提交失败:', e)
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.page-order-confirm { padding: 20rpx 30rpx 160rpx; }

/* 地址卡片 */
.address-card {
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 20rpx;
}
.address-icon {
  width: 56rpx; height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.address-info { flex: 1; }
.address-contact { font-size: 28rpx; font-weight: bold; display: block; margin-bottom: 6rpx; }
.address-detail { font-size: 24rpx; color: var(--color-text-lighter); display: block; }
.address-empty { font-size: 26rpx; color: var(--color-text-lighter); }
.address-arrow {
  width: 40rpx; height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #CCC;
  font-size: 36rpx;
  flex-shrink: 0;
}

/* 商品列表 */
.items-card { margin-bottom: 20rpx; padding: 20rpx 0; }
.items-header { display: flex; align-items: center; padding: 0 30rpx 20rpx; border-bottom: 1rpx solid var(--color-border); }
.shop-icon { width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center; font-size: 32rpx; margin-right: 12rpx; }
.shop-name { font-size: 28rpx; font-weight: bold; }
.order-item { display: flex; align-items: center; padding: 20rpx 30rpx; }
.item-cover {
  width: 80rpx; height: 80rpx;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-sm);
  margin-right: 16rpx;
  flex-shrink: 0;
}
.item-emoji { font-size: 40rpx; }
.item-info { flex: 1; }
.item-name { font-size: 26rpx; display: block; }
.item-count { font-size: 22rpx; color: var(--color-text-lighter); }
.item-price { font-size: 26rpx; font-weight: bold; }

/* 费用明细 */
.fee-card { padding: 24rpx 30rpx; margin-bottom: 20rpx; }
.fee-row { display: flex; justify-content: space-between; padding: 12rpx 0; }
.fee-label { font-size: 26rpx; color: var(--color-text-light); }
.fee-value { font-size: 26rpx; }
.discount { color: var(--color-success); }
.total-row { border-top: 1rpx solid var(--color-border); margin-top: 8rpx; padding-top: 20rpx; }
.total { font-size: 32rpx; color: var(--color-primary); font-weight: bold; }

/* 备注 */
.remark-card { display: flex; align-items: center; padding: 24rpx 30rpx; margin-bottom: 20rpx; }
.remark-label { font-size: 26rpx; color: var(--color-text-light); margin-right: 20rpx; flex-shrink: 0; }
.remark-input { flex: 1; font-size: 26rpx; }

/* 提交按钮 */
.submit-section {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFF;
  padding: 16rpx 30rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.06);
  z-index: 100;
}
.submit-info { display: flex; align-items: baseline; }
.submit-total-label { font-size: 26rpx; }
.submit-total-price { font-size: 36rpx; color: var(--color-primary); font-weight: bold; }
.submit-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: #FFF;
  padding: 20rpx 56rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: bold;
}
.submit-btn.loading { opacity: 0.7; }
</style>
