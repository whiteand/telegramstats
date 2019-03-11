<template>
  <div
    id="footer-id"
    :class="['footer', isHighlighted ? 'highlighted' : 'not-highlighted']"
  >
    <div
      id="contact-us"
      class="contact-us"
    >
      <h4>Contact us</h4>
      <a
        class="contact-item"
        href="https://web.telegram.org/#/im?p=@andrewBeletskiy"
      >
        <span class="social-network-sign">
          <Telegram />
        </span>
        <span class="contact">@andrewBeletskiy</span>
      </a>
    </div>
    <div class="copyright">
      AndrewBeletskiy © 2019
    </div>
  </div>
</template>

<script>
import Telegram from '@/icons/telegram.svg';

export default {
  components: {
    Telegram,
  },
  props: {
    isHighlighted: {
      type: Boolean,
      default: false,
    },
  },
};
</script>


<style lang="scss" scoped>
@import '@/assets/variables.scss';
@import '@/assets/colors.scss';

.footer {
  background-color: $complement;
  padding-top: 20px;
  color: $accent;
  transition: all 500ms ease-in-out;

  &.highlighted {
    filter: brightness(1.15);
    transform: scale(1.15);
    color: $main;
    text-shadow: 0 0 5px black;
  }
}

.contact-us {
  margin-bottom: 10px;
  padding-left: 10px;
}

.copyright {
  background-color: $accent;
  color: $complement;
  padding: 10px 0;
  text-align: center;
  transition: all 0.2s ease-in;
  cursor: pointer;

  &:hover {
    color: $main;
    text-shadow: 0 0 4px $complement;
  }
}

.contact-item {
  display: flex;
  align-items: center;
  cursor: pointer;

  .social-network-sign {
    width: 25px;
  }
  .contact {
    margin-left: 5px;
    line-height: 25px;
  }
}

@media (min-width: $tiny-screen) {
  .contact-us {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .social-network-sign {
    margin-left: 10px;
  }
}
</style>
