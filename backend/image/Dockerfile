FROM node:lts-alpine As dev

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci 

COPY --chown=node:node . .

USER node


FROM node:lts-alpine As build

WORKDIR /usr/src/app

COPY --chown=root:root package*.json ./

COPY --chown=root:root --from=dev /usr/src/app/node_modules ./node_modules

COPY --chown=root:root . .

RUN npm run build

# Up until here dir has to be owned by root for sharp to install properly
RUN npm ci --omit=dev && npm cache clean --force

RUN chown node:node .

USER node

FROM node:lts-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]