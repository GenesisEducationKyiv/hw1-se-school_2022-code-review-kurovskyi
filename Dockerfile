FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json yarn.lock ./

RUN yarn install --frozen-lockfile --ignore-scripts

COPY --chown=node:node . .

RUN yarn build

USER node

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --chown=node:node package*.json yarn.lock ./

RUN yarn install --production --ignore-scripts

COPY --chown=node:node --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]

USER node