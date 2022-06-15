FROM telkomindonesia/alpine:nodejs-10

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk add --update --no-cache --virtual .build-dev build-base python python-dev \
         && npm i -g npm@6.14.11 \
         && npm i -g node-gyp \
         && npm i \
         && apk del .build-dev
         
COPY . .

EXPOSE 9000
CMD ["npm", "start"]
