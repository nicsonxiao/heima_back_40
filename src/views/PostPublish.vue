<template>
  <div class="publishPost">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card" style="margin-top:20px">
      <el-form label-width="100px" v-model="postForm">
        <!-- 标题 -->
        <el-form-item label="标题：">
          <el-input v-model="postForm.title"></el-input>
        </el-form-item>
        <!-- 单选按钮 -->
        <el-form-item label="类型：">
          <el-radio-group v-model="postForm.type">
            <el-radio :label="1">文章</el-radio>
            <el-radio :label="2">视频</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 富文本框插件 -->
        <el-form-item>
          <VueEditor v-if="postForm.type===1" :config="config" ref="postContent" />
          <!-- 视频上传 -->
          <el-upload
            v-if="postForm.type===2"
            class="upload-demo"
            action="http://127.0.0.1:3000/upload"
            :headers="setToken()"
            :before-upload="beforeUpload"
            :on-success="handlerSuccess"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传视频</div>
          </el-upload>
        </el-form-item>
        <!-- 栏目 -->
        <el-form-item label="栏目：">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCate" @change="handleCheckedCateChange">
            <el-checkbox v-for="item in cateList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面：">
          <el-upload
            action="http://127.0.0.1:3000/upload"
            list-type="picture-card"
            :headers="setToken()"
            :before-upload="beforeUploadImg"
            :on-success="setCover"
            :on-remove="removeCover"
            :limit="3"
            :drag="true"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <!-- 发布按钮 -->
        <el-form-item>
          <el-button type="primary" round @click="publishPost">发布文章</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import VueEditor from 'vue-word-editor'
import 'quill/dist/quill.snow.css'
import { getCateList } from '@/api/cate.js'
import {postArticle} from '@/api/article.js'

export default {
  data() {
    return {
      postForm: {
        title: '',
        content: '',
        categories: [],
        cover: [],
        type: 1
      },
      checkAll: false,
      checkedCate: [],
      isIndeterminate: true,
      cateList: [],
      fileList: [],
      config: {
        // 上传图片的配置
        uploadImage: {
          url: 'http://localhost:3000/upload',
          name: 'file',
          headers: this.setToken(),
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess(res, insert) {
            //将图片插入富文本框
            insert('http://localhost:3000' + res.data.data.url)
          }
        },

        // 上传视频的配置
        uploadVideo: {
          url: 'http://localhost:3000/upload',
          name: 'file',
          uploadSuccess(res, insert) {
            insert('http://localhost:3000' + res.data.data.url)
          }
        }
      }
    }
  },
  components: {
    VueEditor
  },
  methods: {
    //绑定发布按钮
   async publishPost() {
      //获取富文本框的数据，并赋值给postForm的content属性
      //当type类型为1的才需要获取富文本框的内容
      if (this.postForm.type === 1) {
        this.postForm.content = this.$refs.postContent.editor.root.innerHTML
      }
      //获取栏目数据,checkedCate是数字数组
      this.checkedCate.forEach(value=>{
        this.postForm.categories.push({
          id:value
        })
      })
      console.log(this.postForm);
      let res =await postArticle(this.postForm)
      console.log(res)
      if(res.data.message==="文章发布成功"){
        this.$message.success(res.data.message)
        this.$router.push({name:'PostList'})
      }
    },
    //设置请求头
    setToken() {
      //因为后台管理基本需要有权限才可以进行访问，所以需要验证Authorization，并封装方便以后使用
      let token = localStorage.getItem('heima_40_back_token')
      return {
        Authorization: token
      }
    },
    //视频上传之前的钩子，如果在这个钩子中return false则可以终止本次上传操作
    beforeUpload(file) {
      //根据mime类型判断上传的内容是否符合标准，如果不是指定的类型，则给予提示
      if (file.type.indexOf('video/') !== 0) {
        this.$message.warning('请选择视频文件')
        return false
      }
    },
    //封面上传验证
    beforeUploadImg(file) {
      console.log(file)
      //根据mime类型判断上传的内容是否符合标准，如果不是指定的类型，则给予提示
      if (file.type.indexOf('image/') !== 0) {
        this.$message.warning('请选择图片文件')
        return false
      }
    },
    //封面上传成功后，存储图片id到postForm.cover中
    setCover(response){
      // console.log(response)
      if(response.message==='文件上传成功'){
        //追加图片id，生成后台接口所需要的数据格式
        this.postForm.cover.push({
          id:response.data.id
        })
      }
    },
    //移除封面
    removeCover(file){
      let id=file.response.data.id
      //遍历cover数组,删除对应id的图片
      this.postForm.cover.forEach((value,index)=>{
        if(value.id===id){
          this.postForm.cover.splice(index,1)
        }
      })
    },
    //多选框组、全选
    handleCheckAllChange(val) {
      // console.log(val)
      // val值为true,说明为全选状态，为false为全不选状态
      this.checkedCate = val
        ? this.cateList.map(value => {
            return value.id
          })
        : []
      //如果全选按钮为全选或者全不选的状态，那就把不确定状态切换为确定状态(false)
      this.isIndeterminate = false
    },
    //多选框组中选中的单选项
    handleCheckedCateChange(value) {
      // console.log(value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cateList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cateList.length
    },
    //如果type类型为2视频，那就把视频上传成功后的路径赋值给content
    handlerSuccess(response) {
      if (response.message === '文件上传成功') {
        this.postForm.content = response.data.url
        this.$message.success('视频上传成功')
      }
    }
  },
  async mounted() {
    let res = await getCateList()
    // console.log(res)
    this.cateList = res.data.data.splice(2)
  }
}
</script>

<style lang="less" scoped>
/deep/.el-upload-dragger{
  width: 100%;
  height: 100%;
}
</style>