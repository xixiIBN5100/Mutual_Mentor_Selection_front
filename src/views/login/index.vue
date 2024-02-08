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
      <input type="text" class="username" placeholder="username" v-model='username' />
      <input type="password" class="password" placeholder="password" v-model='password'/>
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
import { ref , computed } from "vue";
import { startLoading, closeLoading } from "@/tool/index";
import styles from './index.module.scss'

const username = ref("");
const password = ref("");
const type_ = ref("");
const isFadingOut = ref(false);

const login = async () => {
  startLoading();
  closeLoading();
  alert(username.value);
  alert(password.value);
  alert(type_.value);
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

const type = computed(() => {
  switch (type_.value) {
    case 'teacher':
      return '2';
    case 'administrator':
      return '3';
    default:
      return '1';
  }
});
</script>


