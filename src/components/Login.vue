<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 頭像 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登錄表單 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用戶名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="User"/>
                </el-form-item>
                <!-- 密碼 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="Lock" type="password"/>
                </el-form-item>
                <!-- 按鈕 -->
                <el-form-item class="btns">
                    <el-button @click="login" type="primary">登錄</el-button>
                    <el-button @click="resetLoginForm" type="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        // 登入表單的數據綁定對象
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        // 表單的驗證規則
        username: [
          { required: true, message: '請輸入用戶名稱', trigger: 'blur' },
          { min: 3, max: 10, message: '長度必須為3到10個字符', trigger: 'blur' }],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 6, max: 16, message: '長度必須為6到16個字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // 點擊按鈕重置登入表單
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登入失敗')
        this.$message.success('登入成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
// /deep/ .el-form-item__content {
//     flex: unset;
// }

.login_container{
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;

    }
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.btns {
    display: flex;
    justify-content: flex-end;
}

</style>
