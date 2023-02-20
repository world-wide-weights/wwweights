![WWWeights](https://user-images.githubusercontent.com/47084064/220177551-d6f90fd9-a4a1-4a8c-b83b-ffc39a9bbda2.png)

![Codecov](https://img.shields.io/codecov/c/gh/world-wide-weights/wwweights?flag=auth-backend&label=auth-backend)
![Codecov](https://img.shields.io/codecov/c/gh/world-wide-weights/wwweights?flag=command-backend&label=command-backend)
![Codecov](https://img.shields.io/codecov/c/gh/world-wide-weights/wwweights?flag=image-backend&label=image-backend)
![Codecov](https://img.shields.io/codecov/c/gh/world-wide-weights/wwweights?flag=query-backend&label=query-backend)
![Codecov](https://img.shields.io/codecov/c/gh/world-wide-weights/wwweights?flag=frontend&label=frontend)

## Docker quickstart

The docker compose stack should allow you to get everything up and running in no time.
However it is still required to run `npm i` manually for front- and backend.

1. Setup env in project root folder

```sh
cp sample.env .env
```

2. Start docker compose stack

```sh
docker compose up -d
```

**Note:** When using an arm based system uncheck the first env variable in sample.env to use arm friendly eventstore image

**Note:** Older version of docker might require a - between docker and compose (`docker-compose`)

Frontend: [Website](http://localhost:3000)

Auth-Backend: [API](http://localhost:3001) [Swagger](http://localhost:3001/swagger)

Command-Backend: [API](http://localhost:3002) [Swagger](http://localhost:3002/swagger)

Image-Backend: [API](http://localhost:3003) [Swagger](http://localhost:3003/swagger)

Query-Backend: [API](http://localhost:3004) [Swagger](http://localhost:3004/swagger)
