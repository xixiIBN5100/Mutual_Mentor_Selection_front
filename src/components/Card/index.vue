<template>
    <div :class="styles.glass">
      <div class="title">{{ title }}</div>
      <slot></slot>
    </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";

const props = defineProps<{
  title?: string
}>();

</script>