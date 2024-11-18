# Use official Node.js image as base
FROM node:22

# Set working directory
WORKDIR /usr/src/app/gAuthCraft

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Compile TypeScript files
RUN npm run build

# Expose the desired port
EXPOSE 3000

# Run the application
CMD ["node", "dist/index.js"]
