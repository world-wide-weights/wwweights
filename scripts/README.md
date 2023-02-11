# Scripts

Location for all general helper scripts

## Script list

- build-all-docker.sh - Used for building main images from all services and frontend to make testing in docker compose easier
- bulk-inserter.js - Used to insert multiple entries into the backend. Please read below


## bulk-inserter.js

This can be used as a seeder

All parameters are optional:
1. localhost port => default 3002
2. filepath to json => default data/sample.env
3. chunksize for insert (may be useful for gigantic inserts) => default all at once

### Local steps

1. Make sure all backend services are running
2. Run `node bulk-inserter.js `
3. Drink coffee


### Prod steps

This script can also be used to insert data into production.

**Note from @coffemakingtoaster :** Please don`t do this on your own...Either let devops do that or do it with someone from devops

1. Set server into dev-maintenance

```sh
ssh <username>@<server> sh /home/wwweights/dev-maintenance.sh
```
2. Create ssh tunnel

```sh
ssh -L 3002:3002 <username>@<server> 
```
3. Execute script as mentioned above
4. Set prod back to normal

```sh
ssh <username>@<server> sh /home/wwweights/production.sh
```

