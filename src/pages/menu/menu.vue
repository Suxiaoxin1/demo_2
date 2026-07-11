<template>
  <view class="page-menu">
    <!-- 左侧一级分类 -->
    <scroll-view class="menu-sidebar" scroll-y>
      <view
        v-for="cat in mainCategories"
        :key="cat.id"
        class="sidebar-item"
        :class="{ active: activeMain === cat.id }"
        hover-class="hover-opacity"
        @click="onMainCat(cat)"
      >
        <text class="sidebar-text">{{ cat.name }}</text>
      </view>
    </scroll-view>

    <!-- 右侧菜品列表 -->
    <scroll-view class="menu-content" scroll-y @scrolltolower="onLoadMore">
      <view class="sub-header">
        <text class="sub-title">{{ currentMainName }}</text>
      </view>

      <view
        v-for="item in foodList"
        :key="item.id"
        class="food-card card"
        hover-class="hover-opacity"
      >
        <view class="food-cover" data-banner="banner_food_thumb"></view>
        <view class="food-info">
          <text class="food-name">{{ item.name }}</text>
          <text class="food-desc">{{ item.desc }}</text>
          <text class="food-sales">月售 {{ item.sales }}</text>
          <view class="food-bottom">
            <text class="food-price">¥{{ item.price }}</text>
            <view class="add-btn" data-icon="btn_add" hover-class="hover-scale" @click.stop="onAdd(item)"></view>
          </view>
        </view>
      </view>

      <view v-if="foodList.length === 0" class="empty-tip">暂无菜品</view>
      <view v-if="loadingMore" class="loading-tip">加载中...</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const activeMain = ref(4)

const mainCategories = ref([
  { id: 4, name: '饮品' },
  { id: 5, name: '凉菜' },
  { id: 6, name: '烧烤' },
  { id: 7, name: '小吃' }
])

const foodMap = {
  4: [
    { id: 401, name: '珍珠奶茶', desc: '黑糖珍珠+鲜奶+红茶', sales: 3200, price: '16.00', emoji: '🧋', category: '奶茶' },
    { id: 402, name: '冰美式', desc: '双倍浓缩+冰水', sales: 1800, price: '18.00', emoji: '☕', category: '咖啡' },
    { id: 403, name: '芒果冰沙', desc: '新鲜芒果+椰奶打成', sales: 987, price: '22.00', emoji: '🥭', category: '冰沙' }
  ],
  5: [
    { id: 501, name: '拍黄瓜', desc: '爽脆黄瓜配蒜泥醋汁', sales: 2100, price: '12.00', emoji: '🥒', category: '素凉' },
    { id: 502, name: '凉拌木耳', desc: '东北黑木耳+香菜+辣椒油', sales: 1650, price: '15.00', emoji: '🫘', category: '素凉' },
    { id: 503, name: '口水鸡', desc: '麻辣鲜香，鸡肉嫩滑', sales: 980, price: '28.00', emoji: '🍗', category: '荤凉' },
    { id: 504, name: '蒜泥白肉', desc: '薄切五花肉配蒜泥酱', sales: 756, price: '32.00', emoji: '🥩', category: '荤凉' }
  ],
  6: [
    { id: 601, name: '羊肉串', desc: '新疆风味，孜然辣椒', sales: 3500, price: '5.00', emoji: '🍢', category: '烤串' },
    { id: 602, name: '烤鸡翅', desc: '蜜汁奥尔良风味', sales: 2200, price: '12.00', emoji: '🍗', category: '烤串' },
    { id: 603, name: '烤茄子', desc: '蒜蓉茄子，软糯入味', sales: 1800, price: '10.00', emoji: '🍆', category: '素烤' },
    { id: 604, name: '烤生蚝', desc: '蒜蓉粉丝蒸烤，6只装', sales: 890, price: '38.00', emoji: '🦪', category: '海鲜烤' }
  ],
  7: [
    { id: 701, name: '炸鸡排', desc: '台式大鸡排，外酥里嫩', sales: 2800, price: '18.00', emoji: '🍗', category: '炸物' },
    { id: 702, name: '章鱼小丸子', desc: '6粒装，木鱼花+照烧酱', sales: 1500, price: '15.00', emoji: '🐙', category: '炸物' },
    { id: 703, name: '煎饼果子', desc: '天津传统，薄脆+蛋+酱', sales: 3200, price: '10.00', emoji: '🥞', category: '煎烤' },
    { id: 704, name: '烤冷面', desc: '东北小吃，鸡蛋+香肠+洋葱', sales: 2450, price: '8.00', emoji: '🍜', category: '煎烤' }
  ]
}

const foodList = ref(foodMap[4] || [])
const loadingMore = ref(false)

const currentMainName = computed(() => {
  const cat = mainCategories.value.find(c => c.id === activeMain.value)
  return cat ? cat.name : ''
})

onMounted(() => {
  loadInitialData()
})

onShow(() => {
  // 页面显示时检查是否有从首页传来的分类选择
  const app = getApp()
  if (app && app.globalData && app.globalData.selectedCategory) {
    const catId = app.globalData.selectedCategory
    if (foodMap[catId]) {
      activeMain.value = catId
      foodList.value = foodMap[catId] || []
    }
    app.globalData.selectedCategory = null
  }
})

function loadInitialData() {
  const app = getApp()
  if (app && app.globalData && app.globalData.selectedCategory) {
    const catId = app.globalData.selectedCategory
    if (foodMap[catId]) {
      activeMain.value = catId
      foodList.value = foodMap[catId] || []
    }
    app.globalData.selectedCategory = null
  }
}

function onMainCat(cat) {
  activeMain.value = cat.id
  foodList.value = foodMap[cat.id] || []
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
  uni.showToast({ title: '已加入购物车', icon: 'success', duration: 800 })
}

function onLoadMore() {
  loadingMore.value = true
  setTimeout(() => { loadingMore.value = false }, 500)
}
</script>

<style lang="scss" scoped>
.page-menu {
  display: flex;
  height: calc(100vh - env(safe-area-inset-bottom) - 100rpx);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 左侧分类 */
.menu-sidebar {
  width: 180rpx;
  background: #FFF;
}
.sidebar-item {
  padding: 30rpx 20rpx;
  text-align: center;
  border-left: 6rpx solid transparent;
}
.sidebar-item.active {
  border-left-color: var(--color-primary);
  background: #FFF8F0;
}
.sidebar-text { font-size: 26rpx; }
.sidebar-item.active .sidebar-text { color: var(--color-primary); font-weight: bold; }

/* 右侧菜品 */
.menu-content {
  flex: 1;
  background: var(--color-bg);
  padding: 20rpx;
}
.sub-header { margin-bottom: 20rpx; }
.sub-title { font-size: 30rpx; font-weight: bold; }

.food-card {
  display: flex;
  margin-bottom: 20rpx;
  padding: 20rpx;
}
.food-cover {
  width: 160rpx; height: 160rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  margin-right: 20rpx;
}
.food-emoji { font-size: 64rpx; }
.food-info { flex: 1; display: flex; flex-direction: column; }
.food-name { font-size: 28rpx; font-weight: bold; margin-bottom: 6rpx; }
.food-desc { font-size: 22rpx; color: var(--color-text-lighter); margin-bottom: 6rpx; }
.food-sales { font-size: 20rpx; color: var(--color-text-lighter); margin-bottom: 12rpx; }
.food-bottom { display: flex; justify-content: space-between; align-items: center; }
.food-price { font-size: 30rpx; color: var(--color-primary); font-weight: bold; }
.add-btn {
  width: 56rpx; height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.add-text { font-size: 36rpx; color: #FFF; background: var(--color-primary); width: 48rpx; height: 48rpx; line-height: 48rpx; text-align: center; border-radius: 50%; }

.empty-tip, .loading-tip { text-align: center; padding: 40rpx; color: var(--color-text-lighter); }
</style>
