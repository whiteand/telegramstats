<template>
  <div class="chat-balance-charts-wrapper">
    <h4>Фильтры</h4>
    <h5>Промежуток: {{ yearRange[0] }} - {{ yearRange[1] }} </h5>
    <el-slider
      v-model="yearRange"
      range
      :min="yearBounds.min"
      :max="yearBounds.max"
    />
    <h4>Количество сообщений</h4>
    <HorizontalBarChart
      class="chart"
      :items="messageCountBallance"
      height="30px"
    />
    <h4>Написано символов текста</h4>
    <HorizontalBarChart
      class="chart"
      :items="messageTextLengthBallance"
      height="30px"
    />
    <h4>Отослано стиккеров</h4>
    <HorizontalBarChart
      class="chart"
      :items="stickerMesagesCountBalance"
      height="30px"
    />
    <h4>Количество весёлых смайлов ')'</h4>
    <HorizontalBarChart
      class="chart"
      :items="getLetterBalance(')')"
      height="30px"
    />
    <h4>Количество грустных смайлов '('</h4>
    <HorizontalBarChart
      class="chart"
      :items="getLetterBalance('(')"
      height="30px"
    />
    <h4>Медиана времени ответа (в секундах)</h4>
    <HorizontalBarChart
      class="chart"
      :items="medianResponseBalance"
      height="30px"
    />
    <h4>Беседы</h4>
    <div>
      <h5>Talk timeout: {{ fastTalkTimeout }} minutes</h5>
      <el-slider
        v-model="fastTalkTimeout"
        :min="1"
        :max="1000"
      />
      <h5>Talk count: {{ talks.length }}</h5>
      <h4>Инициатор</h4>
      <HorizontalBarChart
        class="chart"
        :items="talksInitiationBalance"
        height="30px"
      />
    </div>
  </div>
</template>
<script>
import HorizontalBarChart from '@/components/HorizontalBarChart.vue';
import { differenceInSeconds, differenceInMinutes } from 'date-fns';
import median from 'median';
import { debounce } from 'lodash';

export default {
  components: {
    HorizontalBarChart,
  },
  props: {
    chat: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      talkTimeout: 60,
      fastTalkTimeout: 60,
      yearRange: [1900, 2100],
    };
  },
  computed: {
    yearBounds() {
      return this.notFilteredMessages.length
        ? {
          min: new Date(this.notFilteredMessages[0].date).getFullYear(),
          max: new Date(this.notFilteredMessages[this.notFilteredMessages.length - 1].date).getFullYear(),
        }
        : {
          min: 1900,
          max: 2100,
        };
    },
    notFilteredMessages() {
      return this.chat ? this.chat.messages : [];
    },
    messages() {
      return this.notFilteredMessages.filter(this.filters());
    },
    talks() {
      if (this.messages.length <= 0) return [];
      const res = [[this.messages[0]]];
      let currentTalk = res[res.length - 1];
      let lastMessage = currentTalk[currentTalk.length - 1];
      for (let i = 1; i < this.messages.length; i += 1) {
        const currentMessage = this.messages[i];
        const dist = differenceInMinutes(new Date(currentMessage.date), new Date(lastMessage.date));
        if (dist <= this.talkTimeout) {
          currentTalk.push(currentMessage);
        } else {
          currentTalk = [currentMessage];
          res.push(currentTalk);
        }
        lastMessage = currentMessage;
      }
      return res;
    },
    talksInitiationBalance() {
      const { talks } = this;
      const my = talks.filter(talk => talk[0].my).length;
      const other = talks.length - my;
      return this.getBalance(my, other);
    },
    myTimeToResponse() {
      if (this.messages.length <= 0) return [];
      const { messages } = this;
      const res = [];
      for (let i = 1; i < messages.length; i += 1) {
        const currentMessage = messages[i];
        const prevMessage = messages[i - 1];
        // eslint-disable-next-line
        if (!currentMessage.my || prevMessage.my) continue;
        const currentMessageDate = new Date(currentMessage.date);
        const prevMessageDate = new Date(prevMessage.date);
        const secondsDist = differenceInSeconds(
          currentMessageDate,
          prevMessageDate,
        );
        res.push(secondsDist);
      }
      return res;
    },
    otherTimeToResponse() {
      if (this.messages.length <= 0) return [];
      const { messages } = this;
      const res = [];
      for (let i = 1; i < messages.length; i += 1) {
        const currentMessage = messages[i];
        const prevMessage = messages[i - 1];
        // eslint-disable-next-line
        if (currentMessage.my || !prevMessage.my) continue;
        const currentMessageDate = new Date(currentMessage.date);
        const prevMessageDate = new Date(prevMessage.date);
        const secondsDist = differenceInSeconds(
          currentMessageDate,
          prevMessageDate,
        );
        res.push(secondsDist);
      }
      return res;
    },
    medianResponseBalance() {
      const my = median(this.myTimeToResponse);
      const other = median(this.otherTimeToResponse);
      return this.getBalance(my, other);
    },
    myMessages() {
      return this.messages.filter(m => m.my);
    },
    otherMessages() {
      return this.messages.filter(m => !m.my);
    },
    myStickerMessages() {
      return this.myMessages.filter(m => m.mediaType === 'sticker');
    },
    otherStickerMessages() {
      return this.otherMessages.filter(m => m.mediaType === 'sticker');
    },
    stickerMesagesCountBalance() {
      return this.getBalance(
        this.myStickerMessages.length,
        this.otherStickerMessages.length,
      );
    },
    textMessages() {
      return this.messages.map(this.messageToTextMessage);
    },
    myTextMessages() {
      return this.myMessages.map(this.messageToTextMessage);
    },
    otherTextMessages() {
      return this.otherMessages.map(this.messageToTextMessage);
    },
    myText() {
      return this.myTextMessages.map(m => m.text).filter(Boolean).join('\n');
    },
    otherText() {
      return this.otherTextMessages.map(m => m.text).filter(Boolean).join('\n');
    },
    chatName() {
      return this.chat ? this.chat.name : 'Other';
    },
    messageCountBallance() {
      const myCount = this.messages.reduce((sum, m) => (m.my ? sum + 1 : sum), 0);
      const otherCount = this.messages.length - myCount;
      return this.getBalance(myCount, otherCount);
    },
    messageTextLengthBallance() {
      const my = this.myTextMessages.reduce((sum, m) => sum + m.text.length, 0);
      const other = this.otherTextMessages.reduce((sum, m) => sum + m.text.length, 0);
      return this.getBalance(
        my,
        other,
      );
    },
  },
  watch: {
    fastTalkTimeout: {
      handler: debounce(function handler(fastTalkTimeout) {
        this.onTalkTimeoutInput(fastTalkTimeout);
      }, 100),
    },
  },
  methods: {
    filters() {
      const [minYear, maxYear] = this.yearRange;
      return (message) => {
        const messageYear = new Date(message.date).getFullYear();
        return minYear <= messageYear && messageYear <= maxYear;
      };
    },
    onTalkTimeoutInput: debounce(function onTalkTimeoutInput(value) {
      this.talkTimeout = value;
    }, 1000),
    getLetterBalance(theLetter) {
      const my = this.myText.split('').reduce((sum, letter) => (letter === theLetter ? sum + 1 : sum), 0);
      const other = this.otherText.split('').reduce((sum, letter) => (letter === theLetter ? sum + 1 : sum), 0);
      return this.getBalance(my, other);
    },
    messageToTextMessage(message) {
      return {
        ...message,
        _text: message.text,
        text: message.text.filter(textElement => textElement.type === 'textMessage').map(textElement => textElement.text).join('\n'),
      };
    },
    getBalance(my, other) {
      return [
        { caption: 'Me', value: my },
        { caption: this.chatName, value: other },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-balance-charts-wrapper {
  width: 500px;
}

h4 {
  text-align: center;
}
</style>