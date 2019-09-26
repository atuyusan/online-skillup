<template>
  <div>
    <div class="meta-info">
      <span class="name">{{ $props.message.name }}</span>
      <span class="time">{{ $props.message.time }}</span>
    </div>
    <div class="text">{{ $props.message.text }}</div>
  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  props: {
    message: VueTypes.shape({
      name: VueTypes.string.isRequired,
      text: VueTypes.string.isRequired,
      time: VueTypes.string.isRequired
    })
  }
};
</script>

<style lang="scss" scoped>
$padding-val: 10px;
$light-gray: #dcdcdc;
$gray: #808080;

.meta-info {
  margin: 10px 0 5px 0;
}

.name {
  font-size: 14px;
  color: $gray;
}

.time {
  font-size: 12px;
  color: $gray;
}

.text {
  display: inline-block;
  background-color: $light-gray;
  padding: $padding-val;
  border-radius: $padding-val;
  white-space: pre-wrap;  // テキストの改行を
  word-wrap: break-word;  // 反映する
}
</style>
