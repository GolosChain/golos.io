FROM node:11 as builder

ENV IN_DOCKER=1
WORKDIR /app

RUN npm install --global yarn

COPY .npmrc .yarnrc package.json yarn.lock .env .babelrc.js next.config.js ./

COPY src/ ./src

RUN yarn
RUN yarn build

FROM node:11

EXPOSE 3000
ENV NODE_ENV=production
ENV IN_DOCKER=1
WORKDIR /app

RUN npm install --global yarn

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/src/ ./src/
COPY server ./server

CMD ["yarn", "start"]
