<template>
  <div :class='styles.background' v-loading='loading'>
    <div :class='styles.contain'>
      <Card :class="styles['title-bar']" title='重置用户密码' :boldTitle='true' :isFadingOut='isFadingOut'>
        <el-icon @click='back' class='back' size='30'><Back /></el-icon>
      </Card>
      <div style="display: flex;justify-content: center">
      <Card :class='styles["info-card"]' :isFadingOut='isFadingOut' style="background: transparent;padding: 30px;height: 65vh;margin-top: 8vh">
        <el-table :data="filterTableData" style="border-radius: 10px">
          <el-table-column label="用户名" prop="username" />
          <el-table-column label="用户类型" prop="type" />
          <el-table-column align="right">
            <template #header>
              <el-input v-model="user_name" size="small" placeholder="输入用户名快速查找" style='display: inline'/>
              <el-button size='small' @click='search'>查找</el-button>
            </template>
            <template #default="scope">
              <el-button size="small" @click="reset(scope.$index, scope.row)">重置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="display:flex;justify-content: center;margin-top: 20px">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :disabled="false"
            layout="total, prev, pager, next, jumper"
            :total="total ? total : 0"
            @current-change="handleCurrentChange"
          />
        </div>
      </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import styles from "./index.module.scss";
import { Card } from "@/components/index";
import { ref, onBeforeMount } from "vue";
import routes from '@/router';
import resetUserPass from '@/apis/Server/resetUserPass';
import { useMainStore } from '@/stores'
import useLoginStore from '@/stores/service/loginStore'
import { ElNotification } from 'element-plus';

const pageSize = ref<number>(10);
const loginStore = useMainStore().useLoginStore();
const token = loginStore.token;
const user_name = ref<string>("");
const isFadingOut = ref<boolean>(false);
const loading = ref<boolean>(false);
const currentPage = ref<number>(1);
const total = ref(0);

const params = ref({
  page_num:String(currentPage.value),
  page_size:String(pageSize.value),
  user_name:String(user_name.value),
})
const filterTableData = ref<any>();

const getInfo = async (params) =>{
  params.value.user_name = user_name.value;
  loading.value = true;
  await resetUserPass.getUserInfo(params.value,token).then((res)=>{
    // console.log(res.data.code);
    if(res.data.code === 200){
      filterTableData.value = res.data.data.data;
      total.value = res.data.data.user_num;
      // console.log(info.value);
      for(let i in filterTableData.value){
        if(filterTableData.value[i].type === 3){
          filterTableData.value[i].type = "管理员";
        }else if(filterTableData.value[i].type === 2){
          filterTableData.value[i].type = "教师";
        }else{
          filterTableData.value[i].type = "学生";
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
}
onBeforeMount(async ()=>{
  getInfo(params);
})

const search = () => {
  getInfo(params);
}

const handleCurrentChange = (pa) => {
  currentPage.value = pa;
  // console.log(currentPage.value);
  params.value.page_num = String(pa);
  getInfo(params);
}

const reset =async (index:number,row) => {
  // console.log(index,row);
  // console.log(filterTableData.value[index].id)
  await resetUserPass.reset({
    user_id: filterTableData.value[index].id},token).then((res)=>{
    // console.log(res.data.code);
    if(res.data.code===200){
      ElNotification({
        title: 'Success',
        message: "重置成功",
        type: 'success',
      })
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
  })
}
const back = () => {
  isFadingOut.value = true;
  setTimeout(()=>{
    routes.push("/home");
  },1000);
}
</script>

<style scoped>
.back{
  position: absolute;
  top: 17px;
  right: 20px;
}

</style>