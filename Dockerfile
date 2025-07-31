# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Optionally install sequelize-cli globally to avoid npx issues
RUN npm install -g sequelize-cli

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node ./src/server.js"]
