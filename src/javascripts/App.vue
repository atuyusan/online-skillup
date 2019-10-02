<template>
  <div class="container">
    <p>
      <img class="logo" src="../images/logo.jpg" alt="ロゴ">
    </p>
    <div class="main">
      <template v-for="(message, index) in $data.messages">
        <ChatMessage
          :key="index"
          :message="message"
        />
      </template>
    </div>
    <form @submit="onSubmit" class="chat-form">
      <div>
        <input v-model="$data.name" type="text" class="chat-form-name" placeholder="名前">
      </div>
      <div>
        <textarea v-model="$data.text" type="text" class="chat-form-text" placeholder="メッセージ"></textarea>
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

    socket.on('send_to_others', (message) => {
      this.$data.messages.push(message);
    });

    socket.on('send_to_myself', (message) => {
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
      // 入力欄をリセット
      this.$data.name = '';
      this.$data.text = '';
      socket.emit('send_to_others', message);
      socket.emit('send_to_myself', message);
    }
  },
  mounted: {

  }
};
</script>

<style lang="scss" scoped>
$btn-width: 70px;
$btn-height: 40px;
$radius: 3px;
$gap: 10px;

.logo {
  width: 40px;
}

.container, .chat-form {
  width: calc(100% - 50px);
  max-width: 800px;
}

.container {
  margin: 0 auto;
}

.main {
  // 吹き出しと入力フォームが重ならないようにする
  padding-bottom: 150px;
}

.chat-form {
  padding: $gap 0;
  position: fixed;
  bottom: 0;
  display: block;
  background-color: white;

  &-name, &-text {
    display: inline-block;
    border-radius: $radius;
    outline: none;
  }

  &-name {
    margin-bottom: $gap;
  }

  &-text {
    width: calc(100% - #{$btn-width} - #{$gap});
    height: $btn-height;
    float: left;
  }

  button {
    display: inline-block;
    width: $btn-width;
    height: $btn-height;
    float: right;
    border-radius: $radius;
    outline: none;
  }
}
</style>
