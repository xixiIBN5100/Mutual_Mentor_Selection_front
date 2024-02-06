<template>
  <div class="background">
    <div class="bg">
      <div class="roud1"></div>
      <div class="roud2"></div>
      <div class="roud3"></div>
    </div>
  </div>
  <div class="contain">
    <div class="glass">
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
import { ref } from "vue";
import { startLoading, closeLoading } from "@/tool/index";
import 'animate.css';

const username = ref("");
const password = ref("");
const type_ = ref("");

const login = async () => {
  startLoading();
  closeLoading();
};

const setIdentity = (identity: string) => {
  type_.value = identity === type_.value ? '' : identity;
};
</script>
