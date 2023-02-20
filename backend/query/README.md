# Command Backend

Backend for Query handling. Connects and interacts with MongoDB.

Service exposed on Port [3004](http://localhost:3004) by default. Swagger on [`/swagger`](http://localhost:3004/swagger)

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