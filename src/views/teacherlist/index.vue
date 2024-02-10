<template>
<div :class="styles.background">
  <div :class="styles.contain">
    <card
      title='第一轮选择'
      :boldTitle = true
    ></card>
    <div class='flex'>
      <div v-for='(data,index) in datas' :class='[styles["info-card"],styles["detail-info"]]'>
        <card>
          <div>索引<span>{{index}}</span></div>
          <div>老师姓名<span>{{data.teacherName}}</span></div>
          <div>部门<span>{{data.section}}</span></div>
          <div>办公室<span>{{data.office}}</span></div>
          <div>电话号码<span>{{data.phone}}</span></div>
          <div>电子邮件<span>{{data.email}}</span></div>
          <div class='button'>
            <el-button type="info" @click='choice(data)'>选择</el-button>
          </div>
    <!-- 分页组件 -->
        </card>
      </div>
      <card class='pagin'>
        <div class='pagination'>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :small="small"
            :disabled="disabled"
            layout="total, prev, pager, next, jumper"
            :total="total*8"
            :size='8'
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </card>
    </div>
  </div>
</div>
</template>

<script setup lang='ts'>
import styles from "./index.module.scss";
import {Card} from '@/components'
import firstCho from '@/apis/firstCho'
import {ref , reactive , onMounted} from "vue";

/** 挂载完组件，请求一次 */
onMounted(async ()=>{
  const res = await firstCho.getInfo([currentPage.value,pageSize.value]);
  datas.value = res.data.data.data;
  total.value = res.data.data.total_page_num;
})

const currentPage = ref(1);
const pageSize = ref(8);
const datas = ref();
const total = ref();

const handleCurrentChange = async (val) => {
  currentPage.value = val;
  const res = await firstCho.getInfo([currentPage.value,pageSize.value]);
  datas.value = res.data.data.data;
  alert(currentPage.value)
}

const choice = (data:object) => {
  alert(data.teacherName);
}
</script>

<style scoped>
.flex{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

}
.pagin{
  position: fixed;
  right: 35vw;
  bottom: 5vh;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
  right: 50%;
}

.button {
  float: right;
  margin: 15px;
}
</style>