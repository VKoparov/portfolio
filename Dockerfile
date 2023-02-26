# Use the official lightweight Node.js image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code to the container
COPY . .

# Build the Angular app
RUN npm run build --prod

# Expose port 80
EXPOSE 80

# Start the app
CMD ["npm", "start"]
