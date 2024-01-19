FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8001

CMD [ "node", "server.js" ]


# docker build . -t srk4393/<project_name>
