# Use Node.js as base image
FROM mcr.microsoft.com/playwright:v1.50.1-noble

# Set working directory
WORKDIR /app

# Copy package files first (to leverage caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose ports for API and Vite
EXPOSE 3000 5173

## Start both Vite and Express servers
CMD ["node", "scripts/server.js"]