<template>
<div :class="styles.background" v-loading='loading'>
  <div :class="styles.contain">
    <card title='老师信息列表' :boldTitle = "true" :isFadingOut=isFadingOut>
      <el-icon :size="30" class='back' @click="back"><Back /></el-icon>
    </card>
    <div style='margin-top: 10px;float: right' :class='Search'>
      <el-input v-model="name" style="width: 240px;" placeholder="输入教师名字进行搜索" />
      <el-button @click='search'>搜索</el-button>
    </div>
    <div style="display: flex;justify-content: space-evenly;margin-top: 45px;">
    <div class='flex'>
      <div v-for='data in datas' :class='[styles["info-card"],styles["detail-info"]]'>
        <card :isFadingOut='isFadingOut' :class="styles['teacher-info']">
          <div>教师编号<span>{{data.teacher_id}}</span></div>
          <div>教师姓名<span>{{data.teacherName}}</span></div>
          <div>部门<span>{{data.section}}</span></div>
          <div>办公室<span>{{data.office}}</span></div>
          <div>电话号码<span>{{data.phone}}</span></div>
          <div>电子邮件<span>{{data.email}}</span></div>
          <div>已有的学生数量<span>{{data.students_num}}</span></div>
          <div>设置的截止时间<span>{{data.teacher_ddl}}</span></div>
          <DarkButton color="green" size="small" inner="私聊" @click="() => goChat(data.teacher_id, data.teacherName)" :class="styles['chat-button']"/>
    <!-- 分页组件 -->
        </card>
      </div>
      <card class='Pagin' :isFadingOut=isFadingOut>
        <div class='pagination'>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :disabled="false"
            layout="total, prev, pager, next, jumper"
            :total="total ? total*6 : 0"
            :size='6'
            @current-change="handleCurrentChange"
          />
        </div>
      </card>
    </div>
    </div>
  </div>
</div>
</template>

<script setup lang='ts'>
import styles from "./index.module.scss";
import {Card, DarkButton} from '@/components';
import {ref , onBeforeMount} from "vue";
import { ElNotification } from 'element-plus';
import { useMainStore} from '@/stores'
import useRequest from "@/apis/useRequest";
import { jumpPage, isFadingOut } from "@/tool";
import getTeacherInfo from '@/apis/Server/getTeacherInfo'
isFadingOut.value = false;

const loginStore = useMainStore().useLoginStore();
const temporaryStore = useMainStore().usetemporaryStore();
const token = loginStore.token;
const currentPage = ref<number>(1);
const pageSize = ref<number>(6);
const datas = ref();
const total = ref<number>();
const loading = ref<boolean>(false);
const name = ref<string>("");
const Search = ref<string>("in");

/** 挂载完组件，请求一次 */
onBeforeMount(()=>{
  handleCurrentChange(1);
});

const handleCurrentChange = async (val: number) => {
  currentPage.value = val;
  useRequest({
    params: {
      page_num:currentPage.value,
      page_size:pageSize.value
    },
    method: "GET",
    url: "/api/student/teacher",
    headers: { Authorization: loginStore.token },
    onSuccess(res) {
      if(res.data.code === 200){
        datas.value = res.data.data.data;
        total.value = res.data.data.total_page_num;
        for(let i in datas.value){
          datas.value[i].teacher_ddl = datas.value[i].teacher_ddl.substring(0,4)+"年"+datas.value[i].teacher_ddl.substring(5,7)+"月"+datas.value[i].teacher_ddl.substring(8,10)+"日"+datas.value[i].teacher_ddl.substring(11,19);
        }
        loading.value = false;
      }else{
        ElNotification({
          title: 'Warning',
          message: res.data.msg,
          type: 'warning',
        })
      }
    },
    onError(error) {
        console.log(error);
    },
  });
}

const goChat = (teacherId: number, teacherName: string) => {
  temporaryStore.setIsLaunchChat(true);
  temporaryStore.setLaunchedChatTeacherId(teacherId+1);
  temporaryStore.setLaunchedChatTeacherName(teacherName);
  jumpPage("/chat");
};

const search =async () =>{
  let search_params = ref({
    page_num:currentPage.value,
    page_size:pageSize.value,
    name: name.value,
  })
  await getTeacherInfo.getInfo(search_params.value,token).then((res)=>{
    if(res.data.code === 200){
      datas.value = res.data.data.data;
      total.value = res.data.data.total_page_num;
      for(let i in datas.value){
        datas.value[i].teacher_ddl = datas.value[i].teacher_ddl.substring(0,4)+"年"+datas.value[i].teacher_ddl.substring(5,7)+"月"+datas.value[i].teacher_ddl.substring(8,10)+"日"+datas.value[i].teacher_ddl.substring(11,19);
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

const back = () => {
  jumpPage('/home');
  Search.value='isFadingOut';
}

</script>

<style scoped>
.flex{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.Pagin{
  position: fixed;
  right: 35vw;
  bottom: 5vh;
}
.back{
  position: absolute;
  right: 20px;
  top: 17px;
}
.in{
  animation: in ease-out 1s 0.2s backwards;
}
.isFadingOut{
  animation: fadeOut ease 1s 0.2s backwards;
}
@keyframes in{
  0%{
    transform: translateY(8px); opacity:0;
  }
  100%{
    transform: translateY(0); opacity: 1;
  }
}
@keyframes fadeOut{
  0%{
    transform: translateY(0); opacity: 1;
  }
  100%{
    transform: translateY(8px); opacity:0;
  }
}
</style>