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
            :on-success="handlerSuccess"
            :on-remove="handleRemove"
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
          <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card">
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
    publishPost() {
      console.log(this.postForm)
      if (this.postForm.type === 1) {
        this.postForm.content = this.$refs.postContent.editor.root.innerHTML
      }
    },
    setToken() {
      let token = localStorage.getItem('heima_40_back_token')
      return {
        Authorization: token
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleCheckAllChange(val) {
      console.log(val)
      // this.checkedCities = val ? cityOptions : [];
      // this.isIndeterminate = false;
    },
    handleCheckedCateChange(value) {
      console.log(value)
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.cities.length;
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    handlerSuccess(response){
      if(response.message==='文件上传成功'){
        this.postForm.content=response.data.url
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

<style>
</style>