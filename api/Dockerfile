# Use the official Node.js LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# ✅ Use Alpine's own musl-compatible protoc + dev tools (ref:chatGPT)
RUN apk add --no-cache curl unzip protobuf protobuf-dev

# Install dependencies
COPY package*.json yarn.lock ./
RUN yarn install

# Copy the rest of the application
COPY . .

# Generate TypeScript proto bindings
RUN yarn proto:g

RUN npx prisma generate

# Build the TypeScript project
# RUN yarn build

EXPOSE 5172 50051

# Start the app
CMD ["yarn", "start:all"]
