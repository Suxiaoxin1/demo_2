Component({
  data: {
    selected: 0,
    cartBadge: 0,
    color: '#999999',
    selectedColor: '#FF6D00',
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: 'icon_home' },
      { pagePath: '/pages/menu/menu', text: '分类', icon: 'icon_menu' },
      { pagePath: '/pages/cart/cart', text: '购物车', icon: 'icon_cart' },
      { pagePath: '/pages/mine/mine', text: '我的', icon: 'icon_mine' }
    ]
  },

  lifetimes: {
    attached() {
      const app = getApp()
      if (!app || !app.globalData) return
      const count = app.globalData.cartCount || 0
      this.setData({ selected: 0, cartBadge: count })
      // 监听购物车更新事件，实时刷新角标
      uni.$on('cartUpdate', (count) => {
        this.setData({ cartBadge: count })
      })
    },
    detached() {
      uni.$off('cartUpdate')
    }
  },

  pageLifetimes: {
    show() {
      const app = getApp()
      if (!app || !app.globalData) return
      const count = app.globalData.cartCount || 0
      // 根据当前页面路径更新选中状态
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (currentPage) {
        const path = '/' + currentPage.route
        const idx = this.data.list.findIndex(item => item.pagePath === path)
        if (idx !== -1) this.setData({ selected: idx, cartBadge: count })
        else this.setData({ cartBadge: count })
      } else {
        this.setData({ cartBadge: count })
      }
    }
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index
      const item = this.data.list[index]
      const url = item.pagePath

      // #ifdef MP-WEIXIN
      wx.switchTab({ url })
      // #endif
    }
  }
})
