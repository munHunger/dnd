FROM node:16.0.0-alpine

WORKDIR /opt/dnd

COPY package.json .
RUN npm install

COPY . .
RUN npm run build
EXPOSE 3000
RUN node --version
CMD ["npm", "start"]
