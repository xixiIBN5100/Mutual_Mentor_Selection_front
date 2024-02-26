<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card
        :title="'学生审批'"
        :bold-title="true"
        :class="styles.title"
        :is-fading-out="isFadingOut"
      >
        <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"
          ><Back
        /></el-icon>
      </card>
      <div :class="styles.approvalContain">
        <card
          :title="'待审批学生'"
          :bold-title="true"
          :class="styles.waitApproval"
          :is-fading-out="isFadingOut"
        >
          <el-scrollbar height="50vh" :class="styles.waitStudentBox">
            <p v-for="item in waitApproval" :key="item" :class="styles.student">
              {{ item.name }}
              <div style="display: flex;width: 20vw;justify-content: space-between;"> <dark-button @click="information(item)" inner="查看" size="small" color="blue" ></dark-button>
                <dark-button @click="() => approval(item)" inner="同意" size="small" color="green" ></dark-button>
                <dark-button @click="() => reject(item)" inner="驳回" size="small" color="red" ></dark-button>
                
              </div>
            </p>
          </el-scrollbar>
        </card>
        <card
          :title="'已审批学生'"
          :bold-title="true"
          :class="styles.finishApproval"
          :is-fading-out="isFadingOut"
        >
          <el-scrollbar height="50vh" :class="styles.waitStudentBox">
            <p v-for="item in finishApproval" :key="item" :class="styles.student">
              {{ item.name }} <dark-button @click="Undo(item)" inner="撤销" size="small" color="red" ></dark-button>
            </p>
          </el-scrollbar>
        </card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from './index.module.scss'
import { Card, DarkButton } from '@/components/index'
import { jumpPage, isFadingOut, closeLoading,startLoading } from '@/tool'
import { onMounted, ref } from 'vue'
import { getStudentListAPI } from "@/apis/index"
import { useMainStore } from '@/stores'
import useRequest from '@/apis/useRequest'
import { ElNotification } from 'element-plus'

isFadingOut.value = false

const waitApproval = ref();
const finishApproval = ref();
const loginStore = useMainStore().useLoginStore()
  useRequest({
    params: {check:1},
    method: "GET",
    url: "/api/teacher/student",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(data) {
      console.log(data);
      waitApproval.value = data.data.data;
      console.log(waitApproval.value);
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  });

  useRequest({
    params: {check:2},
    method: "GET",
    url: "/api/teacher/student",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(data) {
      console.log(data);
      finishApproval.value = data.data.data
      finishApproval.value.forEach((item: { target_agree: number; name: string }) => {
        if(item.target_agree === 2){
          item.name += "(通过)"
        }else{
          item.name += "(驳回)"
        }
      });
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  });
  const updataList = () => {
    setTimeout(() => {
  useRequest({
    params: {check: 1},
    method: "GET",
    url: "/api/teacher/student",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(data) {
      console.log(data);
      waitApproval.value = data.data.data;
      console.log(waitApproval.value);
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  });

  useRequest({
    params: {check: 2},
    method: "GET",
    url: "/api/teacher/student",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(data) {
      console.log(data);
      finishApproval.value = data.data.data
      finishApproval.value.forEach((item: { target_agree: number; name: string }) => {
        if(item.target_agree === 2){
          item.name += "(通过)"
        }else{
          item.name += "(驳回)"
        }
      });
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
 });
}, 500);

  }

const Undo = (item:any) => {
  console.log(item)
  useRequest({
    data:{
      students_id: [item.student_id]
    },
    method: "PUT",
    url: "/api/teacher/student/post",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(data) {
      console.log(data);
      ElNotification("撤销成功")
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  })
  updataList();
}

const approval  = (item: { student_id: any }) => {
   useRequest({
    data:{
      students_id: [item.student_id],
      check:1
    },
    method: "POST",
    url: "/api/teacher/student/post",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(data) {
      console.log(data);
      ElNotification("审批成功")
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  })
  updataList();
}

const reject  = (item: { student_id: any }) => {
   useRequest({
    data:{
      students_id: [item.student_id],
      check:2
    },
    onBefore: () => startLoading(),
    method: "POST",
    url: "/api/teacher/student/post",
    headers: { Authorization: loginStore.token },
    manual: false,
    onSuccess(data) {
      console.log(data);
      ElNotification("驳回成功")
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  })
  updataList();
}
const information = (item: { student_id: string }) => {
  localStorage.removeItem('student_id')
  localStorage.setItem('student_id', item.student_id)
 jumpPage('/studentInfo');
}
</script>
