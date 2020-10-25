FROM node:lts-alpine AS build

WORKDIR /build

ADD package.json package-lock.json ./
RUN npm install

ADD src ./src
ADD tsconfig.json ./
RUN npx tsc

FROM node:lts-alpine AS app

# Needed for the pg_isready call in start script
RUN apk add postgresql-client

WORKDIR /app
COPY --from=build /build/dist ./dist
COPY --from=build /build/package.json /build/package-lock.json ./
RUN npm install --production
ADD static ./static
ADD start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh

CMD [ "/usr/bin/start.sh" ]

