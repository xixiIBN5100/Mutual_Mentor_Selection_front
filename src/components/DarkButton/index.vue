<template>
  <div :class="['dark-button-'+color, 'dark-button-'+size]">
    {{ inner }}
  </div>
</template>

<script setup lang="ts">
import "./index.scss";
import { defineProps } from 'vue';

const props = withDefaults(defineProps<{
  inner?: string,
  color?: string,
  size?: string
}>(), {
  inner: "按钮",
  color: "primary",
  size: "middle"
});

/*
传参说明
inner：控制按钮内内容
color：控制颜色 [primary(默认灰色), green, blue, red, yellow, pink]
size： 控制大小 [large, middle(默认), small]
*/

</script>