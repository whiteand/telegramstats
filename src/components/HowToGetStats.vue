<template>
  <div class="how-to">
    <div class="content">
      <h3 class="title">
        Как получить данные для загрузки?
      </h3>
      <div>
        <div class="how-to-item">
          1. Откройте <a
            href="https://desktop.telegram.org/"
            class="link"
          >версию</a> Telegram для Windows
        </div>
        <div class="how-to-item">
          2. В левом верхнем углу нажмите на
          <strong>кнопку меню</strong>(в виде бургера)
        </div>
        <div class="how-to-item">
          3. Выберите пункт меню
          <strong>"Настройки"</strong>
        </div>
        <div class="how-to-item">
          4. Выберите пункт меню <strong>"Продвинутые настройки"</strong>
        </div>
        <div class="how-to-item">
          5. Выберите пункт <strong>"Экспорт данных из
            Telegram"</strong>
        </div>
        <div class="how-to-item">
          6. В пункте "Настройки экспорта для сообщений"
          поставьте галочку напротив пункта
          <strong>"Личные чаты"</strong>
        </div>
        <div class="how-to-item">
          7. В пункте "Путь для сохранения и формат"
          выберите пункт <strong>"JSON для
            чтения компьютером"</strong>
        </div>
        <div class="how-to-item">
          8. Нажмите на кнопку <strong>"ЭКСПОРТИРОВАТЬ"</strong>
        </div>
        <div
          class="how-to-item last"
          @click="$emit('toLoadStats')"
        >
          9. Загрузите данные нажав
          на кнопку <strong>Загрузить</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
@import '@/assets/variables.scss';

.how-to {
  background-color: $accent;
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 100vh;
}

.content {
  max-width: 600px;
  padding: 10px 0;
  color: $complement;

  & .how-to-item {
    font-size: 1rem;
    padding: 5px 15px;
    background-color: $main;

    &.last {
      background-color: $complement;
      color: $main;
      cursor: pointer;

      strong {
        color: inherit;
      }
    }

    strong {
      color: $complement;
      font-size: 1.2rem;
      line-height: 25px;
      text-shadow: 0 0 1px black;
    }
  }
}

.title {
  color: $main;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
}

.link {
  color: $accent;
}

@media (min-width: $tiny-screen) {
  .content {
    padding: 10px;
  }

  .content .how-to-item {
    margin-top: 20px;
  }
}
</style>
