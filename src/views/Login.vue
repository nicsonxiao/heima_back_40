<template>
  <div class="login">
    <div class="container">
      <img src="../assets/avatar2.gif" alt class="avatar" />
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="icon-key" type='password' @keyup.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {userLogin} from '@/api/users.js'
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入6~16位密码', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入6~16位的密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          let res = await userLogin(this.loginForm)
          if(res.data.message==='用户不存在'){
            this.$message.error(res.data.message)
          }else if(res.data.message==='登录成功'){
            //存储token值
            localStorage.setItem('heima_40_back_token',res.data.data.token)
            // 跳转到登录页面
            this.$router.push({path:'/index'})
          }
        }else{
          this.$message.error('请输入有效的用户名和密码');
          return false
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    margin: 200px auto;
    padding: 0 40px 15px 40px;
    background-color: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    /deep/.el-form-item__content {
      margin-left: 0px !important;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>