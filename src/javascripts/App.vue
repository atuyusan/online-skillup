<template>
  <div class="container">
    <p>
      <img class="logo" src="../images/logo.jpg" alt="ロゴ">
    </p>
    <div id="main">
      <template v-for="(message, index) in $data.messages">
        <ChatMessage
          :key="index"
          :message="message"
        />
      </template>
    </div>
    <form @submit="onSubmit" class="chat-form">
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

    // チャットルームに参加
    const name = prompt('ユーザ名を入力してください：');
    if (name) {
      this.$data.name = name;
    } else {
      this.$data.name = 'anonymous';
    }
    socket.emit('join', {
      room: 'room1',
      name: name
    });

    socket.on('system_message', (data) => {
      const message = {
        type: 'system',
        name: '',
        text: data.text,
        time: ''
      };
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

      socket.emit('send_to_others', {
        type: 'others',
        name: this.$data.name,
        text: this.$data.text,
        time: hours + ':' + minutes
      });
      socket.emit('send_to_myself', {
        type: 'me',
        name: this.$data.name,
        text: this.$data.text,
        time: hours + ':' + minutes
      });
      // 入力欄をリセット
      this.$data.name = '';
      this.$data.text = '';
      // スクロール
      this.scrollToBottom();
    },
    /**
    * 自動で下までスクロール
    */
    scrollToBottom() {
      const chatLog = document.getElementById('main');
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  }
};
</script>

<style lang="scss" scoped>
$room-width: 600px;
$btn-width: 70px;
$btn-height: 40px;
$radius: 3px;
$gap: 10px;
$blue: #0000cd;
$light-gray: #f5f5f5;

.logo {
  width: 40px;
}

.container, .chat-form {
  width: calc(100% - 50px);
  max-width: $room-width;
}

.container {
  margin: 0 auto;
}

#main {
  padding-bottom: 100px;
  overflow: scroll;
  background-color: $light-gray;
  height: 550px;
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
    color: white;
    background-color: $blue;
  }
}
</style>
