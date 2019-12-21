<template>
  <div class="login">
    <div class="container">
      <img src="../assets/avatar2.gif" alt  class="avatar "/>
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="icon-key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
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
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '请输入3~16位的密码', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style lang='less' scoped>
.login{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #2f4050;
    .container{
        position: absolute;
        left: 0;
        right: 0;
        width:400px;
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
        /deep/.el-form-item__content{
            margin-left: 0px!important;
        }
        .login-btn{
            width: 100%;
        }
    }
}
</style>