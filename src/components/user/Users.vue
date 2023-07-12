<template>
    <div>
        <!-- 麵包屑導航區 -->
        <el-breadcrumb separator-icon="ArrowRightBold">
            <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
            <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
            <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片視圖區 -->
        <el-card>
            <!-- 搜尋與添加 -->
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input placeholder="請輸入內容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <template #append>
                            <el-button icon="Search" @click="getUserList" />
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用戶</el-button>
                </el-col>
            </el-row>
            <!-- 用戶列表區 -->
            <el-table :data="userlist" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="郵箱" prop="email"></el-table-column>
                <el-table-column label="電話" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="狀態">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160px">
                    <template v-slot:="scope">
                        <!-- 修改按鈕 -->
                        <el-button type="primary" icon="Edit" size="small" @click="showEditDialog(scope.row.id)"/>
                        <!-- 刪除按鈕 -->
                        <el-button type="danger" icon="Delete" size="small" @click="removeUserById(scope.row.id)"/>
                        <!-- 分配角色 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="Setting" size="small" />
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分頁區域 -->
            <el-pagination
                v-model:current-page="queryInfo.pagenum"
                v-model:page-size="queryInfo.pagesize"
                :page-sizes="[1, 2, 5, 10]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </el-card>
        <!-- 添加用戶的對話框 -->
        <el-dialog
            v-model="addDialogVisible"
            title="添加用戶"
            width="50%"
            @close="addDialogClosed">
            <!-- 內容主體 -->
            <el-form
              ref="addFormRef"
              :model="addForm"
              :rules="addFormRules"
              label-width="70px"
              status-icon>
              <el-form-item label="用戶名" prop="username">
                <el-input v-model="addForm.username" />
              </el-form-item>
              <el-form-item label="密碼" prop="password" type="password">
                <el-input v-model="addForm.password" />
              </el-form-item>
              <el-form-item label="郵箱" prop="email">
                <el-input v-model="addForm.email" />
              </el-form-item>
              <el-form-item label="手機" prop="mobile">
                <el-input v-model="addForm.mobile" />
              </el-form-item>
            </el-form>
            <!-- 底部區域 -->
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addUser">
                確定
                </el-button>
            </span>
            </template>
        </el-dialog>
        <!-- 修改用戶的對話框 -->
        <el-dialog
            v-model="editDialogVisible"
            title="修改用戶"
            width="50%"
            @close="editDialogClosed">
            <el-form
              ref="editFormRef"
              :model="editForm"
              :rules="editFormRules"
              label-width="70px"
              status-icon>
              <el-form-item label="用戶名">
                <el-input v-model="editForm.username" disabled />
              </el-form-item>
              <el-form-item label="郵箱" prop="email">
                <el-input v-model="editForm.email" />
              </el-form-item>
              <el-form-item label="手機" prop="mobile">
                <el-input v-model="editForm.mobile" />
              </el-form-item>
            </el-form>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editUserInfo">
                確定
                </el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    // 驗證郵箱的規則
    const checkEmail = (ruke, value, cb) => {
      // 驗證郵箱的正則表達式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的郵箱
        return cb()
      }
      cb(new Error('請輸入合法的郵箱'))
    }
    // 驗證手機的規則
    const checkMobile = (ruke, value, cb) => {
      // 驗證手機的規則
      const regMobile = /^09\d{8}$/
      if (regMobile.test(value)) {
        // 合法的手機
        return cb()
      }
      cb(new Error('請輸入合法的手機'))
    }
    return {
      // 獲取用戶列表的參數對象
      queryInfo: {
        query: '',
        // 當前頁數
        pagenum: 1,
        // 當前顯示多少條數據
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制添加用戶對話框的顯示與隱藏
      addDialogVisible: false,
      // 添加用戶的表單數據
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表單的驗證規則對象
      addFormRules: {
        username: [
          { required: true, message: '請輸入用戶名', trigger: 'blur' },
          { min: 3, max: 10, message: '用戶名長度在3到10字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '請輸入用密碼', trigger: 'blur' },
          { min: 6, max: 15, message: '密碼長度在6到15字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '請輸入用郵箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '請輸入用手機', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用戶對話框的顯示與隱藏
      editDialogVisible: false,
      // 查詢到的用戶訊息對象
      editForm: {},
      // 修改表單的驗證規則對象
      editFormRules: {
        email: [
          { required: true, message: '請輸入用郵箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '請輸入用手機', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('獲取用戶列表失敗')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 監聽pagesize改變的事件
    handleSizeChange(newsize) {
    //   console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 監聽頁碼值改變的事件
    handleCurrentChange(newpage) {
      console.log(newpage)
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    // 監聽switch開關狀態的改變
    async userStateChange(userinfo) {
    //   console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用戶狀態失敗')
      }
      this.$message.success('更新用戶狀態成功')
    },
    // 監聽添加用戶對話框的關閉事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 點擊按鈕添加新用戶
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以發起添加用戶的網絡請求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('新增用戶失敗')
        }
        this.$message.success('新增用戶成功')
        // 隱藏添加的對話框
        this.addDialogVisible = false
        // 重新獲取用戶列表
        this.getUserList()
      })
    },
    // 展示編輯用戶的對話框
    async showEditDialog(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查詢用戶訊息失敗')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 監聽修改用戶對話框的關閉事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用戶信息並提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 可以發起修改用戶的網絡請求
        const { data: res } = await this.$http.put('users/' +
        this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改用戶失敗')
        }
        this.$message.success('修改用戶成功')
        // 隱藏添加的對話框
        this.editDialogVisible = false
        // 重新獲取用戶列表
        this.getUserList()
      })
    },
    // 根據ID刪除對應的用戶訊息
    async removeUserById(id) {
      // console.log(id)
      // 彈框詢問客戶是否刪除數據
      const confirmResault = await this.$confirm(
        '此操作將永久刪除用戶,是否繼續?',
        '提示',
        {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用戶確認刪除, 則返回值為字符串 confirm
      // 如果用戶取消刪除, 則返回值為字符串 cancel
      // console.log(confirmResault)
      if (confirmResault !== 'confirm') {
        return this.$message.info('已取消刪除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('刪除用戶失敗')
      }
      this.$message.success('刪除用戶成功')
      // 重新獲取用戶列表
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped></style>
