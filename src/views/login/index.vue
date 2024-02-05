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
      <input type='text' class='username' placeholder='type' v-model='type' />
      <button class="loginButton" v-on:click='login'>Go</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import "./index.scss";
import {ref} from "vue";

const username = ref("");
const password = ref("");
const type = ref();

const login = async () => {
  alert(username.value)
  alert(password.value)
  alert(type.value)
};

</script>
