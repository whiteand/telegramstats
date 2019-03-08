<template>
  <div class="header">
    <router-link
      to="/"
      class="left header-item"
    >
      <div class="logo">
        <img
          src="img/colored_logo2.png"
          alt="logo"
        >
      </div>

      <h2 class="caption">
        SocialStats
      </h2>
    </router-link>
    <ul class="center header-item">
      <li class="menu-item">
        Load stats
      </li>
      <li class="menu-item">
        About site
      </li>
      <li class="menu-item">
        How to get stats
      </li>
    </ul>
    <div class="contact-us header-item">
      Contact us
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
@import '@/assets/variables.scss';

.header {
  background-color: $white;
  color: $red;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-transform: uppercase;
  padding-bottom: 1rem;

  .header-item {
    width: 100%;
    margin-bottom: 1rem;
  }

  .left {
    display: flex;
    align-items: center;
    background-color: $grey;
    transition: background-color 0.4s ease-in-out;

    .logo {
      background-color: $grey;
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
      color: $white;
      transition: color 0.4s ease-in-out;
      font-weight: 100;
      text-shadow: 0 0 2px $brown;
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

  .contact-us {
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
        box-shadow: 0 0 15px $brown inset;
      }

      .caption {
        color: $red;
      }
    }

    .center {
      justify-content: flex-start;
      margin-left: 30px;

      .menu-item {
        margin-left: 15px;
      }
    }

    .contact-us {
      display: block;
      width: 200px;
      color: $grey;
    }
  }
}
</style>
