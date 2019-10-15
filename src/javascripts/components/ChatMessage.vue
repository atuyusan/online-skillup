<template>
  <div v-if="$props.message.type === 'system'" class="system-message">
    <p>{{ $props.message.text }}</p>
  </div>
  <div v-else :class="{'balloon balloon-me': $props.message.type === 'me', 'balloon balloon-others': $props.message.type === 'others'}">
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
      type: VueTypes.string.isRequired,
      name: VueTypes.string.isRequired,
      text: VueTypes.string.isRequired,
      time: VueTypes.string.isRequired
    })
  }
};
</script>

<style lang="scss" scoped>
$text-padding: 10px;
$ballon-margin: 10px;
$light-gray: #dcdcdc;
$gray: #808080;
$blue: #0000cd;

.balloon {
  > .meta-info {
    margin: 10px 0 5px 0;

    > .name {
      font-size: 14px;
      color: $gray;
    }

    > .time {
      font-size: 12px;
      color: $gray;
    }
  }

  > .text {
    display: inline-block;
    background-color: $light-gray;
    padding: $text-padding;
    border-radius: $text-padding;
    white-space: pre-wrap;  // テキストの改行を
    word-wrap: break-word;  // 反映する
  }
}

.balloon-me {
  text-align: right;
  margin-right: $ballon-margin;

  > .text {
    color: white;
    background-color: $blue;
  }
}

.balloon-others {
  margin-left: $ballon-margin;

  > .text {
    background-color: $light-gray;
  }
}

.system-message {
  text-align: center;
  margin: 30px 0;
}
</style>
