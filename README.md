# Цифровая визитка

Backend на NestJS, GraphQL и PostgreSQL. При первом запуске миграции применяются сами, база заполняется данными из [`src/prisma/seed-data.ts`](src/prisma/seed-data.ts). Повторный старт данные не дублирует.

API визитки есть в дереве. Интерактивная схема — Apollo Sandbox. В git этот код не закоммичен.

## Запуск

```bash
docker compose up --build
```

Apollo Sandbox: [http://localhost:3000/graphql](http://localhost:3000/graphql)

```graphql
query {
  profile {
    name
    description
    links {
      label
      url
    }
    skills {
      name
    }
    experience {
      company
      position
      startDate
      endDate
      achievements
    }
    projects {
      name
      url
    }
  }
}
```

Свои данные правятся только в `src/prisma/seed-data.ts`. Чтобы перезаполнить уже созданную базу, удалите volume: `docker compose down -v`, затем снова `docker compose up --build`.
