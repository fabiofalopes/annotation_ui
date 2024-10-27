# Update to Node 18
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install nodemon globally for development
RUN npm install -g nodemon

# Expose both the React and Express ports
EXPOSE 3721 3722

# Define the command to run both servers
CMD ["npm", "run", "dev"]