<template>
  <div class="how-to">
    <div class="content">
      <h3 class="title">
        Как получить данные для загрузки?
      </h3>
      <div>
        <div class="how-to-item">
          Откройте <a
            href="https://desktop.telegram.org/"
            class="link"
          >версию</a> Telegram для Windows
        </div>
        <div class="how-to-item">
          В левом верхнем углу нажмите на <strong>кнопку меню</strong>(в виде бургера)
        </div>
        <div class="how-to-item">
          Выберите пункт меню <strong>"Настройки"</strong>
        </div>
        <div class="how-to-item">
          Выберите пункт меню <strong>"Продвинутые настройки"</strong>
        </div>
        <div class="how-to-item">
          Выберите пункт <strong>"Экспорт данных из Telegram"</strong>
        </div>
        <div class="how-to-item">
          В пункте "Настройки экспорта для сообщений" поставьте галочку напротив пункта <strong>"Личные чаты"</strong>
        </div>
        <div class="how-to-item">
          В пункте "Путь для сохранения и формат" выберите пункт <strong>"JSON для чтения компьютером"</strong>
        </div>
        <div class="how-to-item">
          Нажмите на кнопку <strong>"ЭКСПОРТИРОВАТЬ"</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/colors.scss';
@import '@/assets/variables.scss';

.how-to {
  background-color: $red;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
}

.content {
  max-width: 500px;
  padding: 10px;
  color: $red;

  & .how-to-item {
    margin-top: 20px;
    font-size: 1rem;
    padding: 5px;
    background-color: $white;


    strong {
      color: $red;
      font-size: 20px;
      line-height: 25px;
      text-shadow: 0 0 1px black;
    }
  }
}

.title {
  color: $white;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
}

.link {
  color: $blue;
}
</style>
