<template>
  <div class="background">
    <div :class="{ 'bg': true, 'fadeOutAndInRound': isFadingOut }">
      <div class="roud1"></div>
      <div class="roud2"></div>
      <div class="roud3"></div>
    </div>
  </div>
  <div class="contain">
    <div :class="{ 'glass': true, 'fadeOutAndIn': isFadingOut }">
      <div class="text">Login</div>
      <input type="text" class="username" placeholder="username" v-model='form.username' />
      <input type="password" class="password" placeholder="password" v-model='form.password'/>
      <button class="loginButton" v-on:click='login'>Go</button>
      <div class="switchBox">
        <div class="switch1" @click="setIdentity('teacher')">我是{{ type_ === 'teacher' ? '学生' : '老师' }}</div>
        <div class="switch2" @click="setIdentity('administrator')">我是{{ type_ === 'administrator' ? '学生' : '管理员' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "./index.scss";
import router from "@/router";
import { ref , computed , watch} from "vue";
import { startLoading, closeLoading, jumpPage } from "@/tool";
import useRequest from "@/apis/useRequest";
import { loginAPI } from "@/apis/index";
import { ElNotification } from 'element-plus'
import { useMainStore } from "@/stores";


const userStore = useMainStore().useUserStore();
const loginStore = useMainStore().useLoginStore();
const type_ = ref("");
const isFadingOut = ref(false);
const type = computed(() => {
  switch (type_.value) {
    case 'teacher':
      return 2;
    case 'administrator':
      return 3;
    default:
      return 1;
  }
});

const form = ref({
  username: "",
  password: "",
  type: 1
});

watch(type, (newValue) => {
  form.value.type = newValue;
});

const login = async () => {
  startLoading();
  try {
    const res = await loginAPI(form.value);
    console.log(res.data)
    if (res.data.code === 200 && res.data.msg === "ok") {
      if(res.data.data.msg.length>3){
        userStore.setUserIdentity(res.data.data.msg.slice(-2));
      }else{
        userStore.setUserIdentity(res.data.data.msg);
      }
      const token = res.data.data.token; // 令牌存储在响应数据的 token 字段中
      console.log(token);
      loginStore.setToken(token);
      ElNotification("登陆成功");
      loginStore.setLogin(true);
      console.log(loginStore.loginSession);
      userStore.setUserIdentity(form.value.type === 1 ? "学生" : (form.value.type === 2 ? "教师" : "管理员"));
      if(form.value.type === 1) {
        useRequest({
          params: {},
          method: "GET",
          url: "/api/student/info",
          headers: { 'Authorization' : token},
          onSuccess(response) {
            userStore.setUserInfo(response.data.data);
          },
          onError(error) {
            ElNotification("学生信息获取失败");
            console.log(error);
          },
        })
      }
      router.push("/home")
    } else {
      throw new Error(res.data.msg);
    }
  } catch (e: any) {
    ElNotification(`登录失败, ${e?.message || "未知错误"}`);
  } finally {
    closeLoading();
  }
};

const setIdentity = (identity: string) => {
  if (identity === type_.value) {
    isFadingOut.value = true;
    setTimeout(() => {
      type_.value = '';
      isFadingOut.value = false;
    }, 500);
  } else {
    isFadingOut.value = true;
    setTimeout(() => {
      type_.value = identity;
      isFadingOut.value = false;
    }, 500);
  }
  console.log(type.value)
};

</script>


