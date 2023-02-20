# Backend services

Container here are:

- Auth Service - Responsible for auth and user handling
- Command Service - Responsible for handling user input (as commands), persisting in Eventstore and projecting to ReadDB
- Query Service - Responsible for handling queries and fetching data from the ReadDB
- Image Service - Responsible for receiving and serving images as well as cropping them
