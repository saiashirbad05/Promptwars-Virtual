FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Cloud Run uses the PORT environment variable
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/server.js"]
