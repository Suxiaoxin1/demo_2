<template>
  <view class="page-mine">
    <!-- 用户头部 -->
    <view class="mine-header" data-bg="bg_mine">
      <view class="user-avatar" data-icon="icon_avatar"></view>
      <text class="user-name">{{ userName || '点击登录' }}</text>
      <text class="user-phone" v-if="phone">{{ phone }}</text>
    </view>

    <!-- 订单状态入口 -->
    <view class="order-section card">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <text class="section-more" hover-class="hover-opacity" @click="onAllOrders">全部 ›</text>
      </view>
      <view class="order-status">
        <view
          v-for="s in orderStatus"
          :key="s.key"
          class="status-item"
          hover-class="hover-opacity"
          @click="onOrderStatus(s.key)"
        >
          <view class="status-icon" :data-icon="s.icon"></view>
          <text class="status-text">{{ s.label }}</text>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="func-section card">
      <view
        v-for="f in functions"
        :key="f.key"
        class="func-item"
        hover-class="hover-opacity"
        @click="onFunction(f.key)"
      >
        <view class="func-left">
          <view class="func-icon" :data-icon="f.icon"></view>          <text class="func-name">{{ f.label }}</text>
        </view>
        <view class="func-right" data-icon="icon_arrow"></view>
      </view>
    </view>

    <!-- 设置 -->
    <view class="func-section card">
      <view
        v-for="s in settings"
        :key="s.key"
        class="func-item"
        hover-class="hover-opacity"
        @click="onSetting(s.key)"
      >
        <view class="func-left">
          <view class="func-icon" :data-icon="s.icon"></view>          <text class="func-name">{{ s.label }}</text>
        </view>
        <view class="func-right" data-icon="icon_arrow"></view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section" v-if="userName">
      <view class="logout-btn btn btn-outline" hover-class="hover-scale" @click="onLogout">
        <text>退出登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const userName = ref('')
const phone = ref('')

const orderStatus = ref([
  { key: 'pending', label: '待付款', icon: 'icon_pending' },
  { key: 'delivering', label: '配送中', icon: 'icon_delivering' },
  { key: 'completed', label: '已完成', icon: 'icon_completed' },
  { key: 'refund', label: '退款/售后', icon: 'icon_refund' }
])

const functions = ref([
  { key: 'address', label: '收货地址', icon: 'icon_address' },
  { key: 'coupon', label: '优惠券', icon: 'icon_coupon' }
])

const settings = ref([
  { key: 'about', label: '关于我们', icon: 'icon_about' },
  { key: 'feedback', label: '一键反馈', icon: 'icon_feedback' },
  { key: 'setting', label: '设置', icon: 'icon_setting' }
])

onShow(() => {
  // 页面显示时刷新用户状态
  const app = getApp()
  if (app && app.globalData) {
    // 预留：从 globalData 同步用户信息
  }
})

function onOrderStatus(status) {
  uni.showToast({ title: `查看${orderStatus.value.find(s => s.key === status)?.label}订单`, icon: 'none' })
}

function onAllOrders() {
  uni.showToast({ title: '全部订单', icon: 'none' })
}

function onFunction(key) {
  const actions = {
    address: '收货地址管理',
    coupon: '优惠券列表'
  }
  uni.showToast({ title: actions[key] || key, icon: 'none' })
}

function onSetting(key) {
  const actions = {
    about: '科秒外卖 v1.0.0',
    feedback: '一键反馈',
    setting: '设置'
  }
  uni.showToast({ title: actions[key] || key, icon: 'none' })
}

function onLogout() {
  userName.value = ''
  phone.value = ''
  uni.showToast({ title: '已退出登录', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.page-mine { padding-bottom: 40rpx; }

/* 头部 */
.mine-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0 40rpx;
}
.user-avatar {
  width: 120rpx; height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 20rpx;
}
.avatar-emoji { font-size: 56rpx; }
.user-name { font-size: 32rpx; font-weight: bold; color: #FFF; margin-bottom: 8rpx; }
.user-phone { font-size: 24rpx; color: rgba(255,255,255,0.8); }

/* 订单区域 */
.order-section { margin: 20rpx 30rpx; padding: 24rpx; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; }
.section-title { font-size: 28rpx; font-weight: bold; }
.section-more { font-size: 24rpx; color: var(--color-text-lighter); }
.order-status { display: flex; justify-content: space-around; }
.status-item { display: flex; flex-direction: column; align-items: center; }
.status-icon {
  width: 80rpx; height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
  border-radius: var(--radius-sm);
}
.status-emoji { font-size: 40rpx; }
.status-text { font-size: 22rpx; color: var(--color-text-light); }

/* 功能列表 */
.func-section { margin: 0 30rpx 20rpx; }
.func-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 24rpx;
  border-bottom: 1rpx solid var(--color-border);
}
.func-item:last-child { border-bottom: none; }
.func-left { display: flex; align-items: center; }
.func-icon {
  width: 56rpx; height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  border-radius: var(--radius-sm);
}
.func-emoji { font-size: 32rpx; }
.func-name { font-size: 28rpx; }
.func-right {
  width: 40rpx; height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #CCC;
  font-size: 32rpx;
}

/* 退出登录 */
.logout-section { padding: 40rpx 60rpx; }
.logout-btn { width: 100%; padding: 24rpx 0; }
</style>
