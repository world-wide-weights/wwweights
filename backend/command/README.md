# WWWeights Command Service

Available on port 3002

## Quick start

First:

```sh
npm i
cp sample.env .env
```

Run for dev:

```sh
npm run start:dev
```

Run unit tests:

```sh
npm run test
```

Run e2e tests:

```sh
npm run test:e2e
```

**NOTE**   
If you do not want to  rerun the eventstore make sure ur env variable is set to `SKIP_READ_DB_REBUILD=true`