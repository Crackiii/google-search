FROM node:15

WORKDIR /var/app

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]