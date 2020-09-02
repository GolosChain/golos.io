# Golos.io

## Установка

#### Склонировать репозиторий

```bash
git clone https://github.com/goloschain/golos.io
cd golos.io
```

#### Создать .env файл

```bash
cp .env.example .env
```

Добавить переменные

### Development

Установка зависимостей и запуск сервера:

```bash
yarn
# запуск с обновлениями при изменениях кода
yarn dev
# или
yarn start
```

Теперь у вас есть development окружение:

- [localhost:3000](http://localhost:3000) - nextjs с golos.io

### Production

Если вы хотите протестировать проект локально в production окружении и использовать docker-compose для его запуска, просто выполните следующие команды:

```bash
docker-compose up
```

Теперь у вас есть production окружение:

- [localhost:3000](http://localhost:3000) - nextjs с golos.io

#### Deploy

В ручном режиме деплоя нужно выполнить следующие команды:

```bash
git clone https://github.com/goloschain/golos.io
cd golos.io
sudo docker-compose up --build
```

при повторных деплоях:

```bash
git pull
sudo docker-compose up --build
```

### Проблемы

Если вы обнаружите некритическую проблему, сообщите подробности по адресу: https://github.com/goloschain/golos.io/issues

Чтобы сообщить о проблеме с безопасностью, свяжитесь с владельцами проекта.
