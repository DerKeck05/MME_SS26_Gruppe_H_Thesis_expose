FROM node:22

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

ENV PORT=9000

EXPOSE 9000

CMD ["npm", "start"]
