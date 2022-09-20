FROM node:16.0.0

LABEL maintainer="webB1anyaoyao@gmail.com"

COPY . /app

WORKDIR /app

RUN npm install

RUN ls

RUN npm run build

EXPOSE 3981

CMD [ "npm", "start"]