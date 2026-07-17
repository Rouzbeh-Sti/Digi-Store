# Use the official Node.js long-term support image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package management files first to leverage Docker caching
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies and generate Prisma Client
RUN npm ci --only=production
RUN npx prisma generate

# Copy the rest of the application source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]