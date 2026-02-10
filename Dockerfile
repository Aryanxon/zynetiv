# Step 1: Build
# Change from node:18-alpine to node:20-alpine
FROM node:20-alpine AS builder 
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Production
# Change from node:18-alpine to node:20-alpine
FROM node:20-alpine 
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main"]
