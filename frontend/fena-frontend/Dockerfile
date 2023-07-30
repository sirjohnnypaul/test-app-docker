# /frontend/Dockerfile
# Start with the official Node.js image
FROM node:alpine

# Set the working directory
WORKDIR /app

# Add the package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . ./

# Expose the port the app runs in
EXPOSE 3000

# The command to start the application
CMD ["npm", "start"]
