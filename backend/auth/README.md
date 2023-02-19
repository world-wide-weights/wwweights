# Auth Service 

Backend for Auth handling. Connects and interacts with PostgreSQL.

Service exposed on Port [3003](http://localhost:3001) by default. Swagger on [`/swagger`](http://localhost:3001/swagger)

## Quickstart

```sh
cp sample.env .env
npm i
npm run start:dev
```

## Tests

Run unit tests:
```sh
npm run test
```

Run all tests:
```sh
npm run test:cov
```
