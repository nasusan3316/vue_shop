<template>
  <el-container class="home-container">
    <!-- 頭部區域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>後台管理系統</span>
      </div>
      <el-button type="info" @click="logout">登出</el-button>
    </el-header>
    <!-- 頁面主體 -->
    <el-container>
      <!-- 側邊欄 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu active-text-color="#409EFF" background-color="#333744" class="el-menu-vertical-demo" default-active="2"
          text-color="#fff" unique-opened :collapse="isCollapse" :collapse-transition="false" router >
          <!-- 一級菜單 -->
          <el-sub-menu :index="item.id + ''" v-for="item in menulist" :key="item.id">
              <!-- 一級菜單模板區 -->
            <template #title>
              <!-- 圖標 -->
              <el-icon>
                <component :is="iconsObj[item.id]" />
              </el-icon>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二級菜單 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <!-- 二級菜單模板區 -->
              <template #title>
              <!-- 圖標 -->
              <el-icon>
                <Menu />
              </el-icon>
              <!-- 文本 -->
              <span>{{ subItem.authName }}</span>
            </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 側邊主體 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左側菜單數據
      menulist: [],
      iconsObj: {
        125: 'UserFilled',
        103: 'Setting',
        101: 'GoodsFilled',
        102: 'Edit',
        145: 'DataLine'
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 獲取所有菜單
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.mata.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 點擊按鈕切換菜單摺疊
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }

}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;

  >div {
    display: flex;
    align-items: center;

    >span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #EAEDF1;
}

.home-container {
  height: 100%;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
