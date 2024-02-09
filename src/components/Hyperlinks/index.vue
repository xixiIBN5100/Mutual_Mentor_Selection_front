<template>
  <div :class="styles['Hyperlinks-div-'+color]">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import styles from "./index.module.scss";

const props = withDefaults(defineProps<{
  color?: string
}>(), {
  color: ""
})

</script>