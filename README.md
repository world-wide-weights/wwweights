# wwweights

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

**Note:** Older version of docker might require a - between docker and compose (`docker-compose`)

Frontend: [Website](http://localhost:3000)

Auth-Backend: [API](http://localhost:3001) [Swagger (in progress)](https://www.epicgames.com/fortnite/en-US/home)

Command-Backend: [API](http://localhost:3002) [Swagger](http://localhost:3002/swagger)

Image-Backend: [API](http://localhost:3003) [Swagger (in progress)](https://www.epicgames.com/fortnite/en-US/home)

Query-Backend: [API](http://localhost:3004) [Swagger](http://localhost:3004/swagger)
