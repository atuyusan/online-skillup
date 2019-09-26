<template>
  <div>{{ $props.message }}</div>
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
//
</style>
