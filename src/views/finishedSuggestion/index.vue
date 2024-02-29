<template>
  <div :class='styles.background' v-loading='loading'>
    <div :class='styles.contain'>
      <Card title='已提过的建议' :boldTitle='true' :isFadingOut='isFadingOut'>
        <el-icon :size='30' class='back' @click='back'><Back /></el-icon>
      </Card>
      <Card v-if="filterTableData" class='suggestionContain' :is-fading-out="isFadingOut">
        <div>
          <el-table :data="filterTableData" style="width: 100%; height: 480px;">
            <el-table-column prop="content" label="内容" width="400" />
            <el-table-column prop="create_time" label="提交时间" width="400" />
            <el-table-column prop="anonymity" label="是否匿名" />
            <el-table-column align="right">
              <template #header>
                <el-input v-model="search" size="large" placeholder="搜索内容" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Card } from "@/components/index";
import styles from "./index.module.scss";
import { ref, onBeforeMount, computed } from "vue";
import routes from '@/router';
import finishedSuggestion from '@/apis/Server/finishedSuggestion';
import { useMainStore } from '@/stores';
import { ElNotification } from 'element-plus';
import {isFadingOut, jumpPage} from "@/tool";

isFadingOut.value = false;
const loading = ref<boolean>(false);
const loginStore = useMainStore().useLoginStore();
const infos = ref<any>();
const search = ref("");
const filterTableData = computed(() =>
  infos.value.filter(
    (data) =>
      !search.value ||
      data.content.toLowerCase().includes(search.value.toLowerCase()) ||
      data.create_time.toLowerCase().includes(search.value.toLowerCase()) ||
      data.anonymity.toLowerCase().includes(search.value.toLowerCase())
  )
)


onBeforeMount(()=>{
  loading.value = true;
  finishedSuggestion.getInfo(loginStore.token).then((res)=>{
    if(res.data.code === 200){
      infos.value = res.data.data;
      for(let i in infos.value){
        // console.log(i);
        infos.value[i].create_time = infos.value[i].create_time.substring(0,4)+"年"+infos.value[i].create_time.substring(5,7)+"月"+infos.value[i].create_time.substring(8,10)+"日"+infos.value[i].create_time.substring(11,19);
        if(infos.value[i].anonymity){
          infos.value[i].anonymity = "是";
        }else{
          infos.value[i].anonymity = "否";
        }
      }
    }else{
      ElNotification({
        title: 'Warning',
        message: res.data.msg,
        type: 'warning',
      })
    }
  }).catch((e:Error)=>{
    ElNotification({
      title: 'Error',
      message: e,
      type: 'error',
    })
  }).finally(()=>{
    loading.value = false;
  })
})

const back = () => {
  jumpPage('/home')
}
</script>

<style scoped>
.back{
  position: absolute;
  right: 20px;
  top: 17px;
}
.suggestionContain{
  margin-top: 10vh;
  height: 500px;
  background-color: transparent;
}
</style>