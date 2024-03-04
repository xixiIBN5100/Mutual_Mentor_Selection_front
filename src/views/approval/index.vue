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
          <div style="display: flex;justify-content: space-evenly;width: 50%;margin-left: 17vw;margin-top: -40px;position: relative;top: 10px">
            <span>
              <dark-button inner="批量同意" size="small" color="green" @click="batchApprove"></dark-button>
            </span>
            <span>
              <dark-button inner="批量驳回" size="small" color="red" @click="ComfirmbatchReject"></dark-button>
            </span>
          </div>
          <el-scrollbar height="50vh" :class="styles.waitStudentBox">
            <p v-for="item in waitApproval" :key="item.student_id" :class="styles.student">
              <el-checkbox  size="large" @change="toggleSelectedStudent(item.student_id)"></el-checkbox>{{ item.name }}
              <div style="display: flex;width: 20vw;justify-content: space-between;">
                <dark-button @click="() => viewStudentInfo(item)" inner="查看" size="small" color="blue"></dark-button>
                <dark-button @click="() => approve(item)" inner="同意" size="small" color="green"></dark-button>
                <dark-button @click="() => reject(item)" inner="驳回" size="small" color="red"></dark-button>
              </div>
            </p>
          </el-scrollbar>
        </card>
        <card
            title="已审批学生"
            :bold-title="true"
            :class="styles.finishApproval"
            :is-fading-out="isFadingOut"
        >
          <el-scrollbar height="50vh" :class="styles.waitStudentBox">
            <p v-for="item in finishApproval" :key="item.student_id" :class="styles.student">
              {{ item.name }}<dark-button @click="Undo(item)" inner="撤销" size="small" color="red" ></dark-button>
            </p>
          </el-scrollbar>
        </card>
        <el-dialog v-model="showReason" title="请给出驳回理由" width="500">
          <el-select v-model="content" class="m-2" placeholder="Select" style="width: 440px">
            <el-option v-for="item in reason" :key="item.id" :label="item.reason_content" :value="item.reason_content"></el-option>
          </el-select>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showReason = false">取消</el-button>
              <el-button type="primary" @click="confirmReject">确认</el-button>
            </div>
          </template>
        </el-dialog>
        <el-dialog v-model="showReasonBath" title="请给出批量驳回理由" width="500">
          <el-select v-model="content" class="m-2" placeholder="Select" style="width: 440px">
            <el-option v-for="item in reason" :key="item.id" :label="item.reason_content" :value="item.reason_content"></el-option>
          </el-select>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showReasonBath = false">取消</el-button>
              <el-button type="primary" @click="batchReject">确认</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
      <el-drawer v-model="showDrawer" title="学生信息" v-if="form">
        <el-scrollbar height="80vh">
        <img :src="form.avartar" style="width: 100px; height: auto;margin-left: 4vw;margin-top: 5vh;">
        <div style="display: flex;">
          <div :class="styles.form">
            <span :class="styles.info">姓名: {{ form.name }}</span>
            <span :class="styles.info">班级: {{ form.class }}</span>
            <span :class="styles.info">学号: {{ form.student_id }}</span>
            <span :class="styles.info">地址: {{ form.address }}</span>
            <span :class="styles.info">邮箱: {{ form.email }}</span>
            <span :class="styles.info">电话: {{ form.phone }}</span>
            <span :class="styles.info">政治面貌: {{ form.political_status}}</span>
            <span :class="styles.info">职业方向: {{ form.plan }}</span>
            <span :class="styles.info">个人荣誉: {{ form.honor }}</span>
            <span :class="styles.info">项目实践经历: {{ form.experience }}</span>
            <span :class="styles.info">个人专业研究兴趣方向: {{ form.interest }}</span>
          </div>
        </div>
        </el-scrollbar>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from './index.module.scss'
import { Card, DarkButton } from '@/components/index'
import { jumpPage, isFadingOut, closeLoading,startLoading } from '@/tool'
import { onMounted, ref, } from 'vue'
import { getStudentListAPI } from "@/apis/index"
import { useMainStore } from '@/stores'
import useRequest from '@/apis/useRequest'
import { ElNotification } from 'element-plus'

isFadingOut.value = false
const  showDrawer = ref(false)
const reason = ref<any[]>();
const waitApproval = ref();
const finishApproval = ref();
const form = ref<StudentForm>(); // 初始化为undefined
const showReason = ref(false);
const selectedStudents = ref([]); // 保存选中的学生ID
const rejectStudent_id = ref();
const rejectReasonid = ref();
const content = ref('')
const showReasonBath = ref(false)
const loginStore = useMainStore().useLoginStore()
const ComfirmbatchReject = () => {
  showReasonBath.value = true;
}
// 获取待审批学生列表
useRequest({
  params: {check:1},
  method: "GET",
  url: "/api/teacher/student",
  headers: { Authorization: loginStore.token },
  manual: false,
  onBefore: () => startLoading(),
  onSuccess(data) {
    waitApproval.value = data.data.data;
  },
  onError(error) {
    console.log(error);
  },
  onFinally: () => closeLoading()
});

// 获取驳回理由列表
useRequest({
  params: {check:1},
  method: "GET",
  url: "/api/user/reason",
  headers: { Authorization: loginStore.token },
  manual: false,
  onSuccess(data) {
    reason.value = data.data.data;
  },
  onError(error) {
    console.log(error);
  },
});

// 获取已审批学生列表
useRequest({
  params: {check:2},
  method: "GET",
  url: "/api/teacher/student",
  headers: { Authorization: loginStore.token },
  manual: false,
  onBefore: () => startLoading(),
  onSuccess(data) {
    finishApproval.value = data.data.data.map((item: { target_agree: number; name: string }) => {
      return {
        ...item,
        name: item.target_agree === 2 ? `${item.name}(通过)` : `${item.name}(驳回)`
      };
    });
  },
  onError(error) {
    console.log(error);
  },
  onFinally: () => closeLoading()
});

// 更新列表数据
const updataList = () => {
  setTimeout(() => {
    // 获取待审批学生列表
    useRequest({
      params: {check: 1},
      method: "GET",
      url: "/api/teacher/student",
      headers: { Authorization: loginStore.token },
      manual: false,
      onBefore: () => startLoading(),
      onSuccess(data) {
        waitApproval.value = data.data.data;
      },
      onError(error) {
        console.log(error);
      },
      onFinally: () => closeLoading()
    });

    // 获取已审批学生列表
    useRequest({
      params: {check: 2},
      method: "GET",
      url: "/api/teacher/student",
      headers: { Authorization: loginStore.token },
      manual: false,
      onBefore: () => startLoading(),
      onSuccess(data) {
        finishApproval.value = data.data.data.map((item: { target_agree: number; name: string }) => {
          return {
            ...item,
            name: item.target_agree === 2 ? `${item.name}(通过)` : `${item.name}(驳回)`
          };
        });
      },
      onError(error) {
        console.log(error);
      },
      onFinally: () => closeLoading()
    });
  }, 500);
}

// 撤销审批
const Undo = (item: any) => {
  useRequest({
    data: { students_id: [item.student_id] },
    method: "PUT",
    url: "/api/teacher/student/post",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(data) {
      if(data.data.code === 200&&data.data.msg ===" OK") {
        ElNotification.success("撤销成功");
      }else{
        ElNotification({
          type:"error",
          title: '撤回失败',
          message: data.data.msg,
        })
      }
      updataList();
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  });
}

// 同意审批
const approve = (item: any) => {
  useRequest({
    data: {  students_id: [item.student_id] , check: 1 },
    method: "POST",
    url: "/api/teacher/student/post",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(data) {
      ElNotification("审批成功");
      updataList();
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => closeLoading()
  });
}

// 驳回审批
const reject = (item: any) => {
  showReason.value = true;
  rejectStudent_id.value = item.student_id;
}

// 批量操作：确认驳回
const confirmReject = () => {
  if (!content.value) {
    ElNotification.warning("请选择驳回理由");
    return;
  }
  if (content.value !== '') {
    const selectedItem = reason.value?.find((item) =>{
          if(item.reason_content === content.value) {
            return item.id;
          }
        })
    ;
    if (selectedItem) {
      rejectReasonid.value = selectedItem.id;
      console.log("选中的项的id:", rejectReasonid.value);
      // 进行你的逻辑操作，可以访问selectedItem来获取选中项的详细信息
    } else {
      console.log("未找到匹配项");
    }
  } else {
    ElNotification.warning("请选择理由");
    return;
  }
  useRequest({
    data: { students_id: [rejectStudent_id.value] , check: 2 ,reason_id: rejectReasonid.value},
    method: "POST",
    url: "/api/teacher/student/post",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(data) {
      ElNotification("批量驳回成功");
      updataList();
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => {
      closeLoading();
      showReason.value = false;
      selectedStudents.value = []; // 清空选中的学生列表
    }
  });
}

// 批量操作：选中或取消选中学生
const toggleSelectedStudent = (studentId: string) => {
  if (selectedStudents.value.includes(studentId)) {
    // 如果学生已选中，则取消选中
    selectedStudents.value = selectedStudents.value.filter(id => id !== studentId);
  } else {
    // 如果学生未选中，则选中
    selectedStudents.value.push(studentId);
  }
}

// 批量操作：批量同意
const batchApprove = () => {
  if (selectedStudents.value.length === 0) {
    ElNotification.warning("请选择要批量同意的学生");
    return;
  }

  useRequest({
    data: { students_id: selectedStudents.value , check: 1},
    method: "POST",
    url: "/api/teacher/student/post",
    headers: { Authorization: loginStore.token },
    manual: false,
    onBefore: () => startLoading(),
    onSuccess(data) {
      ElNotification("批量同意成功");
      updataList();
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () => {
      closeLoading();
      selectedStudents.value = []; // 清空选中的学生列表
    }
  });
}

// 批量操作：批量驳回
const batchReject = () => {
  if (content.value !== '') {
    const selectedItem = reason.value?.find((item) =>{
          if(item.reason_content === content.value) {
            return item.id;
          }
        })
    ;
    if (selectedItem) {
      rejectReasonid.value = selectedItem.id;
      console.log("选中的项的id:", rejectReasonid.value);
      // 进行你的逻辑操作，可以访问selectedItem来获取选中项的详细信息
    } else {
      console.log("未找到匹配项");
    }
  } else {
    ElNotification.warning("请选择理由");
    return;
  }
  if (selectedStudents.value.length === 0) {
    ElNotification.warning("请选择要批量驳回的学生");
    return;
  }else{
    useRequest({
      data: { students_id: selectedStudents.value , check: 2 ,reason_id:rejectReasonid.value},
      method: "POST",
      url: "/api/teacher/student/post",
      headers: { Authorization: loginStore.token },
      manual: false,
      onBefore: () => startLoading(),
      onSuccess(data) {
        ElNotification("批量取消成功");
        updataList();
      },
      onError(error) {
        console.log(error);
      },
      onFinally: () => {
        closeLoading();
        selectedStudents.value = []; // 清空选中的学生列表
      }
    });
  }
  showReasonBath.value=false
}

// 跳转到学生信息页面
const viewStudentInfo = (item: any) => {
 showDrawer.value = true;
  useRequest({
    params: { student_id: item.student_id },
    method: "GET",
    url: "/api/teacher/studentInfo",
    manual: false,
    headers: { Authorization: loginStore.token },
    onBefore: () => startLoading(),
    onSuccess(response) {
      form.value = response.data.data; // 请求成功后更新form的值
      console.log(form.value);
    },
    onError(error) {
      console.log(error);
    },
    onFinally: () =>closeLoading()
  });

}

type StudentForm = {
  address: string;
  avartar: string;
  class: string;
  email: string;
  experience: string;
  honor: string;
  interest: string;
  name: string;
  phone: string;
  plan: string;
  political_status: string;
  student_id: string;
};




</script>

