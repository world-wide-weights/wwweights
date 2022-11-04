# wwweights
## Docker quickstart
The docker compose stack should allow you to get everything up and running in no time.
However it is still required to run `npm i` manually for front- and backend.
1. Install node dependencies
```sh
cd backend
npm i
cd ../frontend
npm i
```
2. Setup env in project root folder
```sh
cp sample.env .env
```
3. Start docker compose stack
```sh
docker compose up -d
```
**Note:** Older version of docker might require a - between docker and compose (`docker-compose`)

Frontend is now accessible on port [3000](http://localhost:3000)    
Backend is now accessible on port [3001](http://localhost:3001)    
Postgres is now accessible on port 5432. It is highly recommended to use pg admin to access postgres.    

