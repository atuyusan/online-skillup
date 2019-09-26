<template>
  <div>
    <p>
      <img class="logo" src="../images/logo.jpg" alt="ロゴ">
    </p>
    <template v-for="(message, index) in $data.messages">
      <ChatMessage
        :key="index"
        :message="message"
      />
    </template>
    <form @submit="onSubmit">
      <div>
        <input v-model="$data.name" type="text">
      </div>
      <div>
        <textarea v-model="$data.text" type="text"></textarea>
      </div>
      <button type="submit">送信</button>
    </form>
  </div>
</template>

<script>
import socket from './utils/socket';

// components
import ChatMessage from './components/ChatMessage.vue';

export default {
  components: {
    ChatMessage
  },
  data() {
    return {
      messages: [],
      name: '',
      text: ''
    };
  },
  created() {
    socket.on('connect', () => {
      console.log('connected!');
    });

    socket.on('send', (message) => {
      console.log(message);
      this.$data.messages.push(message);
    });
  },
  methods: {
    /**
     * Enterボタンを押したとき
     */
    onSubmit(e) {
      e.preventDefault();
      const now = new Date();
      const hours = now.getHours();
      const minutes = ('0' + now.getMinutes()).slice(-2);
      const message = {
        name: this.$data.name,
        text: this.$data.text,
        time: hours + ':' + minutes
      };
      socket.emit('send', message);
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 40px;
}

.sample {
  color: $red;
}
</style>
