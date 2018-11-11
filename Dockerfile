FROM node:8.2.1-alpine

WORKDIR /opt/app

ENV MONGODB_URI changeme

RUN npm install -g nodemon

COPY ./application/package.json /opt/app/package.json
RUN npm install
RUN mv /opt/app/node_modules /node_modules

COPY ./application /opt/app

CMD ["npm", "start"]