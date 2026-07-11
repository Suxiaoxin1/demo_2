<template>
  <view class="tab-bar-h5">
    <view
      v-for="(item, index) in tabList"
      :key="index"
      class="tab-bar-item"
      @click="onTab(index, item.path)"
      hover-class="hover-opacity"
    >
      <view class="tab-icon" :data-icon="item.icon"></view>
      <text class="tab-text" :style="{ color: index === 2 ? '#FF6D00' : '#999' }">{{ item.text }}</text>
      <view v-if="index === 2 && cartBadge > 0" class="tab-badge">{{ cartBadge > 99 ? '99+' : cartBadge }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cartBadge = ref(0)

const tabList = [
  { text: '首页', path: '/pages/index/index', icon: 'icon_home' },
  { text: '分类', path: '/pages/menu/menu', icon: 'icon_menu' },
  { text: '购物车', path: '/pages/cart/cart', icon: 'icon_cart' },
  { text: '我的', path: '/pages/mine/mine', icon: 'icon_mine' }
]

function onTab(index, path) {
  uni.switchTab({ url: path })
}

onMounted(() => {
  const app = getApp()
  if (app && app.globalData) {
    cartBadge.value = app.globalData.cartCount || 0
  }
  uni.$on('cartUpdate', (count) => {
    cartBadge.value = count
  })
})

onUnmounted(() => {
  uni.$off('cartUpdate')
})
</script>

<style scoped>
.tab-bar-h5 {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #FFFFFF;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.06);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}
.tab-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  position: relative;
  cursor: pointer;
}
.tab-icon {
  margin-bottom: 4px;
}
.tab-text { font-size: 12px; }
.tab-badge {
  position: absolute;
  top: 4px;
  right: 50%;
  margin-right: -30px;
  background: #FF4444;
  color: #FFFFFF;
  font-size: 10px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 9px;
  padding: 0 4px;
}
</style>
