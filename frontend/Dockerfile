FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

CMD ["serve", "-s", "dist", "-p", "3000"]
