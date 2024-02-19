<template>
 <div :class="styles.background">
    <div :class="styles.contain">
      <card :class="styles['title-bar']" title="学生信息" :bold-title="true" :is-fading-out=isFadingOut>
        <el-icon :class="styles['back-button']" :size="30" @click="() => jumpPage('/approval')"><Back /></el-icon>
      </card>
      <div style="display: flex;justify-content: center;">
      <card :class="styles.info" :is-fading-out=isFadingOut style="width: 80%;"> 
      </card>
    </div>
    </div>
 </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
import { Card, DarkButton } from "@/components/index";
import { jumpPage, isFadingOut } from "@/tool";
import { ref } from "vue";
isFadingOut.value = false;
</script>