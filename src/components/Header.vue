<template>
  <div class="header">
    <router-link
      to="/"
      class="left header-item"
    >
      <div class="logo">
        <img
          src="/img/colored_logo2.png"
          alt="logo"
        >
      </div>

      <h2 class="caption">
        SocialStats
      </h2>
    </router-link>
    <ul class="center header-item">
      <li
        v-for="link in links"
        :key="link.title"
        class="menu-item"
        @click="$emit(link.emit, link.id)"
      >
        {{ link.title }}
      </li>
    </ul>
    <div
      v-for="link in hiddenLinks"
      :key="link.title"
      class="hidden-item header-item"
      @click="$emit(link.emit, link.id)"
    >
      {{ link.title }}
    </div>
  </div>
</template>
<script>
import { v } from 'explained-quartet';

export default {
  props: {
    links: {
      type: Array,
      default: () => [],
      validator: v.arrayOf({
        emit: 'string',
        title: 'string',
      }),
    },
    hiddenLinks: {
      type: Array,
      default: () => [
        { to: '#contact-us', title: 'Контакты' },
      ],
      validator: v.arrayOf({
        emit: 'string',
        title: 'string',
      }),
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
@import '@/assets/variables.scss';

.header {
  background-color: $main;
  color: $complement;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-transform: uppercase;
  padding-bottom: 1rem;

  .header-item {
    width: 100%;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .left {
    display: flex;
    align-items: center;
    background-color: $accent;
    transition: background-color 0.4s ease-in-out;

    .logo {
      background-color: $accent;
      padding: 10px;
      border-bottom-right-radius:
      15px;
      border-top-right-radius: 15px;
      img {
        height: 50px;
      }

    }

    .caption {
      letter-spacing: 1px;
      margin-left: 10px;
      color: $main;
      transition: color 0.4s ease-in-out;
      font-weight: 100;
      text-shadow: 0 0 2px $complement;
    }
  }

  .center {
    width: 100%;
    display: flex;
    list-style: none;
    justify-content: space-around;
    align-items: center;
    padding: 0;
    margin: 0;
  }

  .hidden-item {
    display: none;
  }
}

@media (min-width: $tiny-screen) {
  .header {
    flex-direction: row;
    justify-content: space-between;
    padding: 0;

    .header-item {
      width: auto;
      margin-bottom: 0;
    }

    .left {
      width: auto;
      background-color: inherit;

      .logo {
        box-shadow: 0 0 15px $complement inset;
      }

      .caption {
        color: $complement;
      }
    }

    .center {
      justify-content: flex-start;
      margin-left: 30px;

      .menu-item {
        margin-left: 15px;
      }
    }

    .hidden-item {
      display: block;
      margin-left: 5px;
      width: 200px;
      color: $accent;
    }
  }
}
</style>
