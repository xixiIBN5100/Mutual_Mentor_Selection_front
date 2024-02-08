<template>
  <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="密码修改" :bold-title="true" :is-fading-out=isFadingOut>
            <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/home')"><Back /></el-icon>
      </card>
    </div>
  </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card } from "@/components/index";
import { jumpPage, isFadingOut } from "@/tool";
// import { ref } from "vue";
// import { useMainStore } from "@/stores";
isFadingOut.value = false;
</script>