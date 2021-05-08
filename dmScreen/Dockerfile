FROM node:16.0.0-alpine

WORKDIR /opt/dnd

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
