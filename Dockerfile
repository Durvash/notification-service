FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Start the worker
CMD ["node", "src/worker.js"]