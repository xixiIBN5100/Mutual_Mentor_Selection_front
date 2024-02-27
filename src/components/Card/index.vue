<template>
    <div :class="[ isFadingOut ? styles.fadeOut : styles.glass]">
      <div v-if="avatarUrl">
        <img :src="avatarUrl" :class="styles.avatar" style="{height: 50px;width: 50px;}"/>
      </div>
      <div>
        <div :class="[styles['card-title'], boldTitle ? styles['card-blod-title'] : undefined]">{{ title }}</div>
        <slot></slot>
      </div>
    </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
const props = withDefaults(defineProps<{
  title?: string,
  boldTitle?: boolean
  isFadingOut?: boolean
  avatarUrl?: string
}>(), {
  boldTitle: false,
});
</script>