<template>
  <div class="PostList">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <template>
      <el-table :data="postList" border style="width: 100%;margin:20px 0;">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="title" label="标题" width="400"></el-table-column>
        <el-table-column prop="type" label="类型" width="50">
          <template slot-scope="scope">{{scope.row.type===1?'文章':'视频'}}</template>
        </el-table-column>
        <el-table-column prop="create_date" label="日期" width="180">
          <template slot-scope="scope">{{scope.row.create_date | dataFormat}}</template>
        </el-table-column>
        <el-table-column prop="user.nickname" label="昵称" width="180"></el-table-column>
        <el-table-column prop label="操作" width="210">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分享" placement="top-start">
              <el-button type="success" icon="el-icon-share"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button type="danger" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { getPostList } from '@/api/article.js'
export default {
  data() {
    return {
      pageIndex: 1,
      pageSize: 2,
      postList: [],
      total: 0
    }
  },
  mounted() {
    this.init()
  },
  filters: {
    dataFormat(data, spe) {
      let date = new Date(data)
      spe = spe || '/'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      return year + spe + month + spe + day
    }
  },
  methods: {
    async init() {
      let res = await getPostList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      if (res.status === 200) {
        this.postList = res.data.data
        this.total = res.data.total
      }
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handleSizeChange(val) {
      //每页显示的条数
      this.pageSize=val
      this.init()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
    //选中的页码
      this.pageIndex=val
      this.init()
      // console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style>
</style>