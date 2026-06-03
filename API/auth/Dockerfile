FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# SQLite data directory (mount a named volume here in docker-compose)
RUN mkdir -p /app/data

EXPOSE 3001

CMD ["node", "src/index.js"]
