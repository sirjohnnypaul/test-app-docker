# /backend/Dockerfile
# Use an official Node runtime as the base image
FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the application files to the working directory
COPY . .

# Expose port 8000 for the application
EXPOSE 8000

# Run the application
CMD ["npm", "run", "start"]
