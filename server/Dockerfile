# Base image
FROM node:12

# Set the working directory
WORKDIR /app

# Copy the necessary files
COPY package*.json ./
COPY generateKey.js ./

# Install dependencies
RUN npm install

# Generate the encryption key
RUN node generateKey.js

# Copy the application code
COPY . .

# Expose the necessary port
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]
