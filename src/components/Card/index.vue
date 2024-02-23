<template>
    <div :class="[ isFadingOut ? styles.fadeOut : styles.glass]">
      <div :class="[styles['card-title'], boldTitle ? styles['card-blod-title'] : undefined]">{{ title }}</div>
      <slot></slot>
    </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";
const props = withDefaults(defineProps<{
  title?: string,
  boldTitle?: boolean
  isFadingOut?: boolean
}>(), {
  boldTitle: false,
});
</script>