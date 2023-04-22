FROM node:16.11.1

COPY package.json /app/
COPY src /app/src/

WORKDIR /app

RUN npm install

CMD [ "node", "src/index.js" ]