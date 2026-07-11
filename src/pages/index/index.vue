<template>
  <view class="page-index">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-input" hover-class="hover-opacity" @click="onSearch">
        <view class="search-icon" data-icon="icon_search"></view>
        <text class="search-placeholder">搜索商家或菜品</text>
      </view>
    </view>

    <!-- Banner 轮播 -->
    <swiper class="banner-swiper" indicator-dots autoplay circular interval="4000">
      <swiper-item v-for="(b, i) in banners" :key="i">
        <view class="banner-item" data-banner="banner_promo" hover-class="hover-opacity" @click="onBanner(b)">
          <text class="banner-text">{{ b.title }}</text>
        </view>
      </swiper-item>
    </swiper>

    <!-- 分类入口（九宫格） -->
    <view class="category-grid">
      <view
        v-for="cat in categories"
        :key="cat.id"
        class="category-item"
        hover-class="hover-opacity"
        @click="onCategory(cat)"
      >
        <view class="category-icon" :data-icon="cat.icon"></view>
        <text class="category-name">{{ cat.name }}</text>
      </view>
    </view>

    <!-- 活动横幅 -->
    <view class="section">
      <view class="activity-banner" data-banner="banner_activity" hover-class="hover-opacity" @click="onActivity">
        <text class="activity-text">限时优惠 · 新用户首单立减 10 元</text>
      </view>
    </view>

    <!-- 推荐商家列表 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">推荐商家</text>
        <text class="section-more" hover-class="hover-opacity" @click="onMoreShop">更多 ›</text>
      </view>

      <view
        v-for="shop in shopList"
        :key="shop.id"
        class="shop-card card"
        hover-class="hover-opacity"
        @click="onShop(shop)"
      >
        <view class="shop-cover" data-banner="banner_shop_cover"></view>
        <view class="shop-info">
          <text class="shop-name">{{ shop.name }}</text>
          <view class="shop-meta">
            <text class="shop-score">⭐ {{ shop.score }}</text>
            <text class="shop-sales">月售 {{ shop.sales }}</text>
          </view>
          <view class="shop-tags">
            <text v-for="t in shop.tags" :key="t" class="shop-tag">{{ t }}</text>
          </view>
          <view class="shop-bottom">
            <text class="shop-time">{{ shop.deliveryTime }}分钟</text>
            <text class="shop-fee">配送费 ¥{{ shop.deliveryFee }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载中 -->
    <view v-if="loading && shopList.length === 0" class="loading-state">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 空数据状态 -->
    <view v-else-if="shopList.length === 0 && !loading" class="empty-state">
      <view class="empty-icon" data-icon="icon_empty"></view>
      <text class="empty-text">暂无商家信息</text>
      <text class="empty-hint">请检查网络后下拉刷新</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// #ifdef MP-WEIXIN
import { onPullDownRefresh } from '@dcloudio/uni-app'
// #endif

const loading = ref(true)
const banners = ref([
  { id: 1, title: '🔥 新店开业 · 全场8折', shopId: 0 },
  { id: 2, title: '🎉 周三外卖节 · 满30减15', shopId: 0 },
  { id: 3, title: '🥤 夏日饮品季 · 第二杯半价', shopId: 0 }
])

const categories = ref([
  { id: 4, name: '饮品', icon: 'icon_cat_drink' },
  { id: 5, name: '凉菜', icon: 'icon_cat_cold' },
  { id: 6, name: '烧烤', icon: 'icon_cat_bbq' },
  { id: 7, name: '小吃', icon: 'icon_cat_snack' }
])

const shopList = ref([
  {
    id: 1, name: '老王家常菜', emoji: '🍳',
    score: '4.8', sales: '3256',
    tags: ['家常菜', '川菜', '米饭'],
    deliveryTime: '30', deliveryFee: '3.00'
  },
  {
    id: 2, name: '麦香基汉堡', emoji: '🍔',
    score: '4.6', sales: '1890',
    tags: ['汉堡', '炸鸡', '可乐'],
    deliveryTime: '25', deliveryFee: '2.00'
  },
  {
    id: 3, name: '幸茶', emoji: '🧋',
    score: '4.9', sales: '5021',
    tags: ['奶茶', '果茶', '咖啡'],
    deliveryTime: '20', deliveryFee: '0.00'
  }
])

function onSearch() {
  uni.showToast({ title: '搜索功能开发中', icon: 'none' })
}

function onBanner(banner) {
  if (banner.shopId > 0) {
    uni.navigateTo({ url: `/pages/shop/shop?id=${banner.shopId}` })
  }
}

function onCategory(cat) {
  uni.switchTab({ url: '/pages/menu/menu' })
  const app = getApp()
  if (app && app.globalData) {
    app.globalData.selectedCategory = cat.id
  }
}

function onShop(shop) {
  uni.navigateTo({ url: `/pages/shop/shop?id=${shop.id}` })
}

function onActivity() {
  uni.showToast({ title: '活动详情开发中', icon: 'none' })
}

function onMoreShop() {
  uni.switchTab({ url: '/pages/menu/menu' })
}

async function loadData() {
  loading.value = true
  try {
    // 模拟数据加载（后续接入真实 API）
    await new Promise(resolve => setTimeout(resolve, 300))
  } catch (e) {
    console.error('加载失败:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => { loadData() })
onShow(() => { loadData() })

// #ifdef MP-WEIXIN
onPullDownRefresh(async () => {
  await loadData()
  uni.stopPullDownRefresh()
})
// #endif
</script>

<style lang="scss" scoped>
.page-index { padding-bottom: 20rpx; }

/* 搜索栏 */
.search-bar {
  padding: 20rpx 30rpx;
  background: linear-gradient(180deg, #FF6D00 0%, #FF8F33 100%);
}
.search-input {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.9);
  border-radius: 40rpx;
  padding: 16rpx 30rpx;
}
.search-icon {
  width: 40rpx; height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  margin-right: 16rpx;
}
.search-placeholder { color: #999; font-size: 26rpx; }

/* Banner */
.banner-swiper {
  width: 690rpx; height: 280rpx;
  margin: 20rpx auto;
  border-radius: var(--radius-md);
  overflow: hidden;
}
.banner-item {
  width: 690rpx; height: 280rpx;
  display: flex;
  align-items: flex-end;
  padding: 30rpx;
  box-sizing: border-box;
}
.banner-text {
  color: #FFF;
  font-size: 36rpx;
  font-weight: bold;
  text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.4);
}

/* 分类入口 */
.category-grid {
  display: flex;
  flex-wrap: wrap;
  background: #FFF;
  margin: 0 30rpx;
  border-radius: var(--radius-md);
  padding: 20rpx 10rpx;
}
.category-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}
.category-icon {
  width: 100rpx; height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
  border-radius: var(--radius-md);
}
.category-emoji { font-size: 56rpx; }
.category-name { font-size: 24rpx; color: var(--color-text); }

/* 活动横幅 */
.section { margin: 24rpx 30rpx; }
.activity-banner {
  width: 690rpx; height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
}
.activity-text { font-size: 28rpx; color: #FFF; font-weight: bold; }

/* 推荐商家 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.section-title { font-size: 32rpx; font-weight: bold; }
.section-more { font-size: 26rpx; color: var(--color-text-lighter); }

.shop-card {
  display: flex;
  margin-bottom: 20rpx;
  padding: 20rpx;
}
.shop-cover {
  width: 160rpx; height: 160rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  margin-right: 20rpx;
}
.shop-emoji { font-size: 64rpx; }
.shop-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.shop-name { font-size: 30rpx; font-weight: bold; margin-bottom: 8rpx; }
.shop-meta { display: flex; gap: 20rpx; margin-bottom: 8rpx; font-size: 22rpx; color: var(--color-text-light); }
.shop-tags { display: flex; gap: 10rpx; margin-bottom: 8rpx; }
.shop-tag {
  font-size: 20rpx; color: var(--color-primary);
  background: #FFF3E0; padding: 4rpx 12rpx; border-radius: 4rpx;
}
.shop-bottom { display: flex; gap: 20rpx; font-size: 22rpx; color: var(--color-text-lighter); }

/* 空状态 */
.empty-state { text-align: center; padding: 120rpx 0; }
.empty-icon {
  width: 200rpx; height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30rpx;
  font-size: 80rpx;
}
.loading-state { text-align: center; padding: 120rpx 0; }
.loading-text { font-size: 28rpx; color: var(--color-text-lighter); }
.empty-text { font-size: 28rpx; color: var(--color-text-light); display: block; }
.empty-hint { font-size: 24rpx; color: var(--color-text-lighter); display: block; margin-top: 12rpx; }
</style>
