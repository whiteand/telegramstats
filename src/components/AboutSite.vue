<template>
  <div class="about-site">
    <div class="content">
      <h3 class="title">
        Про сайт
      </h3>
      <p class="paragraph">
        Данный сайт создан для просмотра графиков и диаграм построенных
        на основании данных о сообщениях в мессенджере Telegram.
      </p>
      <p class="paragraph">
        Цель этого сайта: удовлетворение любопытства для тех, кто любит
        статистику и заинтересован в статистических деликатесах.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.about-site {
  min-height: 100vh;
  background-color: $complement;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: $main;
}

.about-site .title {
  text-align: center;
  font-size: 2rem;
  text-transform: uppercase;
  margin-bottom: 30px;
}

.about-site .paragraph {
  max-width: 500px;
  padding: 0 10px;
  font-size: 1.5rem;
}
</style>
