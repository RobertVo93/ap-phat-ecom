# Dev-friendly Dockerfile for ECOM app
# Works with docker-compose volume mounts and `npm run dev`

FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the app (will be overlaid by compose volume in dev)
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


