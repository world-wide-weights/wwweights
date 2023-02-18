# Command Backend

Backend for Command handling. Connects and interacts with EventstoreDB and MongoDB.

Service exposed on Port [3002](http://localhost:3002) by default. Swagger on [`/swagger`](http://localhost:3002/swagger)

## Quickstart

```sh
cp sample.env .env
npm i
npm run start:dev
```

**Note**: When using it with an already fully filled mongoDB it is possible to skip the eventstore replay using the `SKIP_READ_DB_REBUILD` env variable (set to `true`)

## Tests

Run unit tests:
```sh
npm run test
```

Run all tests:
```sh
npm run test:cov
```

