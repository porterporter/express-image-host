FROM node:18-buster-slim

RUN mkdir -p /usr/src/image-host
WORKDIR /usr/src/image-host

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends libssl-dev dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . /usr/src/image-host

ENTRYPOINT ["dumb-init", "--"]

RUN yarn install --immutable

RUN yarn run db:prod

RUN yarn run build

ENV NODE_ENV production

CMD [ "yarn", "run", "start"]
