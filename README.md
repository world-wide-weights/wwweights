# wwweights

[![Codecov](https://img.shields.io/codecov/c/gh/world-wide-weights/wwweights?flag=auth-backend&label=auth-backend)](https://app.codecov.io/gh/world-wide-weights/wwweights)
[![Codecov](https://img.shields.io/codecov/c/gh/world-wide-weights/wwweights?flag=command-backend&label=command-backend)](https://app.codecov.io/gh/world-wide-weights/wwweights)
[![Codecov](https://img.shields.io/codecov/c/gh/world-wide-weights/wwweights?flag=image-backend&label=image-backend)](https://app.codecov.io/gh/world-wide-weights/wwweights)
[![Codecov](https://img.shields.io/codecov/c/gh/world-wide-weights/wwweights?flag=query-backend&label=query-backend)](https://app.codecov.io/gh/world-wide-weights/wwweights)
[![Codecov](https://img.shields.io/codecov/c/gh/world-wide-weights/wwweights?flag=frontend&label=frontend)](https://app.codecov.io/gh/world-wide-weights/wwweights)

## Quickstart

The docker compose stack should allow you to get everything up and running in no time.

```sh
docker compose up
```

All necessary values use a fallback by default. To overwrite these simply copy the sample.env

```sh
cp sample.env .env
```

**Note:** When using an arm based system uncheck the first env variable in sample.env to use arm friendly eventstore image

**Note:** Older version of docker might require a - between docker and compose (`docker-compose`)

| Service         | Link                               | Swagger                                   |
| --------------- | ---------------------------------- | ----------------------------------------- |
| Frontend        | [ Website ](http://localhost:3000) | -                                         |
| Auth Service    | [ API](http://localhost:3001)      | [Swagger ](http://localhost:3001/swagger) |
| Command Service | [ API](http://localhost:3002)      | [Swagger ](http://localhost:3002/swagger) |
| Query Service   | [ API](http://localhost:3003)      | [Swagger ](http://localhost:3003/swagger) |
| Image Service   | [ API](http://localhost:3004)      | [Swagger ](http://localhost:3004/swagger) |

## Sample data

These users are loaded automatically:

| email                               | username       | password                   |
| ----------------------------------- | -------------- | -------------------------- |
| serious@business.com                | GoodGradeGiver | DamnWeReallyWantAGoodGrade |
| i.create.mock.data@entertaiment.com | AdditionalUser | IAmButAHumbleNPC           |

To insert sample data use the prepared inserter script:

```sh
cd scripts
node bulk-inserter.js
```

**Note**: This uses `fetch`, therefore node 18+ is required
