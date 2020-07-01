FROM node:lts-alpine AS build

WORKDIR /build

ADD package.json package-lock.json ./
RUN npm install

ADD src ./src
ADD tsconfig.json ./
RUN npx tsc

FROM node:lts-alpine AS app

WORKDIR /app
COPY --from=build /build/dist ./dist
COPY --from=build /build/package.json /build/package-lock.json ./
RUN npm install --production

CMD [ "node", "dist" ]

