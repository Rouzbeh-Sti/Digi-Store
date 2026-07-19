# Use the official Node.js long-term support image as the base
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package management files first to leverage Docker caching
COPY package*.json ./
COPY prisma ./prisma/

# 1. Install ALL dependencies (including devDependencies like the prisma CLI)
RUN npm ci

# 2. Generate Prisma Client using the locally installed CLI
RUN npx prisma generate

# 3. Prune dev dependencies to keep the production image small
RUN npm prune --omit=dev

# Copy the rest of the application source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]