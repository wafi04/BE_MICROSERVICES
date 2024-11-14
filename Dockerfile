# Base stage for all services
FROM node:18-alpine AS base
WORKDIR /app

# Install yarn if not present
RUN apk add --no-cache yarn

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build applications
RUN yarn build

# API Gateway stage
FROM node:18-alpine AS api-gateway
WORKDIR /app

# Install yarn
RUN apk add --no-cache yarn

# Copy built files and dependencies
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY package.json yarn.lock ./

# Command to run the application
CMD ["yarn", "start:dev", "api-gateway"]

# Auth service stage
FROM node:18-alpine AS auth-service
WORKDIR /app

# Install yarn
RUN apk add --no-cache yarn

# Copy built files and dependencies
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY package.json yarn.lock ./

# Command to run the application
CMD ["yarn", "start:dev", "auth-service"]