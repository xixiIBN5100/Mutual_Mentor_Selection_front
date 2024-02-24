<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="个人信息" :bold-title="true" :is-fading-out=isFadingOut>
        <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/approval')"><Back /></el-icon>
      </card>
      <card  v-if="form" :class="styles.container" :is-fading-out=isFadingOut>
        <div style="display: flex;">
        <div :class="styles.form">
        <span :class="styles.info">姓名: {{ form.name }}</span>
        <span :class="styles.info">班级: {{ form.class }}</span>
        <span :class="styles.info">学号: {{ form.student_id }}</span>
        <span :class="styles.info">地址: {{ form.address }}</span>
        </div>
        <div :class="styles.form">
        <span :class="styles.info">邮箱: {{ form.email }}</span>
        <span :class="styles.info">电话: {{ form.phone }}</span>
        <span :class="styles.info">政治面貌: {{ form.political_status}}</span>
        <span :class="styles.info">职业方向: {{ form.plan }}</span>
        </div>
      </div>

      <div :class="styles.form2">
      <span :class="styles.info">项目实践经历:<br> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; &ensp;&ensp;&ensp;{{ form.experience }}</span>
        <span :class="styles.info">个人荣誉: <br> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{{ form.honor }}</span>
        <span :class="styles.info">个人专业研究兴趣方向: <br>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{{ form.interest }}</span>
      </div>
      </card>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card, DarkButton } from "@/components/index";
import { jumpPage, isFadingOut ,startLoading,closeLoading} from "@/tool";
import { ref } from "vue";
import { useMainStore } from "@/stores";
import { ElNotification } from "element-plus";
import useRequest from "@/apis/useRequest";

isFadingOut.value = false;

const student_id = localStorage.getItem('student_id');
console.log(student_id)

const userStore = useMainStore().useUserStore();
const loginStore = useMainStore().useLoginStore();

type StudentForm = {
  address: string;
  avatar: string;
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

const form = ref<StudentForm>(); // 初始化为undefined

useRequest({
  params: { student_id: student_id },
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
</script>
