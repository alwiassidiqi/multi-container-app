# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
#RUN npm install --omit=dev
RUN npm install --only=production
COPY . .

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./

CMD ["node", "index.js"]
